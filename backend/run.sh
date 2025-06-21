#!/bin/bash

# Navigate to the project root
cd /reliablecreations/backend

# Git pull latest code
git pull origin main

# Install dependencies
npm install --force

# Build the app
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# Run any predeploy tasks
npm run predeploy

# Restart the Medusa service with PM2
pm2 delete backend
pm2 start npm --name "backend" -- start
