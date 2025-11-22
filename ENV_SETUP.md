# Quick Environment Setup for AWS EC2

## ✅ Files Created

### Server Files
- ✅ `server/.env.production` - Production environment configuration
- ✅ `server/.env.example` - Example configuration (already existed)

### Client Files
- ✅ `client/.env.production` - Production API endpoint configuration
- ✅ `client/.env.development` - Development API endpoint configuration
- ✅ `client/.env.example` - Example configuration template
- ✅ `client/src/vite-env.d.ts` - TypeScript definitions for environment variables

## 🚀 Quick Setup Instructions

### 1. Update Client Production Config

Edit `client/.env.production` and replace `<YOUR_EC2_PUBLIC_IP>` with your actual EC2 public IP:

```bash
# Get your EC2 public IP
curl http://checkip.amazonaws.com

# Then update the file
VITE_API_BASE_URL=http://YOUR_ACTUAL_IP:4000/api
```

### 2. Copy Server Production Config

```bash
cd server
cp .env.production .env
```

### 3. Build and Deploy

```bash
# Build client
cd client
npm run build

# The dist folder is ready to deploy
```

## 📝 What Changed

### Code Updates
1. **`client/src/services/api.ts`**
   - Changed `BASE_URL` from hardcoded `localhost` to use `import.meta.env.VITE_API_BASE_URL`
   - Updated `getImageUrl()` to dynamically use the environment variable
   - Falls back to `localhost:4000` for local development

### Environment Files
1. **Server** (`.env.production`)
   - MongoDB URI (already configured with Atlas)
   - Port 4000
   - JWT Secret (⚠️ **Change this in production!**)
   - NODE_ENV=production

2. **Client** (`.env.production`)
   - VITE_API_BASE_URL pointing to EC2 instance
   - Needs manual update with your EC2 IP

## 🔒 Security Checklist

- [ ] Update JWT_SECRET in `server/.env` with a strong random value
- [ ] Configure EC2 Security Group to allow ports 80, 443, and 4000
- [ ] Set up HTTPS with SSL certificate (recommended)
- [ ] Restrict MongoDB access to your EC2 IP in MongoDB Atlas
- [ ] Enable firewall on EC2 instance
- [ ] Use environment-specific .env files (don't commit production secrets)

## 📖 Full Documentation

See `AWS_EC2_DEPLOYMENT.md` for complete deployment guide including:
- Step-by-step EC2 setup
- Nginx configuration
- SSL/HTTPS setup
- PM2 process management
- Monitoring and troubleshooting
