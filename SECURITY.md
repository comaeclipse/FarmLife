# Security Notice

## Database Credentials

**IMPORTANT:** Your database credentials were accidentally exposed in an earlier commit to this repository.

### Immediate Actions Required:

1. **Rotate your Neon database password:**
   - Go to https://console.neon.tech
   - Navigate to your project settings
   - Reset your database password
   - Update the connection string in your local `.env` file
   - Update environment variables in Vercel

2. **Verify .gitignore:**
   - ✅ `.env` is in `.gitignore` (protected)
   - ✅ Never commit `.env` files to git

### Best Practices Going Forward:

1. **Never commit credentials to git**
   - Use `.env` files locally
   - Use environment variables in production
   - Use `.env.example` with placeholder values

2. **If credentials are leaked:**
   - Rotate passwords immediately
   - Consider using GitHub's secret scanning alerts
   - Review commit history for sensitive data

3. **Use Vercel's environment variables:**
   - Set in dashboard, not in code
   - Different values for dev/preview/production
   - Never hardcode in `vercel.json`

## Current Status

- `.env` file: ✅ Protected by .gitignore
- Database credentials: ⚠️  Need to be rotated due to earlier exposure
- Future commits: ✅ Will not contain credentials

## Questions?

If you need help rotating your database credentials, consult:
- [Neon Documentation](https://neon.tech/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
