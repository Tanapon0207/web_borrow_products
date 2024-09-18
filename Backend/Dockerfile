
FROM node

RUN mkdir -p /usr/src/app/backend

WORKDIR /usr/src/app/backend


COPY package*.json ./

RUN npm install


COPY . .


EXPOSE 9100

#เป็นการรัน npm start, npm run dev
#CMD ["nodemon", "server.js"] หากเป็น nodemon server.js

CMD ["nodemon", "server.js"]