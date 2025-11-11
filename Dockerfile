FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --no-audit --no-fund

COPY . .

ENV VITE_API_BASE_URL=http://backend:4002
EXPOSE 5176

# Run dev server
CMD ["npm", "run", "dev"]
