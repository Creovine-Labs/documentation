---
sidebar_position: 4
title: Deployment
description: Deploying the Creovine API to production.
---

# Deployment

The Creovine API is deployed to an EC2 instance via `rsync` + `systemd`.

## Production Deploy

```bash
# 1. Build locally
cd creovine-api
npm run build

# 2. Sync to server
rsync -az \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.env' \
  -e "ssh -i ~/.ssh/creovine-api-key.pem" \
  ./ ubuntu@98.92.255.171:/opt/creovine-api/

# 3. SSH in and restart
ssh -i ~/.ssh/creovine-api-key.pem ubuntu@98.92.255.171
cd /opt/creovine-api
npm install --production
npx prisma generate
npx prisma migrate deploy   # safe — only runs pending migrations
sudo systemctl restart creovine-api
sudo systemctl status creovine-api
```

## Verify Deployment

```bash
curl https://api.creovine.com/health
# {"status":"ok","timestamp":"2026-03-29T..."}
```

## Server Configuration

### systemd Service

```ini
# /etc/systemd/system/creovine-api.service
[Unit]
Description=Creovine API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/creovine-api
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=5
EnvironmentFile=/opt/creovine-api/.env

[Install]
WantedBy=multi-user.target
```

### nginx Configuration

nginx handles SSL termination, HTTP → HTTPS redirect, and WebSocket upgrades:

```nginx
server {
    listen 443 ssl;
    server_name api.creovine.com;

    ssl_certificate /etc/letsencrypt/live/api.creovine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.creovine.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Server Notes

- The EC2 instance has the `creovine-api-profile` IAM role — no AWS credentials needed on the server
- Only `NODE_ENV=production` and `AWS_DEFAULT_REGION=us-east-1` are in `.env` on the server
- SSL certificates auto-renew via certbot
- Logs: `journalctl -u creovine-api -f`
