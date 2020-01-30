FROM node:10.15.3 
COPY ./build ./app
WORKDIR /app
RUN npm install -g serve
CMD ["serve", "-s", ".", "-l", "8080"]


# FROM node:10.15.3
# COPY . ./app
# WORKDIR /app
# RUN curl -sL https://sentry.io/get-cli/ | bash
# ARG AUTH_TOKEN
# ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
# RUN npm install
# RUN REACT_APP_PORT=$PORT npm run build
# RUN npm install -g serve
# CMD serve -s build -l $PORT