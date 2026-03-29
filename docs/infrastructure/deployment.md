---
slug: /infrastructure/deployment
sidebar_position: 2
title: Deployment
---

# Deployment

## Backend Deployment

The backend runs on **EC2 (t3.small, Ubuntu 22.04)** and is deployed via a one-command script.

### Deploy Script

```bash
./deploy-auto.sh
```

This script:

1. Builds TypeScript locally
2. Rsyncs the build to the EC2 instance
3. Runs `npm install` on the server
4. Restarts the systemd service

### SSH Access

```bash
ssh -i ~/.ssh/creovine-api-key.pem ubuntu@98.92.255.171
```

### Service Management

```bash
# Check status
sudo systemctl status creovine-api

# Restart
sudo systemctl restart creovine-api

# View logs
sudo journalctl -u creovine-api -f
```

### Environment Variables

The `.env` file lives on the server and is **not** synced during deployment. New environment variables must be added manually:

```bash
ssh -i ~/.ssh/creovine-api-key.pem ubuntu@98.92.255.171
sudo nano /home/ubuntu/creovine-api/.env
sudo systemctl restart creovine-api
```

## Frontend Deployment

The frontend is hosted on **Vercel** with automatic Git deployments.

### Production URL

- **Primary**: `liraintelligence.com`
- **Docs**: `docs.liraintelligence.com`

### Deploy

Push to the `main` branch and Vercel automatically builds and deploys:

```bash
git push origin main
```

Or trigger a manual deploy:

```bash
vercel --prod
```

## DNS Configuration

| Domain | Type | Value | Host |
|:---|:---|:---|:---|
| `liraintelligence.com` | A | 76.76.21.21 | Vercel |
| `www.liraintelligence.com` | CNAME | cname.vercel-dns.com | Vercel |
| `docs.liraintelligence.com` | CNAME | cname.vercel-dns.com | Vercel |
| `api.creovine.com` | A | 98.92.255.171 | EC2 |
| `reply.liraintelligence.com` | MX | inbound-smtp.us-east-1.amazonaws.com | SES |

DNS is managed via **Namecheap**.

## SSL/TLS

- **Backend**: nginx with Let's Encrypt (auto-renewal via certbot)
- **Frontend**: Vercel provides automatic SSL
