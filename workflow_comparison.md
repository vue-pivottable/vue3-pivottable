# Release Workflow Comparison: Main vs Develop

## Overview
Both branches have a workflow named "Release (Simplified)" that triggers on push to main branch.

## Key Differences

### 1. Version Update Logic
**Main Branch:**
```bash
PKG_BASE=$(echo $PKG_VERSION | sed 's/-beta.*//')
```

**Develop Branch:**
```bash
# Remove all beta suffixes (handle multiple -beta occurrences)
PKG_BASE=$(echo $PKG_VERSION | sed 's/-beta.*$//')
```
- Develop branch has a comment explaining the sed pattern
- Both use similar regex patterns but develop uses `$` anchor

### 2. Post-Release Branch Creation Steps

**Main Branch:**
- Ends after creating release branch
- Only outputs information about what the release branch workflow will handle
- No actual npm publishing, GitHub releases, or PR creation

**Develop Branch:**
- Continues with full release process:
  1. Checks out the release branch
  2. Publishes to npm
  3. Creates GitHub releases
  4. Syncs with develop branch (auto-merge)
  5. Creates PR to main branch

### 3. Workflow Completeness

**Main Branch Workflow:**
- Creates release branch only
- Delegates remaining tasks to a separate release branch workflow
- Last step just echoes what will happen next

**Develop Branch Workflow:**
- Complete end-to-end release process
- Handles all release tasks within the same workflow
- Includes npm publishing with tokens
- Creates GitHub releases with proper formatting
- Auto-merges to develop
- Creates PR back to main

### 4. Sync with Develop Logic Difference
**Main Branch (in release-branch.yml):**
```bash
# Create a temporary branch for merging
TEMP_BRANCH="temp-sync-$(date +%s)"
git checkout -b $TEMP_BRANCH

# Merge into develop
git checkout develop
git pull origin develop
git merge $TEMP_BRANCH --no-edit -m "chore: sync release ${{ github.ref_name }} to develop"
```
- Uses a temporary branch approach
- Pulls latest develop before merging

**Develop Branch:**
```bash
# Fetch latest develop
git fetch origin develop:develop

# Merge release branch into develop
git checkout develop
git merge ${{ steps.create-release.outputs.release_branch }} --no-edit -m "chore: sync release ${{ steps.create-release.outputs.release_branch }} to develop"
```
- Directly fetches and merges
- Uses the release branch output variable

### 5. Environment Variables
**Main Branch:**
- No npm tokens used

**Develop Branch:**
- Uses `NPM_TOKEN` and `NPM_TOKEN_SUMIN` for publishing
- Uses `GITHUB_TOKEN` for GitHub operations

## Summary
The main difference is architectural:

1. **Main branch uses a two-workflow approach:**
   - `release.yml` - Creates the release branch only
   - `release-branch.yml` - Triggers on `release/v*` branches and handles:
     - npm publishing
     - GitHub releases
     - Syncing with develop
     - Creating PR to main

2. **Develop branch uses a single-workflow approach:**
   - `release.yml` - Handles everything in one workflow:
     - Creates release branch
     - Publishes to npm
     - Creates GitHub releases
     - Syncs with develop
     - Creates PR to main

## Why This Matters
The main branch's two-workflow approach can be more reliable because:
- Each workflow has a single responsibility
- The release branch workflow triggers automatically when the branch is created
- Easier to debug and maintain

However, the develop branch's single-workflow approach:
- Is simpler to understand
- Completes faster (no waiting for second workflow)
- But may be harder to debug if something fails midway

This explains why releases from main might appear to "fail" initially - they're not failing, they're just delegating the actual release work to a separate workflow that triggers on the release branch creation.