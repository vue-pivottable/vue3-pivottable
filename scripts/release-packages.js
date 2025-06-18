#!/usr/bin/env node

/**
 * 독립적인 패키지 배포 스크립트
 * 각 패키지를 개별적으로 빌드하고 배포합니다.
 * 하나가 실패해도 다른 패키지는 계속 진행됩니다.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 패키지 목록
const packages = [
  {
    name: 'vue-pivottable',
    path: '.',
    buildCmd: 'pnpm build',
    npmToken: 'NPM_TOKEN'
  },
  {
    name: '@vue-pivottable/lazy-table-renderer',
    path: 'packages/lazy-table-renderer',
    buildCmd: 'pnpm -F @vue-pivottable/lazy-table-renderer build',
    npmToken: 'NPM_TOKEN'
  },
  {
    name: '@vue-pivottable/plotly-renderer',
    path: 'packages/plotly-renderer',
    buildCmd: 'pnpm -F @vue-pivottable/plotly-renderer build',
    npmToken: 'NPM_TOKEN_SUMIN'
  }
];

// 색상 출력을 위한 헬퍼
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`
};

// 각 패키지 처리
async function releasePackages() {
  const results = [];
  
  for (const pkg of packages) {
    console.log(colors.blue(`\n🚀 Processing ${pkg.name}...`));
    
    // 빌드 시도
    try {
      console.log(colors.yellow(`  Building ${pkg.name}...`));
      execSync(pkg.buildCmd, { stdio: 'inherit' });
      console.log(colors.green(`  ✅ Build successful`));
    } catch (error) {
      console.log(colors.red(`  ❌ Build failed for ${pkg.name}`));
      results.push({ package: pkg.name, status: 'build failed' });
      continue; // 다음 패키지로 진행
    }
    
    // 배포 시도
    try {
      console.log(colors.yellow(`  Publishing ${pkg.name}...`));
      
      // 올바른 NPM 토큰 설정
      const npmToken = process.env[pkg.npmToken];
      if (!npmToken) {
        throw new Error(`${pkg.npmToken} not found in environment`);
      }
      
      // changeset publish 실행
      const publishCmd = `cd ${pkg.path} && NPM_TOKEN=${npmToken} pnpm changeset publish`;
      execSync(publishCmd, { 
        stdio: 'inherit',
        env: { ...process.env, NPM_TOKEN: npmToken }
      });
      
      console.log(colors.green(`  ✅ Published successfully`));
      results.push({ package: pkg.name, status: 'success' });
    } catch (error) {
      console.log(colors.red(`  ❌ Publish failed for ${pkg.name}`));
      results.push({ package: pkg.name, status: 'publish failed' });
    }
  }
  
  // 결과 요약
  console.log(colors.blue('\n📊 Release Summary:'));
  results.forEach(result => {
    const icon = result.status === 'success' ? '✅' : '❌';
    const color = result.status === 'success' ? colors.green : colors.red;
    console.log(`  ${icon} ${result.package}: ${color(result.status)}`);
  });
  
  // 하나라도 실패했으면 exit code 1 반환 (optional)
  const hasFailures = results.some(r => r.status !== 'success');
  if (hasFailures) {
    console.log(colors.yellow('\n⚠️  Some packages failed, but others were published successfully'));
    // process.exit(1); // CI에서 실패로 표시하려면 주석 해제
  }
}

// 실행
releasePackages().catch(error => {
  console.error(colors.red('Unexpected error:'), error);
  process.exit(1);
});