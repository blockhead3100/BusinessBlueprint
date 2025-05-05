# Dockerfile for the server
FROM gcr.io/distroless/nodejs18

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Expose the port the server runs on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]