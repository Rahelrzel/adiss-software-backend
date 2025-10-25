# Step 1: Use an official Node.js image
FROM node:20

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Step 4: Copy the rest of the project files
COPY . .

# Step 5: Expose the port your app runs on
EXPOSE 3000

# Step 6: Start the application
CMD ["npm", "start"]