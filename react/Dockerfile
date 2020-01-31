FROM node:10.15.3 
COPY ./build ./app
WORKDIR /app
RUN npm install -g serve
CMD serve -s . -l $PORT
