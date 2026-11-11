FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN mkdir -p uploads/profile uploads/projects uploads/certificates uploads/resume && chown -R node:node /app
USER node
EXPOSE 5000
CMD ["node", "server.js"]
