#!/bin/sh

cd /app

echo "Generating Prisma Client"
npx prisma generate

echo "Starting migration"
npx prisma migrate deploy
echo "End migration"

echo "Starting server!!!"
node /app/build/server.js
