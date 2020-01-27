# Stage 1
FROM node:12.3.0
COPY . ./app
WORKDIR /app
RUN npm install

# anything else have to install? e.g. react-scripts?
RUN npm run deploy
# CMD npm run deploy
