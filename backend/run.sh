#!/bin/bash

# Navigate to the project root
cd /reliablecreations/backend

# Git pull latest code
git pull origin main

# Backup static files from .medusa/server/static
mkdir -p static-dup
cp /reliablecreations/backend/.medusa/server/static/* ./static-dup

# Install dependencies
npm install --force

# Build the app
npm run build

# Copy environment file into Medusa server
cp .env .medusa/server

# Move into the Medusa server directory
cd .medusa/server

# Recreate static directory and restore static files
mkdir -p static
cp -r ../../../static-dup/* ./static

# (Optional) Create symlink for static backup (adjust destination if needed)
ln -s /reliablecreations/backend/.medusa/server/static /home/ubuntu/staticBak

# Reuse node_modules from project root to avoid reinstall
mkdir -p node_modules
cp -r ../../../node_modules/* ./node_modules

# Cleanup static duplicate
rm -rf ../../../static-dup

# Run any predeploy tasks
npm run predeploy

# Restart the Medusa service with PM2
pm2 delete medusa-ecom
pm2 start npm --name "medusa-ecom" -- start
