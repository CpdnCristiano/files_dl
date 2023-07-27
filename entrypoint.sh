echo "Starting migration"
npx prisma migrate deploy 
echo "end migration"
echo "Starting building"
npx tsc
echo "end building"
echo "Starting server!!!"
node /app/build/server.js

