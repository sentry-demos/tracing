# any recent version gives warning, "npm WARN deprecated fsevents@1.1.2: Way too old"
FROM node:10.15.3 

COPY . ./app
WORKDIR /app

EXPOSE 5000

RUN curl -sL https://sentry.io/get-cli/ | bash

ARG AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$AUTH_TOKEN

RUN npm install

# TODO REACT_APP_PORT=3001 somehwere...
RUN npm run build && make setup_release
RUN npm install -g serve

CMD ["serve", "-s", "build"]

# fails
# CMD serve -s build