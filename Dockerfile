FROM node:12-alpine

WORKDIR /app

COPY package.json .

RUN npm install --production

COPY . .

ENV PORT=3000

EXPOSE $PORT

CMD ["npm", "run", "start"]
