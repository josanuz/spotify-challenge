# Use official Node.js LTS image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

RUN npm run build

# Expose the port your app runs on (change if needed)
EXPOSE 5545

# Start the application
CMD ["npm", "start"]