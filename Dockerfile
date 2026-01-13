# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# This will find package.json whether it's in the root OR the frontend folder
COPY **/package*.json ./
RUN npm install

# This copies everything from your repo into the container
COPY . .

# We move into the frontend folder (if it exists) to run the build
RUN if [ -d "frontend" ]; then cd frontend && npm run build && cp -r dist /app/dist; else npm run build; fi

# Production stage
FROM nginx:stable-alpine
# Copy from the /app/dist folder we created above
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]