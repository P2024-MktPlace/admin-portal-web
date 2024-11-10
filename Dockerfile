# Step 1: Build the React application
FROM node:18-slim AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application and build it
COPY . .
RUN npm run build

# Step 2: Serve the app using NGINX
FROM nginx:alpine

# Copy the React build to the NGINX default directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom NGINX configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Start NGINX to serve the build folder
CMD ["nginx", "-g", "daemon off;"]
