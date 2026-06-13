#!/usr/bin/env bash

# Deploy script for Hostinger (Passenger Environment)
# Uses SSH credentials defined in .env.local (HOSTINGER_IP, HOSTINGER_PORT, HOSTINGER_USER, HOSTINGER_PASS)

if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

HOST=${HOSTINGER_IP:-"46.202.145.77"}
PORT=${HOSTINGER_PORT:-"65002"}
USER=${HOSTINGER_USER:-"u183568280"}
PASS=${HOSTINGER_PASS:-"hDqE@_F!EmQMpC2"}
APP_DIR="/home/${USER}/domains/lawngreen-kudu-132132.hostingersite.com/public_html"

REMOTE_CMD="export PATH=/opt/alt/alt-nodejs22/root/bin:/bin:/usr/bin:/usr/local/bin:\$PATH; \
set -e; \
cd \"$APP_DIR\"; \
git fetch origin; \
git reset --hard origin/main; \
npm ci; \
npm run build; \
rm -rf ../nodejs/public/*; \
cp -r dist/* ../nodejs/public/; \
cp backend_hostinger/server.js ../nodejs/app.js; \
cp backend_hostinger/package.json ../nodejs/package.json; \
cd ../nodejs; \
npm install --omit=dev; \
mkdir -p tmp; \
touch tmp/restart.txt"

# If local key exists, use it
if [ -f hostinger_deploy_key ]; then
  ssh -i hostinger_deploy_key -o StrictHostKeyChecking=no -p $PORT $USER@$HOST "$REMOTE_CMD"
elif command -v sshpass > /dev/null; then
  sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no -p $PORT $USER@$HOST "$REMOTE_CMD"
else
  ssh -o StrictHostKeyChecking=no -p $PORT $USER@$HOST "$REMOTE_CMD"
fi
