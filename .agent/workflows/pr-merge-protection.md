---
description: Configure PR merge protection with CI checks
---

# PR Merge Protection Workflow

This workflow ensures that pull requests can only be merged if all installation and build checks pass successfully.

## Steps

### 1. Verify GitHub Actions Workflow Exists

Ensure that the `.github/workflows/pr-checks.yml` file exists in your repository. This workflow automatically runs on every pull request to validate installation and build processes.

### 2. Push the Workflow to GitHub

```bash
git add .github/workflows/pr-checks.yml
git commit -m "Add PR checks workflow"
git push origin main
```

### 3. Configure Branch Protection Rules

Navigate to your GitHub repository settings to enable branch protection:

1. Go to **Settings** → **Branches** → **Add branch protection rule**
2. Enter branch name pattern: `main` (or your default branch)
3. Enable the following options:
   - ✅ **Require a pull request before merging**
     - This **blocks direct pushes** to main - everyone must create a PR
   - ✅ **Require status checks to pass before merging**
     - Search and add: `install-and-build`
   - ✅ **Require branches to be up to date before merging**
   - ✅ **Do not allow bypassing the above settings** (recommended to prevent admins from bypassing)
   - ✅ **Include administrators** (optional but recommended - even admins must follow the rules)
4. Click **Create** or **Save changes**

### 4. Test the Protection

Create a test pull request to verify that:
- The CI workflow runs automatically
- Installation completes successfully
- Build completes successfully
- The merge button is blocked if any check fails
- The merge button is enabled only when all checks pass

### 5. Monitor and Maintain

- Check the **Actions** tab on GitHub to monitor workflow runs
- Review failed checks to identify issues
- Update the workflow as your build process evolves

## How It Works

When a PR is created or updated:

1. **GitHub Actions triggers** the `pr-checks.yml` workflow
2. **Installation step** runs `npm ci` to install dependencies with a clean slate
3. **Build step** runs `npm run build` to ensure the code compiles
4. **Status report** is sent to GitHub, marking the check as ✅ passed or ❌ failed
5. **Branch protection** blocks the merge button if any required check fails
6. **Merge allowed** only when all checks pass successfully

## Troubleshooting

**Q: The merge button is not blocked even when checks fail**
- Verify that branch protection rules are correctly configured
- Ensure the status check name matches exactly: `install-and-build`
- Check that you've selected the correct branch in protection rules

**Q: The workflow doesn't run on PRs**
- Verify the workflow file is in `.github/workflows/` directory
- Check that the workflow has `pull_request` trigger configured
- Ensure the workflow file is on the base branch (e.g., `main`)

**Q: Checks pass locally but fail in CI**
- Check for environment-specific issues (Node version, dependencies)
- Review the workflow logs in the Actions tab
- Ensure all required environment variables are set in GitHub Secrets

## Additional Checks (Optional)

You can enhance this workflow by adding more checks:

```yaml
- name: Run Linting
  run: npm run lint

- name: Run Tests
  run: npm test

- name: Type Check
  run: npm run type-check
```

Add these as separate jobs or steps, and include their names in the branch protection required status checks.
