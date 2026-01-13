# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Point to the frontend folder for the source files
COPY frontend/package*.json ./
RUN npm install

# Copy everything from the frontend folder to the container
COPY frontend/ ./
RUN npm run build

# Production stage
FROM nginx:stable-alpine
# Vite usually builds to a folder named 'dist'
COPY --from=build /app/dist /usr/share/nginx/html
# Copy your custom nginx.conf from the root
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]