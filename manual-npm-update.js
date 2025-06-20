#!/usr/bin/env node

/**
 * Manual npm release script to fix the version sync issue
 * This script will:
 * 1. Update npm latest tag to match main branch version
 * 2. Ensure all packages are properly published
 */

const { execSync } = require('child_process');
const fs = require('fs');

function log(message) {
  console.log(`🔧 ${message}`);
}

function error(message) {
  console.error(`❌ ${message}`);
}

function success(message) {
  console.log(`✅ ${message}`);
}

async function main() {
  try {
    // Check current main branch version
    const mainPackageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const mainVersion = mainPackageJson.version;
    
    log(`Main branch version: ${mainVersion}`);
    
    // Check current npm latest tag
    const currentLatest = execSync('npm view vue-pivottable dist-tags.latest', { encoding: 'utf8' }).trim();
    log(`Current npm latest: ${currentLatest}`);
    
    if (currentLatest === mainVersion) {
      success(`npm latest tag is already correct: ${mainVersion}`);
      return;
    }
    
    // Check if the main version exists on npm
    try {
      const versionExists = execSync(`npm view vue-pivottable@${mainVersion} version`, { encoding: 'utf8' }).trim();
      if (versionExists === mainVersion) {
        log(`Version ${mainVersion} exists on npm, updating latest tag...`);
        
        // Update latest tag
        execSync(`npm dist-tag add vue-pivottable@${mainVersion} latest`);
        success(`Updated npm latest tag to ${mainVersion}`);
        
        // Verify the update
        const newLatest = execSync('npm view vue-pivottable dist-tags.latest', { encoding: 'utf8' }).trim();
        if (newLatest === mainVersion) {
          success(`✨ npm latest tag successfully updated to ${mainVersion}`);
        } else {
          error(`Failed to update npm latest tag. Current: ${newLatest}, Expected: ${mainVersion}`);
        }
      }
    } catch {
      error(`Version ${mainVersion} does not exist on npm. Need to publish it first.`);
      log('This requires running the release workflow from main branch.');
      process.exit(1);
    }
    
  } catch (err) {
    error(`Script failed: ${err.message}`);
    process.exit(1);
  }
}

main();