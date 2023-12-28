# Use a base image that includes necessary environments (e.g., Node.js)
FROM node:18.17.0

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy your action's source files to the container
COPY . .

# Command to run when the Docker container starts
# It assumes the entrypoint is a script that handles the inputs and runs the desired commands
ENTRYPOINT ["sh", "./entrypoint.sh"]
