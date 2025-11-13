FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --no-audit --no-fund

COPY . .

# Generate Prisma client for the Linux platform
# This must happen at startup (not build time) since DATABASE_URL may not be set during build
RUN mkdir -p node_modules/.prisma || true

ENV PORT=4002
EXPOSE 4002

# Use tsx watcher for dev; generate Prisma at startup if needed
CMD ["sh", "-c", "npx prisma generate && npm run dev"]