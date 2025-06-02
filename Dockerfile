# ------------------------
# STAGE 1: Build
# ------------------------
FROM node:lts AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
    
# ------------------------
# STAGE 2: Runtime
# ------------------------
FROM node:lts-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
CMD ["npm", "run", "start:migration"]