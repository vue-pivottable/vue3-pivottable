#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
// ES modules support

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Helper function to log with color
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
};

// Package configurations
const packages = [
  {
    name: 'vue3-pivottable',
    path: '.',
    publishCmd: 'npm publish --tag beta'
  },
  {
    name: '@vue-pivottable/plotly-renderer',
    path: './packages/plotly-renderer',
    publishCmd: 'npm publish --tag beta',
    tokenEnv: 'NPM_TOKEN_SUMIN'
  },
  {
    name: '@vue-pivottable/lazy-table-renderer',
    path: './packages/lazy-table-renderer',
    publishCmd: 'npm publish --tag beta',
    tokenEnv: 'NPM_TOKEN_SUMIN'
  }
];

// Release packages with beta tag
async function releasePackagesBeta() {
  log.info('Starting beta release process...');
  
  const results = {
    success: [],
    failed: []
  };

  for (const pkg of packages) {
    log.info(`\nProcessing ${pkg.name}...`);
    
    try {
      // Check if package directory exists
      if (!fs.existsSync(pkg.path)) {
        throw new Error(`Package directory not found: ${pkg.path}`);
      }

      // Check if package.json has beta version
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(pkg.path, 'package.json'), 'utf8')
      );
      
      if (!packageJson.version.includes('beta')) {
        log.warning(`${pkg.name} version ${packageJson.version} is not a beta version, skipping...`);
        continue;
      }

      // Set npm token if needed
      if (pkg.tokenEnv && process.env[pkg.tokenEnv]) {
        process.env.NPM_TOKEN = process.env[pkg.tokenEnv];
      }

      // Publish package
      log.info(`Publishing ${pkg.name}@${packageJson.version} with beta tag...`);
      execSync(pkg.publishCmd, { 
        stdio: 'inherit',
        cwd: pkg.path,
        env: process.env
      });
      
      log.success(`${pkg.name}@${packageJson.version} published successfully`);
      results.success.push(`${pkg.name}@${packageJson.version}`);
      
    } catch (error) {
      log.error(`Failed to release ${pkg.name}: ${error.message}`);
      results.failed.push({
        name: pkg.name,
        error: error.message
      });
      // Continue with next package
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  log.info('Beta Release Summary:');
  
  if (results.success.length > 0) {
    log.success(`Successfully released: ${results.success.join(', ')}`);
  }
  
  if (results.failed.length > 0) {
    log.error(`Failed to release:`);
    results.failed.forEach(({ name, error }) => {
      console.log(`  - ${name}: ${error}`);
    });
    
    // Exit with error code if any package failed
    process.exit(1);
  } else {
    log.success('All packages released successfully with beta tag!');
  }
}

// Run release
releasePackagesBeta().catch((error) => {
  log.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});