# Use a lightweight Node.js image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 3000 for the React app
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
