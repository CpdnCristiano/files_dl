#!/bin/sh

cd /app

echo "Starting migration"
npx prisma migrate deploy
echo "end migration"

echo "Starting generator"
npx prisma generate
echo "end generator"

echo "Starting building"
npx tsc
echo "end building"

echo "Starting server!!!"
node /app/build/server.js
