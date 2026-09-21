FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN if [ -f package.json ]; then npm install; fi
CMD ["npm", "run", "dev", "--", "--host"]