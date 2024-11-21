FROM node:lts

WORKDIR /app

COPY . /app

EXPOSE 4000

CMD [ "npm", "run", "start" ]
