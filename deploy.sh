#!/bin/bash
# Wire Code deployment script for VPS
# Run on VPS: bash deploy.sh

set -e

DOMAIN="wirecode.space"
WEBROOT="/var/www/wirecode"
REPO="https://github.com/vasylniger34-lgtm/wirecode.git"

echo "=== Wire Code Deployment ==="

# Install git if not present
apt-get update -qq && apt-get install -y -qq git certbot python3-certbot-nginx > /dev/null 2>&1 || true

# Clone or pull repo
if [ -d "$WEBROOT" ]; then
  echo "→ Updating existing files..."
  cd "$WEBROOT"
  git pull origin main
else
  echo "→ Cloning repository..."
  git clone "$REPO" "$WEBROOT"
fi

# Set permissions
chown -R www-data:www-data "$WEBROOT"
chmod -R 755 "$WEBROOT"

# Create nginx config
echo "→ Configuring Nginx..."
cat > /etc/nginx/sites-available/wirecode <<EOF
server {
    listen 80;
    server_name wirecode.space www.wirecode.space;
    root /var/www/wirecode;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/wirecode /etc/nginx/sites-enabled/wirecode

# Test and reload nginx
nginx -t && systemctl reload nginx

echo "→ Site is live at http://$DOMAIN"

# SSL with Let's Encrypt
echo "→ Setting up SSL..."
certbot --nginx -d wirecode.space -d www.wirecode.space --non-interactive --agree-tos --email admin@wirecode.space --redirect 2>/dev/null || echo "⚠ SSL failed - make sure DNS is pointing to this server first"

echo "=== Deployment Complete ==="
echo "Visit: https://$DOMAIN"
