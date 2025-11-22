# AI Studio - AWS EC2 Deployment Guide

This guide provides the environment configuration files needed to deploy the AI Studio application on an AWS EC2 instance.

## 📋 Prerequisites

- AWS EC2 instance running (Ubuntu/Amazon Linux recommended)
- Node.js 16+ installed on EC2
- MongoDB Atlas account (or MongoDB installed on EC2)
- Domain name (optional, for production)
- SSL certificate (optional, for HTTPS)

## 🔧 Environment Configuration

### Server Configuration

**File**: `server/.env.production`

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://nksolns:BrSKNHd32hOalU@nkcluster.zz5ycfq.mongodb.net/aistudio1?retryWrites=true&w=majority

# Server Port
PORT=4000

# JWT Secret (IMPORTANT: Change this to a strong secret in production)
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30

# Node Environment
NODE_ENV=production
```

### Client Configuration

**File**: `client/.env.production`

```env
# API Base URL - Replace <YOUR_EC2_PUBLIC_IP> with your actual EC2 instance public IP or domain
VITE_API_BASE_URL=http://<YOUR_EC2_PUBLIC_IP>:4000/api
```

**Examples**:
- Using IP: `VITE_API_BASE_URL=http://54.123.45.67:4000/api`
- Using domain: `VITE_API_BASE_URL=http://yourdomain.com:4000/api`
- Using HTTPS: `VITE_API_BASE_URL=https://yourdomain.com/api`

## 🚀 Deployment Steps

### 1. Prepare EC2 Instance

```bash
# Update system packages
sudo yum update -y  # For Amazon Linux
# OR
sudo apt update && sudo apt upgrade -y  # For Ubuntu

# Install Node.js (using nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Install PM2 for process management
npm install -g pm2

# Install Git
sudo yum install git -y  # Amazon Linux
# OR
sudo apt install git -y  # Ubuntu
```

### 2. Clone and Setup Project

```bash
# Clone your repository
cd ~
git clone <your-repo-url> aistudio
cd aistudio

# Setup Server
cd server
npm install
cp .env.production .env
# Edit .env if needed: nano .env

# Setup Client
cd ../client
npm install
```

### 3. Configure Environment Variables

```bash
# Get your EC2 public IP
curl http://checkip.amazonaws.com

# Update client/.env.production with your EC2 IP
cd ~/aistudio/client
nano .env.production
# Replace <YOUR_EC2_PUBLIC_IP> with your actual IP
```

### 4. Build Client

```bash
cd ~/aistudio/client
npm run build
# This creates a 'dist' folder with production-ready files
```

### 5. Configure EC2 Security Group

In AWS Console:
1. Go to EC2 → Security Groups
2. Select your instance's security group
3. Add Inbound Rules:
   - **Type**: Custom TCP
   - **Port**: 4000
   - **Source**: 0.0.0.0/0 (or restrict to specific IPs)
   - **Type**: HTTP
   - **Port**: 80
   - **Source**: 0.0.0.0/0
   - **Type**: HTTPS (optional)
   - **Port**: 443
   - **Source**: 0.0.0.0/0

### 6. Start Server with PM2

```bash
cd ~/aistudio/server
pm2 start src/index.js --name aistudio-server
pm2 save
pm2 startup
# Follow the command output to enable PM2 on system boot
```

### 7. Serve Client (Option A: Using Nginx)

```bash
# Install Nginx
sudo yum install nginx -y  # Amazon Linux
# OR
sudo apt install nginx -y  # Ubuntu

# Copy built files to Nginx directory
sudo cp -r ~/aistudio/client/dist/* /usr/share/nginx/html/

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 7. Serve Client (Option B: Using PM2 + serve)

```bash
# Install serve globally
npm install -g serve

# Serve the built client
cd ~/aistudio/client
pm2 serve dist 80 --name aistudio-client --spa
pm2 save
```

### 8. Verify Deployment

```bash
# Check server status
pm2 status
pm2 logs aistudio-server

# Test server API
curl http://localhost:4000/

# Test from browser
# Open: http://<YOUR_EC2_PUBLIC_IP>
```

## 🔒 Security Recommendations

### 1. Change JWT Secret
Generate a new strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Update `server/.env` with the new secret.

### 2. Setup HTTPS (Recommended)

Using Let's Encrypt with Certbot:
```bash
# Install Certbot
sudo yum install certbot python3-certbot-nginx -y  # Amazon Linux
# OR
sudo apt install certbot python3-certbot-nginx -y  # Ubuntu

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Update client/.env.production
VITE_API_BASE_URL=https://yourdomain.com/api
```

### 3. Setup Nginx Reverse Proxy

Create `/etc/nginx/conf.d/aistudio.conf`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Serve client
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploaded files
    location /uploads {
        proxy_pass http://localhost:4000;
    }
}
```

Then restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Firewall Configuration

```bash
# Using firewalld (Amazon Linux)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Using ufw (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 4000/tcp
sudo ufw enable
```

## 🔄 Updating the Application

```bash
# Pull latest changes
cd ~/aistudio
git pull

# Update server
cd server
npm install
pm2 restart aistudio-server

# Update client
cd ../client
npm install
npm run build
sudo cp -r dist/* /usr/share/nginx/html/
```

## 📊 Monitoring

```bash
# View logs
pm2 logs aistudio-server
pm2 logs aistudio-client

# Monitor resources
pm2 monit

# View process status
pm2 status
```

## 🐛 Troubleshooting

### Server won't start
```bash
# Check logs
pm2 logs aistudio-server --lines 100

# Check if port is in use
sudo lsof -i :4000

# Check MongoDB connection
# Verify MONGODB_URI in server/.env
```

### Client can't connect to server
```bash
# Verify security group allows port 4000
# Check client/.env.production has correct IP
# Test API directly: curl http://<EC2_IP>:4000/api
```

### Images not loading
```bash
# Ensure uploads directory exists
mkdir -p ~/aistudio/server/uploads/profiles
mkdir -p ~/aistudio/server/uploads/banners
mkdir -p ~/aistudio/server/uploads/gallery

# Check permissions
chmod -R 755 ~/aistudio/server/uploads
```

## 📝 Environment Variables Reference

### Server Variables
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 4000)
- `JWT_SECRET`: Secret key for JWT token signing
- `NODE_ENV`: Environment mode (production/development)

### Client Variables
- `VITE_API_BASE_URL`: Backend API base URL

## 🎯 Quick Start Commands

```bash
# Start everything
pm2 start all

# Stop everything
pm2 stop all

# Restart everything
pm2 restart all

# View status
pm2 status
```
