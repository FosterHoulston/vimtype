# ---- Build stage: compile the SPA to static files ----
FROM node:24-alpine AS build
WORKDIR /app

# Install deps first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Build the static client bundle (ssr: false -> output in build/client)
COPY . .
RUN npm run build

# ---- Serve stage: nginx serves the static build ----
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build/client /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
