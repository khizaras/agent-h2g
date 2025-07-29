# Production Deployment Checklist

## 🚨 CRITICAL: Fix Authentication Error

The error `https://localhost:3000/auth/error?error=Configuration` means NextAuth is misconfigured for production.

### ✅ **Immediate Fix Required:**

1. **Set Environment Variables on Your Hosting Provider:**

   ```bash
   NEXTAUTH_URL="https://youractualdomainname.com"
   NEXTAUTH_SECRET="generate-a-secure-32-char-secret"
   NODE_ENV="production"
   ```

2. **Generate Secure Secret:**

   ```bash
   # Run this command to generate NEXTAUTH_SECRET:
   openssl rand -base64 32
   ```

3. **Update Database Connection:**
   ```bash
   DATABASE_URL="mysql://user:pass@host:port/database"
   ```

### 🔧 **How to Fix on Different Hosting Providers:**

#### **Vercel:**

1. Go to your project dashboard
2. Settings → Environment Variables
3. Add:
   - `NEXTAUTH_URL` = `https://yourapp.vercel.app`
   - `NEXTAUTH_SECRET` = `your-generated-secret`
   - `DATABASE_URL` = `your-production-db-url`

#### **Netlify:**

1. Site settings → Environment variables
2. Add the same variables

#### **Railway/Render:**

1. Environment tab → Add variables

#### **Heroku:**

1. Settings → Config Vars → Add variables

#### **VPS/Custom Server:**

1. Create `.env.production` file with variables
2. Ensure `NODE_ENV=production`

### 🚀 **After Setting Environment Variables:**

1. **Redeploy your application**
2. **Test authentication** at `https://yourdomain.com/auth/signin`
3. **Check logs** for any remaining errors

### 🔍 **Troubleshooting:**

If you still get errors:

1. **Check your hosting provider's logs**
2. **Verify all environment variables are set**
3. **Ensure your domain matches NEXTAUTH_URL exactly**
4. **Check database connectivity**

### 📝 **Environment Variables Checklist:**

- [ ] `NEXTAUTH_URL` set to production domain
- [ ] `NEXTAUTH_SECRET` set to secure 32+ char string
- [ ] `DATABASE_URL` pointing to production database
- [ ] `NODE_ENV=production`
- [ ] All other required services (ImageKit, etc.) configured

### 🔒 **Security Notes:**

- Never commit `.env` files to git
- Use different secrets for production vs development
- Ensure database has proper access controls
- Use HTTPS in production (required for NextAuth)

---

**Quick Test:** After deployment, visit `https://yourdomain.com/api/auth/providers` - it should return JSON, not redirect to localhost.
