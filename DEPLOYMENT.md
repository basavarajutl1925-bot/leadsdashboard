# Deployment Guide

This guide covers deploying the Lead Management Dashboard to production environments.

## Table of Contents
1. [Backend Deployment](#backend-deployment)
2. [Frontend Deployment](#frontend-deployment)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Backend Deployment

### Option 1: Deploy to Heroku

#### Prerequisites
- Heroku account (https://www.heroku.com)
- Heroku CLI installed

#### Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create Heroku App**
```bash
cd backend
heroku create your-app-name
```

3. **Set Environment Variables**
```bash
heroku config:set MONGODB_URI="your_mongodb_connection_string"
heroku config:set TWILIO_ACCOUNT_SID="your_sid"
heroku config:set TWILIO_AUTH_TOKEN="your_token"
heroku config:set TWILIO_PHONE_NUMBER="whatsapp:+1234567890"
heroku config:set FRONTEND_URL="https://your-frontend-domain.com"
heroku config:set NODE_ENV="production"
```

4. **Deploy**
```bash
git push heroku main
```

5. **View Logs**
```bash
heroku logs --tail
```

### Option 2: Deploy to AWS

#### Using EC2

1. **Launch EC2 Instance**
   - Use Ubuntu 20.04 LTS
   - Allow ports 22, 5000

2. **SSH into Instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. **Install Dependencies**
```bash
sudo apt update
sudo apt install nodejs npm mongodb
```

4. **Clone Repository**
```bash
git clone your-repo-url
cd dashboard/backend
npm install
```

5. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with production values
```

6. **Start with PM2**
```bash
npm install -g pm2
pm2 start npm --name "lead-api" -- start
pm2 startup
pm2 save
```

7. **Setup Nginx Reverse Proxy**
```bash
sudo apt install nginx
```

Create `/etc/nginx/sites-available/default`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

### Option 3: Deploy to DigitalOcean

#### Droplet Deployment

1. **Create Droplet**
   - Ubuntu 20.04 LTS
   - Size: Starter ($4-5/month)

2. **SSH to Droplet**
```bash
ssh root@your-droplet-ip
```

3. **Setup Node.js**
```bash
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install MongoDB**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

5. **Clone and Setup**
```bash
git clone your-repo-url
cd dashboard/backend
npm install
cp .env.example .env
# Edit .env
```

6. **Use Systemd Service**

Create `/etc/systemd/system/lead-api.service`:
```ini
[Unit]
Description=Lead API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/dashboard/backend
ExecStart=/usr/bin/node src/server.js
Restart=on-failure
RestartSec=10

Environment="NODE_ENV=production"
Environment="MONGODB_URI=mongodb://localhost:27017/lead-dashboard"

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable lead-api
sudo systemctl start lead-api
sudo systemctl status lead-api
```

---

## Frontend Deployment

### Option 1: Deploy to Vercel

#### Prerequisites
- Vercel account (https://vercel.com)
- Vercel CLI: `npm i -g vercel`

#### Steps

1. **Prepare Build**
```bash
cd frontend
npm run build
```

2. **Deploy**
```bash
vercel --prod
```

3. **Configure Environment**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add: `REACT_APP_API_URL=https://your-backend-domain.com/api`

### Option 2: Deploy to Netlify

1. **Build**
```bash
cd frontend
npm run build
```

2. **Connect GitHub/GitLab**
   - Push code to repository
   - Connect to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`

3. **Environment Variables**
```
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### Option 3: Deploy to GitHub Pages

1. **Update package.json**
```json
{
  "homepage": "https://yourusername.github.io/dashboard"
}
```

2. **Build and Deploy**
```bash
cd frontend
npm run build
npm install --save-dev gh-pages
```

3. **Add to package.json scripts**
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

4. **Deploy**
```bash
npm run deploy
```

### Option 4: Docker Deployment

Create `Dockerfile` in frontend:
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass http://backend:5000;
    }
}
```

Build and run:
```bash
docker build -t lead-frontend .
docker run -p 3000:80 lead-frontend
```

---

## Database Setup

### MongoDB Atlas (Cloud)

1. **Create Account**: https://www.mongodb.com/cloud/atlas

2. **Create Cluster**
   - Click "Create Cluster"
   - Choose Free tier
   - Select region

3. **Setup Network Access**
   - Add IP addresses to whitelist
   - Or allow all (0.0.0.0/0) for development

4. **Create Database User**
   - Set username and password
   - Save credentials

5. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string

6. **Update Backend .env**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lead-dashboard?retryWrites=true&w=majority
```

### Self-Hosted MongoDB

1. **Install MongoDB**
```bash
sudo apt-get install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod
```

2. **Create Database**
```javascript
use lead-dashboard
db.leads.createIndex({ "email": 1 })
db.leads.createIndex({ "source": 1, "createdAt": -1 })
```

3. **Backup Strategy**
```bash
# Daily backup
mongodump --out /backups/mongodb-$(date +%Y%m%d)

# Restore
mongorestore /backups/mongodb-20240402
```

---

## Environment Configuration

### Production Environment Variables

**Backend .env (Production)**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lead-dashboard
PORT=5000
NODE_ENV=production
TWILIO_ACCOUNT_SID=your_prod_sid
TWILIO_AUTH_TOKEN=your_prod_token
TWILIO_PHONE_NUMBER=whatsapp:+1234567890
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend .env (Production)**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### SSL Certificate Setup

Using Let's Encrypt (Free):

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

Update Nginx config:
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # ... rest of config
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Monitoring & Maintenance

### Server Monitoring

**Using PM2 Plus (Recommended)**
```bash
npm install -g pm2
pm2 install pm2-auto-pull

# Monitor
pm2 monitor
```

**Using New Relic**
```bash
npm install newrelic

# Create newrelic.js config
```

### Log Management

**Application Logs**
```bash
# View logs
pm2 logs

# Rotate logs
pm2 install pm2-logrotate
```

**Database Logs**
```bash
# MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### Backup Strategy

**Automated Backups**
```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups/mongodb"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mongodump --out $BACKUP_DIR/$TIMESTAMP
find $BACKUP_DIR -mtime +30 -delete  # Delete 30+ days old
```

Schedule with cron:
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### Performance Optimization

1. **Database Indexes**
   - Already configured in Lead model

2. **API Caching**
```javascript
// Consider adding Redis for caching
const redis = require('redis');
```

3. **Image Optimization**
   - Compress frontend assets

4. **CDN Configuration**
   - Use CloudFlare or similar for frontend

### Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Set strong database passwords
- [ ] Keep dependencies updated
- [ ] Enable CORS correctly
- [ ] Rate limiting enabled
- [ ] Input validation enabled
- [ ] Error handling without exposing stack traces
- [ ] Environment variables secured
- [ ] Database backups automated
- [ ] Access logs monitored

### Scaling Considerations

As traffic grows:

1. **Database**
   - Use MongoDB sharding
   - Implement read replicas

2. **API Server**
   - Load balancing (Nginx, HAProxy)
   - Multiple instances
   - Cache with Redis

3. **Frontend**
   - CDN distribution
   - Static asset optimization

---

## Troubleshooting Deployment

### Backend not connecting to database
```bash
# Check MongoDB status
systemctl status mongod

# Test connection
mongosh "your_connection_string"
```

### WhatsApp messages not sending
- Verify Twilio account is active
- Check account balance
- Verify phone numbers include country code
- Check Twilio sandbox is enabled

### CORS errors
- Update FRONTEND_URL in backend .env
- Restart backend service

### High memory usage
```bash
# Check process memory
ps aux | grep node

# Restart service
pm2 restart all
```

---

## Additional Resources

- [Heroku Deployment](https://devcenter.heroku.com/articles/nodejs)
- [AWS EC2 Guide](https://docs.aws.amazon.com/ec2/)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Vercel Deployment](https://vercel.com/docs)
- [Netlify Deployment](https://docs.netlify.com/)

---

## Cost Estimation

### Monthly Costs

- **Backend Hosting**: $5-20 (DigitalOcean/AWS)
- **Database**: $0-10 (MongoDB Atlas free tier or self-hosted)
- **Frontend Hosting**: $0-20 (Vercel/Netlify free tier usually enough)
- **Domain**: $10-15/year
- **Twilio (WhatsApp)**: $0.005-0.10 per message

**Total**: ~$15-50/month for small-medium usage

---

For production deployments, always:
1. Test thoroughly in staging environment
2. Have a backup and restore plan
3. Monitor performance and errors
4. Keep dependencies updated
5. Document your deployment process
