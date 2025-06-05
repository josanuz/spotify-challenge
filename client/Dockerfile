# BUILD
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# SERVE
FROM caddy:2-alpine

# Copy build output from React (assumes you've built it outside Docker)
COPY --from=build /app/public /usr/share/caddy/

# Copy the Caddyfile to the default location
COPY caddy/Caddyfile /etc/caddy/Caddyfile