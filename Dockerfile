# Use a base image that includes necessary environments (e.g., Node.js)
FROM node:18.17.0

# Install Bun
RUN npm install -g bun

# Set the working directory in the container
WORKDIR /app

# Copy your action's source files to the container
COPY . .

COPY entrypoint.sh /

# Command to run when the Docker container starts
# It assumes the entrypoint is a script that handles the inputs and runs the desired commands
ENTRYPOINT ["sh", "/entrypoint.sh"]
