FROM node

RUN mkdir -p /user/src/app/frontend

WORKDIR /user/src/app/frontend

COPY package*.json ./

RUN npm install -g @angular/cli && npm install

COPY . .

EXPOSE 4200

CMD ["npm", "run", "start"]

