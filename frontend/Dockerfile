FROM node:20-alpine

WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --no-audit --no-fund

# Copy source
COPY . .

# Expose configured port via env (default 5176)
ENV PORT=5176
EXPOSE 5176

# Run Vite dev server listening on all interfaces with chosen port
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5176"]
