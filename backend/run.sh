#!/bin/bash

# Git pull

git pull origin main

# Duplicate all the static images first

mkdir static-dup

cp .medusa/server/static/* ./static-dup

npm install --force

npm run build

cp .env .medusa/server

cd .medusa/server 
mkdir static
cp -r ../../static-dup/* ./static

ln /var/www/ecom/be/.medusa/server/static /home/ubuntu/staticBak

mkdir node_modules
cp -r ../../node_modules/* ./node_modules

rm -rf ../../static-dup
# npm install --force
npm run predeploy
pm2 delete medusa-ecom
pm2 start npm --name "medusa-ecom" -- start
