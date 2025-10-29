FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --no-audit --no-fund

COPY . .

ENV PORT=4002
EXPOSE 4002

# Use tsx watcher for dev
CMD ["npm", "run", "dev"]
