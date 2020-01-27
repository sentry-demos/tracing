# FROM node:12.3.0
# still, "npm WARN deprecated fsevents@1.1.2: Way too old"
FROM node:10.15.3 

COPY . ./app
WORKDIR /app

EXPOSE 5000

RUN curl -sL https://sentry.io/get-cli/ | bash

ENV SENTRY_AUTH_TOKEN <AUTH_TOKEN>
# is for docker-compose only:
# ENV SENTRY_AUTH_TOKEN ${SENTRY_AUTH_TOKEN}

RUN npm install

RUN npm run build && make setup_release
RUN npm install -g serve

# it's not reading this...
ENV REACT_APP_RELEASE 1.7

# works
CMD ["serve", "-s", "build"]

# fails
# CMD serve -s build