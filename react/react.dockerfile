# any recent version gives warning, "npm WARN deprecated fsevents@1.1.2: Way too old"
FROM node:10.15.3

COPY . ./app
# COPY ./.git/ ./app/.git/
WORKDIR /app

# do we need this
# EXPOSE $PORT

RUN curl -sL https://sentry.io/get-cli/ | bash

ARG AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

RUN npm install

# 8080 because it's GCloud Run's default
# RUN REACT_APP_PORT=$PORT npm run build && make setup_release
# TODO...
# RUN REACT_APP_PORT=$PORT npm run predeploy
RUN REACT_APP_PORT=$PORT npm run build

RUN npm install -g serve

# TODO npm run serve
CMD serve -s build -l $PORT
# CMD ["serve", "-s", "build", "-l", $PORT]

# fails
# CMD serve -s build
