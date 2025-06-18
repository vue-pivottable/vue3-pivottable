# Release Strategy

## Overview

This document outlines the release strategy for the vue3-pivottable monorepo, which uses Changesets for version management and supports independent package releases.

## Architecture

```mermaid
graph TB
    subgraph "Development Flow"
        A[Developer creates feature branch] --> B[Make changes]
        B --> C[Run 'pnpm changeset add']
        C --> D[Create PR to develop]
        D --> E[Code Review]
        E --> F[Merge to develop]
    end
    
    subgraph "Pre-release Flow (Beta)"
        F --> G[Push to develop branch]
        G --> H[GitHub Actions triggered]
        H --> I[Build all packages]
        I --> J[Publish with beta tag]
    end
    
    subgraph "Production Release Flow"
        F --> K[Create PR: develop → main]
        K --> L[Merge to main]
        L --> M[GitHub Actions triggered]
        M --> N[Create release/vX.X.X branch]
        N --> O[Run changeset version]
        O --> P[Build packages]
        P --> Q[Publish to npm]
    end
```

## Package Structure

Our monorepo contains three independently versioned packages:

```mermaid
graph TD
    A[vue3-pivottable monorepo] --> B[vue3-pivottable<br/>Main package]
    A --> C[@vue-pivottable/plotly-renderer<br/>Plotly visualization]
    A --> D[@vue-pivottable/lazy-table-renderer<br/>Virtual scrolling table]
    
    B --> E[NPM_TOKEN]
    C --> F[NPM_TOKEN_SUMIN]
    D --> F
```

## Release Process

### 1. Development Phase

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant CS as Changesets
    participant GH as GitHub
    
    Dev->>Dev: Make code changes
    Dev->>CS: pnpm changeset add
    CS->>CS: Create .changeset/xxx.md
    Dev->>GH: Create Pull Request
    Note over GH: PR includes changeset file
    GH->>GH: Code Review
    GH->>Dev: Merge to develop
```

### 2. Beta Release (Automated)

```mermaid
sequenceDiagram
    participant GH as GitHub
    participant GA as GitHub Actions
    participant NPM as npm Registry
    
    GH->>GA: Push to develop
    GA->>GA: Check for changesets
    GA->>GA: Build packages
    GA->>NPM: Publish vue3-pivottable@beta
    GA->>NPM: Publish @vue-pivottable/plotly-renderer@beta
    GA->>NPM: Publish @vue-pivottable/lazy-table-renderer@beta
```

### 3. Production Release (Automated)

```mermaid
sequenceDiagram
    participant Main as main branch
    participant GA as GitHub Actions
    participant Rel as release/vX.X.X
    participant NPM as npm Registry
    
    Main->>GA: Push to main
    GA->>GA: Check changesets exist
    GA->>Rel: Create release branch
    GA->>GA: Run changeset version
    GA->>GA: Commit version bumps
    GA->>GA: Build all packages
    GA->>NPM: Publish each package
    GA->>Main: Merge back to main
```

## Independent Package Releases

Each package can be released independently based on its changesets:

```mermaid
graph LR
    subgraph "Changeset Detection"
        A[.changeset/xxx.md] --> B{Which package?}
        B -->|vue3-pivottable| C[Version main package]
        B -->|@vue-pivottable/plotly-renderer| D[Version plotly-renderer]
        B -->|@vue-pivottable/lazy-table-renderer| E[Version lazy-table-renderer]
    end
    
    subgraph "Release Execution"
        C --> F[Build & Publish main]
        D --> G[Build & Publish plotly]
        E --> H[Build & Publish lazy-table]
    end
```

## Version Management

### Changeset Configuration

```json
{
  "linked": [],      // No linked packages
  "fixed": [],       // No fixed versioning
  "access": "public",
  "baseBranch": "main"
}
```

This configuration ensures:
- Each package maintains its own version
- Packages can be released independently
- No forced version synchronization

### Version Bump Rules

| Change Type | Version Bump | Example |
|------------|--------------|---------|
| patch | 1.0.0 → 1.0.1 | Bug fixes |
| minor | 1.0.0 → 1.1.0 | New features |
| major | 1.0.0 → 2.0.0 | Breaking changes |

## Fault Tolerance

The release script (`scripts/release-packages.js`) implements fault tolerance:

```mermaid
graph TD
    A[Start Release] --> B[Package 1: vue3-pivottable]
    B -->|Success| C[Package 2: plotly-renderer]
    B -->|Failure| C
    C -->|Success| D[Package 3: lazy-table-renderer]
    C -->|Failure| D
    D --> E[Generate Report]
    E --> F{All Success?}
    F -->|Yes| G[Exit 0]
    F -->|No| H[Exit 1]
```

## Pre-release Workflow

Beta releases follow this naming convention:

```mermaid
graph LR
    A[Current: 1.0.0] --> B[First beta: 1.0.1-beta.0]
    B --> C[Next beta: 1.0.1-beta.1]
    C --> D[Final release: 1.0.1]
```

## GitHub Actions Workflows

### Release Workflow (`.github/workflows/release.yml`)
- Triggered on: Push to `main`
- Creates release branches
- Publishes to npm with latest tag

### Pre-release Workflow (`.github/workflows/release-develop.yml`)
- Triggered on: Push to `develop`
- Publishes to npm with beta tag
- No version commits to develop

## Security Considerations

### npm Tokens
- `NPM_TOKEN`: Used for main package
- `NPM_TOKEN_SUMIN`: Used for scoped packages
- Tokens stored as GitHub Secrets

### Branch Protection
- `main` branch: Protected with "Restrict pushes that create matching branches"
- `release/*` branches: Exempt from restrictions
- No GitHub App token required

## Rollback Strategy

In case of issues:

1. **Revert on npm**: Use `npm unpublish` within 72 hours
2. **Git revert**: Create revert PR to main
3. **Hotfix**: Create changeset with patch bump

## Best Practices

1. **Always create changesets** for changes that affect published packages
2. **Use conventional commit messages** for clarity
3. **Test thoroughly** before merging to main
4. **Monitor** npm publish results in GitHub Actions

## Commands Reference

| Command | Description |
|---------|-------------|
| `pnpm changeset add` | Create a new changeset |
| `pnpm changeset version` | Update versions based on changesets |
| `pnpm changeset publish` | Publish packages to npm |
| `pnpm build:all` | Build all packages |
| `pnpm release:packages` | Run custom release script |

## Troubleshooting

### Common Issues

1. **Build failures**: Check package dependencies
2. **Publish failures**: Verify npm tokens
3. **Version conflicts**: Ensure changesets are properly configured

### Debug Commands

```bash
# Check pending changesets
ls .changeset/*.md | grep -v README.md

# Verify package versions
pnpm list --depth=0

# Test build locally
pnpm build:all
```

## References

- [Changesets Documentation](https://github.com/changesets/changesets)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)