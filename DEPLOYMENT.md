# Deployment Configuration

## Application Startup File Options:

### Option 1: Standard Next.js (Recommended)

- **Startup File**: `npm start`
- **Build Command**: `npm run build`
- **Node Version**: 18.17.0 or higher

### Option 2: Custom Server

- **Startup File**: `server.js`
- **Start Command**: `node server.js`
- **Build Command**: `npm run build`

### Option 3: Production Server

- **Startup File**: `server.js`
- **Start Command**: `npm run start:production`
- **Build Command**: `npm run build`

## Environment Variables Required:

- `NODE_ENV=production`
- `PORT=3000` (or your hosting provider's port)
- `HOSTNAME=0.0.0.0` (for hosting providers)

## For Different Hosting Providers:

### Vercel (Recommended for Next.js)

- No startup file needed
- Automatic deployment

### Heroku

- Use `server.js` as startup file
- Or use `npm start` command

### Railway/Render

- Use `server.js` or `npm start`

### AWS/DigitalOcean/VPS

- Use `server.js` with PM2 or Docker

## Build Process:

1. `npm install`
2. `npm run build`
3. `npm start` or `node server.js`
