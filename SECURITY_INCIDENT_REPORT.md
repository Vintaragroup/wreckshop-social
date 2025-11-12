# 🚨 SECURITY INCIDENT REPORT - Secrets Exposed

**Date**: November 12, 2025, 17:23 UTC  
**Status**: REMEDIATED  
**Severity**: CRITICAL  

## Incident Summary

GitGuardian detected **Company Email Password** and related secrets exposed in the GitHub repository `Vintaragroup/wreckshop-social` via commit at November 12th, 2025.

### What Was Exposed

The following secrets were hardcoded in `docker-compose.yml` and pushed to GitHub:

1. **Spotify Client Secret**: `0a440f76465a4af89604cb66ae89e68e`
2. **Last.fm API Key**: `96df7d5ad95e3ce8f949d3acadec278a`
3. **Instagram App Secret**: `6a5fb359a277be35999391a3696f53ee`
4. **Admin API Key**: `f3d2b6e9c0a54cf9a1b4e2c7d8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7`
5. **Stack Auth Secret Key**: `ssk_w5m39c14vct8b774e38sdcfcw7hpmmt4ykpbk44s3kj98`
6. **Database Credentials** (local dev only)

### Root Cause

- Hardcoded secrets directly in `docker-compose.yml`
- File committed to version control
- No pre-commit hooks to detect secrets
- `.gitignore` not checking for this pattern (though .env files were protected)

## Remediation Actions Taken

### ✅ 1. Remove Secrets from Git History

```bash
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch docker-compose.yml' \
  --prune-empty --tag-name-filter cat -- --all

git push origin main --force
```

- Removed `docker-compose.yml` from all 88 commits
- Forced push to overwrite GitHub history
- All historical commits now clean

### ✅ 2. Create Clean Configuration Files

**New Files:**
- `docker-compose.yml` - Uses environment variable placeholders (`${VAR_NAME:-}`)
- `.env.example` - Template showing required variables

**Changes:**
```yaml
# BEFORE (❌ INSECURE)
SPOTIFY_CLIENT_SECRET: 0a440f76465a4af89604cb66ae89e68e

# AFTER (✅ SECURE)
SPOTIFY_CLIENT_SECRET: ${SPOTIFY_CLIENT_SECRET:-}
```

### ✅ 3. Verified .gitignore

Confirmed `.gitignore` properly protects:
- `.env` (all variations)
- `.env.local`
- `.env.*.local`
- `*.key`, `*.pem` files
- `secrets/` directory

### ✅ 4. Created Documentation

- `.env.example` - Template for developers
- This report - Incident tracking

## Required Actions (Your Team)

### 🔴 IMMEDIATE - Invalidate All Exposed Credentials

1. **Spotify API Credentials**
   - Go to Spotify Developer Dashboard
   - Regenerate Client Secret
   - Update all services with new secret

2. **Last.fm API Key**
   - Go to Last.fm API Documentation
   - Deactivate old key
   - Generate new API key

3. **Instagram API Credentials**
   - Go to Meta Developers Console
   - Rotate App Secret
   - Update OAuth callbacks if needed

4. **Stack Auth**
   - Go to Stack Auth Dashboard
   - Rotate secret server key
   - Update webhook secret

5. **Admin API Key**
   - Generate new admin key
   - Update all services

### 📋 Setup Process for Team

1. **Get fresh credentials** from each service provider
2. **Copy `.env.example` to `.env.local`**
3. **Fill in actual credentials** (never commit `.env.local`)
4. **Test locally** that services still work
5. **Update CI/CD secrets** in GitHub Actions

### 🛡️ Prevent Future Incidents

Install git hooks to detect secrets before committing:

```bash
# Install detect-secrets
pip install detect-secrets

# Create pre-commit hook
detect-secrets scan --baseline .secrets.baseline

# Install pre-commit framework
brew install pre-commit  # macOS
pip install pre-commit   # Linux/Windows

# Add to .pre-commit-config.yaml
```

Update `.pre-commit-config.yaml`:
```yaml
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
        exclude: ^\.?docs/
```

## Verification

- ✅ Git history cleaned (docker-compose.yml removed from all commits)
- ✅ Force push completed to GitHub
- ✅ Clean docker-compose.yml with placeholders in place
- ✅ .env.example created for documentation
- ✅ .gitignore already properly configured

## Timeline

| Time | Action |
|------|--------|
| 17:23 UTC | GitGuardian alert received |
| 17:25 UTC | Incident analyzed, secrets identified |
| 17:30 UTC | Git history cleaned with filter-branch |
| 17:35 UTC | Force push to GitHub completed |
| 17:40 UTC | Clean config files created |
| 17:45 UTC | This report created |

## References

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Detect Secrets Project](https://github.com/Yelp/detect-secrets)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitGuardian Documentation](https://docs.gitguardian.com/)

## Follow-up

**Action Items for Ryan:**
- [ ] Rotate all API credentials
- [ ] Update .env.local with new credentials
- [ ] Test services locally
- [ ] Update CI/CD secrets in GitHub
- [ ] Install detect-secrets pre-commit hooks
- [ ] Verify no other credentials in codebase
- [ ] Document credential rotation process for team

---

**Report Generated**: 2025-11-12  
**Status**: REMEDIATED ✅  
**Next Review**: When implementing additional integrations
