#!/usr/bin/env bash

# Deploy script for Hostinger
# Uses SSH credentials defined in .env.local (HOSTINGER_IP, HOSTINGER_PORT, HOSTINGER_USER, HOSTINGER_PASS)
# Adjust APP_DIR to the path where the app lives on the server.

# Load environment variables (if running locally)
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

HOST=${HOSTINGER_IP:-"46.202.145.77"}
PORT=${HOSTINGER_PORT:-"65002"}
USER=${HOSTINGER_USER:-"u183568280"}
PASS=${HOSTINGER_PASS:-"hDqE@_F!EmQMpC2"}
APP_DIR="/home/${USER}/domains/lawngreen-kudu-132132.hostingersite.com/public_html/"   # Updated remote path

# Commands to execute on remote server
REMOTE_CMD="set -e; \
cd \"$APP_DIR\"; \
git fetch origin; \
git reset --hard origin/main; \
npm ci; \
npm run build; \
# Restart service (adjust if you use pm2, nodemon, etc.) \
if command -v pm2 > /dev/null; then pm2 restart all || pm2 start npm --name \"crm-ideias\" -- start; else sudo systemctl restart node-app || echo 'No service restart command defined'; fi"

# Use sshpass to provide password non‑interactive (install sshpass on CI or local machine)
if command -v sshpass > /dev/null; then
  sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no -p $PORT $USER@$HOST "$REMOTE_CMD"
else
  echo "sshpass not found – please install it or use key‑based authentication"
fi
