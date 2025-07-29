# Production Environment Variables

## Required for NextAuth Production Deployment

### 1. NextAuth Configuration
```bash
# CRITICAL: Set your production domain
NEXTAUTH_URL="https://yourdomain.com"

# CRITICAL: Generate a secure secret (32+ characters)
NEXTAUTH_SECRET="your-super-secure-secret-key-minimum-32-characters"
```

### 2. Database
```bash
# Your production database connection
DATABASE_URL="mysql://username:password@host:port/database_name"
```

### 3. Optional OAuth Providers (if using)
```bash
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Other Services
```bash
# ImageKit for image uploads
IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-imagekit-id"

# OpenRouter for AI features
OPENROUTER_API_KEY="your-openrouter-api-key"

# Email service
RESEND_API_KEY="your-resend-api-key"
FROM_EMAIL="noreply@yourdomain.com"
```

### 5. Security
```bash
NODE_ENV="production"
```

## Quick Fix for Your Current Issue:

1. **Set NEXTAUTH_URL** to your production domain:
   ```bash
   NEXTAUTH_URL="https://yourdomain.com"
   ```

2. **Generate NEXTAUTH_SECRET**:
   ```bash
   # Run this command to generate a secure secret:
   openssl rand -base64 32
   ```

3. **Update your hosting provider's environment variables** with these values.

## For Testing:
If you want to test locally with production-like settings:
```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-development-secret-key-32chars"
```
