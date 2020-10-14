## Contribution

For Merge Requests please use described convention for:

### Types

| Type     | Description                                                      | Example                                    |
| -------- | ---------------------------------------------------------------- | ------------------------------------------ |
| fix      | a bug fix                                                        | fix/893-validation-not-firing         |
| feat     | a new feature                                                    | feat/2288-add-printer-support         |
| refactor | code change that neither fixes a bug or introduces a new feature | refactor/2100-make-prep-screen-faster |
| chore    | changes to the build process or auxiliary tools                  | chore/update-ci-for-staging                |
| docs     | documentation only changes                                       | docs/update-readme                         |
| style    | formatting changes, code style                                   | style/perform-prettier                     |
| test     | adding missing tests                                             | test/orders-utils                          |

### Commit messages

Commit messages should follow <https://www.conventionalcommits.org/> convention.
Long story short: should contain type, scope and for fix/feat/refactor should reference GITHUB issue prefixed with '#' (hash sign).
Commit subject should be a simple sentence in present simple tense. For example:

```bash
git commit -m 'feat: #2288 add printer support'

git commit -m 'fix: #893 validation is not firing when creating kitchen'
```

or without GITHUB reference

```bash
git commit -m 'chore: update CI configuration for stage environment'

git commit -m 'docs: update readme with naming conventions'
```
