---
"vue-pivottable": patch
"@vue-pivottable/lazy-table-renderer": patch
"@vue-pivottable/plotly-renderer": patch
---

chore: implement Changesets for monorepo release management

- Replace semantic-release with Changesets for better monorepo support
- Add GitHub App integration for automated releases
- Simplify release workflow to avoid circular PR issues
- Add manual release options for individual packages