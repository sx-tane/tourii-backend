# 🤖 Documentation Auto-Update Setup Guide

This guide helps you set up automatic documentation updates using Claude whenever code is merged to main.

## 🔧 Setup Steps

### 1. Configure GitHub Secrets

You need to add the following secret to your repository:

1. Go to your repository on GitHub
2. Navigate to `Settings` → `Secrets and variables` → `Actions`
3. Click `New repository secret`
4. Add the following secret:

```
Name: ANTHROPIC_API_KEY
Value: your_anthropic_api_key_here
```

**Get your Anthropic API key:**
- Visit [Anthropic Console](https://console.anthropic.com/)
- Create an account or log in
- Navigate to API Keys section
- Generate a new API key
- Copy the key and paste it as the secret value

### 2. Repository Permissions

Ensure the workflow has the necessary permissions:

1. Go to `Settings` → `Actions` → `General`
2. Under "Workflow permissions", select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**

### 3. Test the Workflow

You can test the setup by:

1. **Manual trigger**: Go to `Actions` → `Auto-Update Documentation` → `Run workflow`
2. **Automatic trigger**: Make any change to code files and push to main

## 📋 How It Works

### Trigger Conditions
The workflow runs when:
- Code is pushed to `main` branch
- Files in these paths are modified:
  - `apps/**` (application code)
  - `libs/**` (shared libraries) 
  - `prisma/**` (database schema)
  - `package.json` (dependencies)
  - `pnpm-lock.yaml` (lock file)
  - `.env.example` (environment template)
  - `CLAUDE.md` (project instructions)

### Documentation Files Updated
The workflow will analyze your codebase and update:
- `README.md`
- `docs/SYSTEM_ARCHITECTURE.md`
- `docs/API_EXAMPLES.md`
- `docs/ERROR_CODES.md`
- `docs/SECURITY.md`
- `docs/DATABASE.md`
- `docs/SEEDING_GUIDE.md`
- `docs/TESTING_STRATEGY.md`
- `CLAUDE.md` (if needed)

### Process Flow
1. **Detect Changes**: Identifies which files were modified
2. **Analyze Codebase**: Claude analyzes the changes and current state
3. **Update Documentation**: Only updates docs that need changes
4. **Commit Changes**: Creates a clean commit with documentation updates
5. **Notify**: Adds PR comments and job summaries

## 🔍 Monitoring

### Check Workflow Status
- Go to `Actions` tab in your repository
- Look for "📚 Auto-Update Documentation" workflows
- Check logs for any errors or issues

### Workflow Outputs
- **Success**: Documentation files are automatically updated
- **No Changes**: Workflow runs but no updates needed
- **Failure**: Creates an issue with error details

## 🛠️ Customization

### Modify Trigger Paths
Edit `.github/workflows/update-docs.yml` and update the `paths` section:

```yaml
paths:
  - 'your-custom-path/**'
  - 'another-path/**'
```

### Change Documentation Files
Update the Claude prompt in the workflow to specify different files:

```yaml
prompt: |
  Update these specific documentation files:
  - your-custom-doc.md
  - another-doc.md
```

### Adjust Frequency
Add schedule trigger for periodic updates:

```yaml
on:
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday at 2 AM UTC
```

## 🚨 Troubleshooting

### Common Issues

**1. API Key Not Working**
- Verify the key is correctly added to GitHub Secrets
- Check if the key has sufficient credits
- Ensure the key name is exactly `ANTHROPIC_API_KEY`

**2. Permission Denied**
- Check repository workflow permissions
- Ensure `contents: write` permission is granted

**3. No Updates Generated**
- Claude might determine no documentation updates are needed
- Check the workflow logs for Claude's analysis
- Manually trigger with `force_update: true` for testing

**4. Commit Conflicts**
- Workflow might fail if documentation was manually edited
- Resolve conflicts manually and re-run workflow

### Debug Mode
Enable verbose logging by adding to the workflow:

```yaml
- name: 🐛 Debug Information
  run: |
    echo "Changed files: ${{ steps.changed-files.outputs.all_changed_files }}"
    echo "Any changed: ${{ steps.changed-files.outputs.any_changed }}"
    git status
    git log --oneline -5
```

## 💡 Best Practices

1. **Review Generated Updates**: Always review the auto-generated documentation changes
2. **Keep CLAUDE.md Updated**: This file guides the AI's understanding of your project
3. **Monitor Costs**: Track your Anthropic API usage to manage costs
4. **Test Changes**: Use manual triggers to test workflow changes
5. **Backup Strategy**: Keep manual documentation processes as backup

## 🔗 Related Resources

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)

---

**⚡ Quick Start Checklist:**
- [ ] Add `ANTHROPIC_API_KEY` to GitHub Secrets
- [ ] Enable read/write permissions for workflows
- [ ] Test with manual trigger
- [ ] Monitor first automatic run
- [ ] Review generated documentation updates

---

_This automation will keep your documentation synchronized with your codebase changes automatically!_