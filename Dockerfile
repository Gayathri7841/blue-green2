# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy the package files from the frontend folder
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY frontend/ .

# Run the build command
RUN npm run build

# Production stage
FROM nginx:stable-alpine
# Vite/React builds usually go to the 'dist' folder
COPY --from=build /app/dist /usr/share/nginx/html
# Copy your nginx.conf from the root of your repo
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]