# Use a Node.js base image
FROM node:18-slim

# Install ImageMagick
RUN apt-get update && apt-get install -y \
    imagemagick \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app code
COPY . .

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
