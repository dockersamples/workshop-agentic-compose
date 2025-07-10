# This is a quick and simple Dockerfile.
# Ideally, you would compile the TypeScript code to JavaScript before running it in production.
# However, for simplicity, we will run the TypeScript code directly.

FROM node:lts-slim
WORKDIR /usr/local/app
COPY package* ./
RUN npm install
COPY ./src ./src
CMD ["npm", "start"]
