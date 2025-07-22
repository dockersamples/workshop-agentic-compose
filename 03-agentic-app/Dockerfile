# This is a quick and simple Dockerfile.
# Ideally, you would compile the TypeScript code to JavaScript before running it in production.
# However, for simplicity, we will run the TypeScript code directly.

FROM node:lts-slim AS base
WORKDIR /usr/local/app
COPY package* ./

FROM base AS dev
RUN npm install
COPY ./src ./src
CMD ["npm", "run", "dev"]

# FROM base AS prod
# There would be more for a prod-based deploy here, but leaving that out
# as it goes beyond the current scope of this workshop.
