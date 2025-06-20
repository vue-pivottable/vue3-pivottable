#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

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

// Get release tag from environment variable
const releaseTag = process.env.RELEASE_TAG || 'latest';
log.info(`Publishing with tag: ${releaseTag}`);

// Package configurations
const packages = [
  {
    name: 'vue3-pivottable',
    path: '.',
    buildCmd: 'pnpm clean && pnpm build',
    publishCmd: `pnpm changeset publish --tag ${releaseTag}`
  },
  {
    name: '@vue-pivottable/plotly-renderer',
    path: './packages/plotly-renderer',
    buildCmd: 'pnpm --filter @vue-pivottable/plotly-renderer clean && pnpm --filter @vue-pivottable/plotly-renderer build',
    publishCmd: `pnpm changeset publish --filter @vue-pivottable/plotly-renderer --tag ${releaseTag}`,
    tokenEnv: 'NPM_TOKEN_SUMIN'
  },
  {
    name: '@vue-pivottable/lazy-table-renderer',
    path: './packages/lazy-table-renderer',
    buildCmd: 'pnpm --filter @vue-pivottable/lazy-table-renderer clean && pnpm --filter @vue-pivottable/lazy-table-renderer build',
    publishCmd: `pnpm changeset publish --filter @vue-pivottable/lazy-table-renderer --tag ${releaseTag}`,
    tokenEnv: 'NPM_TOKEN_SUMIN'
  }
];

// Release packages with fault tolerance
async function releasePackages() {
  log.info('Starting release process...');
  
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

      // Get package version
      const packageJsonPath = `${pkg.path}/package.json`;
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const currentVersion = packageJson.version;

      // Skip if not a beta version (no changeset)
      if (!currentVersion.includes('-beta')) {
        log.info(`Skipping ${pkg.name} - no beta version (${currentVersion})`);
        continue;
      }

      // Build package
      log.info(`Building ${pkg.name}...`);
      execSync(pkg.buildCmd, { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      log.success(`${pkg.name} built successfully`);

      // Set npm token if needed
      if (pkg.tokenEnv && process.env[pkg.tokenEnv]) {
        process.env.NPM_TOKEN = process.env[pkg.tokenEnv];
      }

      // Publish package
      log.info(`Publishing ${pkg.name}...`);
      execSync(pkg.publishCmd, { 
        stdio: 'inherit',
        cwd: process.cwd(),
        env: process.env
      });
      
      log.success(`${pkg.name} published successfully`);
      results.success.push(pkg.name);
      
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
  log.info('Release Summary:');
  
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
    log.success('All packages released successfully!');
  }
}

// Run release
releasePackages().catch((error) => {
  log.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});