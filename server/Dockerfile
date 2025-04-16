# Use an official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server code
COPY . .

# Expose the server port
EXPOSE 5000

# Start the server
CMD ["npm", "run", "start"]