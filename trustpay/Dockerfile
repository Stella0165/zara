# Use Node base image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build Next.js app
RUN npm run build

# Expose port
EXPOSE 8080

# Start app
CMD ["npm", "start"]