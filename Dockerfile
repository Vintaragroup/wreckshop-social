# Stage 1: Build
FROM node:20-alpine as builder

WORKDIR /app

# Accept build argument for API base URL
ARG VITE_API_BASE_URL=""

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --no-audit --no-fund

COPY . .

# Build for production with the API base URL
RUN VITE_API_BASE_URL="${VITE_API_BASE_URL}" npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=builder /app/build /app/build

EXPOSE 5176

CMD ["nginx", "-g", "daemon off;"]
