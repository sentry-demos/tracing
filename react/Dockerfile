# FROM node:12.3.0
# still, "npm WARN deprecated fsevents@1.1.2: Way too old"
FROM node:10.15.3 

COPY . ./app
WORKDIR /app

EXPOSE 5000

RUN curl -sL https://sentry.io/get-cli/ | bash

ENV SENTRY_AUTH_TOKEN <>

# anything else have to install? e.g. react-scripts?
RUN npm install
# RUN npm install react-scripts

# RUN npm run deploy
# or
    # "scripts": {
    #   "predeploy": "npm run build && make setup_release",
    #   "deploy": "serve -s build",
    #   "start": "REACT_APP_RELEASE=1.1 react-scripts start",
    #   "build": "REACT_APP_RELEASE=1.1 react-scripts build",
    #   "eject": "react-scripts eject",
    #   "deploy-ghp": "npm run predeploy && gh-pages -d build"
    # },
RUN npm run build && make setup_release
RUN npm install -g serve

# CMD serve -s build
CMD ["serve", "-s", "build"]