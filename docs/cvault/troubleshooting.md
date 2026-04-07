---
sidebar_position: 9
title: Troubleshooting
description: Common CVault VPN issues and solutions.
---

# Troubleshooting

## Connection Issues

### VPN connects but no internet

- Check that `AllowedIPs = 0.0.0.0/0` is in your WireGuard config
- Verify the server is running: `curl https://api.creovine.com/health`
- Ensure your license is active: `POST /cvault/v1/licenses/validate`

### "Developer Not Known" on macOS

1. Go to **System Preferences → Privacy & Security**
2. Click **Open Anyway** next to the CVault warning
3. Or: right-click the app → **Open** → **Open**

### Connection refused (402)

Your license has expired or reached its usage limit. Contact your admin to upgrade or renew.

### Device limit reached

The default limit is 5 devices per user. Delete unused devices via `DELETE /cvault/v1/devices/:id` or contact your admin to increase `maxDevicesPerUser`.

### Slow connection

- Try a different server region if available
- Check your local network for bandwidth restrictions
- Verify the WireGuard server capacity hasn't been exceeded

## API Issues

### 401 Unauthorized

- Ensure `X-API-Key` header is present (tenant API key)
- Check that `Authorization: Bearer <jwt>` is valid and not expired (7-day expiry)

### 404 Not Found

- Verify you're using the correct base URL: `https://api.creovine.com/cvault/v1`
- Check the device ID exists and belongs to the authenticated user

## Support

- **Email**: support@creovine.com
- **Console**: [console.creovine.com/support](https://console.creovine.com/support)
