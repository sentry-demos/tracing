# tracing
Tracing between React javascript and back-end REST API's and other microservices

Talk about Google Cloud Build, Cloud Container Registry, Cloud Run...

## TODO
PHASE I
- [x] helloworld-python on a personal Google Cloud account (gmail)
- [x] project structure that anyone can follow
- [x] flask in docker on macbook docker host
- [x] flask in docker container in Cloud Run
- [x] react in docker on macbook docker host. 
- [x] reactdocker sends Event to Sentry DSN
- [x] flaskdocker sends Event to Sentry DSN
- [x] REACT_APP_PORT || 3001, so talks to Cloud Run's '$PORT' default
- [x] `COPY ../.git  /app` and uncomment `sentry-cli releases propose-version`. beware .dockerignore. or `RUN git clone` it.
- [x] test the clean.sh for bad images

- [x] cloudbuild.yaml and Substitutions
- [x] react<>flask containers communicating on Cloud Run hosts
- [x] set environmental variables (BACK_END) https://create-react-app.dev/docs/adding-custom-environment-variables/  

2. Makefile
- [x] make `all` does both /flask and /react at once, builds+runs
- [x] whoami echo'd into the tagg'd/build

PHASE II
- [ ] more microservices dockerized for tracing demo (getsentry/tracing-example)
- [ ] Tool Store demo using Network I/O + React Components examples
- [ ] Additional Use Cases:
CPU https://cloud.google.com/run/docs/reference/container-contract 
Memory https://cloud.google.com/run/docs/reference/container-contract#memory 
Concurrency https://cloud.google.com/run/docs/reference/container-contract#concurrency
Try to reach limits ^

PHASE III
- all the .gcloudignore files
- Meet with Data Engineering to add additional endpoints/microservices/examples
- Meet with Google Kubernetes Engine maintainers for running everything there. sentry-kubernetes too
- Sentlog/Other/SuperDemo
- rm the favicon/uneeded stuff from react app's index.html as this cause warnings/errors in console

PHASE - Dependencies
- Visual diagram of microservices, w/ Design team
- Front end Table, styled.

## Setup
#### Versions
this was tested on:
```
// table
Google Cloud SDK 277.0.0
bq 2.0.52
core 2020.01.17
gsutil 4.47
```
#### Setup Instructions
1. `gcloud auth login` opens browser with google OAUTH, select your work email
2. `gcloud config set project <project ID>` get Google Cloud Project ID from console.cloud.google.com.
3. To make 'us-central1' the default region, run `gcloud config set run/region us-central1`.

4. get added by an Owner to the GCP...
5. put your container's URL in the .env.
```
IF you change your $(GCP_DEPLOY)-react to $(GCP_DEPLOY)-react-feature123
THEN you need to change the URL in .env to reflect that
```

## Run
#### Cloud Build, Cloud Container Registry, Cloud Run
1. `cd flask` or other1, other2
2. Build image in Cloud Build
`gcloud builds submit --tag gcr.io/<PROJECT-ID>/<APP_NAME>`
3. Run container in Cloud Run
`gcloud run deploy --image gcr.io/<PROJECT-ID>/<APP_NAME> --platform managed`
4. select 'us-central1'
5. or `/run.sh flask` or other1, other2

OR

#### cloudbuild.yaml
1. Build image
gcloud builds submit --config=cloudbuild.yaml \
    --substitutions=SENTRY_AUTH_TOKEN="<SENTRY_AUTH_TOKEN>"
2. Run container
`gcloud run deploy --image gcr.io/<PROJECT-ID>/<APP_NAME> --platform managed`

## Technical Notes
Updating | Dev Tips/Notes | What's Happening
#### Some Design Decisions
Do not build it locally and push, like: https://cloud.google.com/run/docs/building/containers

Submodule to sentry-demos/react instead of pasting here? Yet, the React app is going to change a lot so probably create a new one here.

Multi-stage build should make for a faster React build

`docker-compose.yaml` is only good for running containers locally, so not using it.

Serve from nginx or not?

## Troubleshooting
tips'n'tricks
```
docker stop <container>;
docker rm $(docker ps -a -q -f status=exited)
```

```
// logout from a specific account then run the following command
gcloud auth revoke <your_account>
// logout from all accounts
gcloud auth revoke --all
// see whatsup
gcloud config list
```

https://cloud.google.com/run/docs/reference/container-contract#port  
The default GCP $PORT is 8080 https://cloud.google.com/run/docs/reference/container-contract

The container must listen for requests on 0.0.0.0 on the port defined by the PORT environment variable.


https://docs.docker.com/engine/reference/builder/
Warning: It is not recommended to use build-time variables for passing secrets like github keys, user credentials etc. Build-time variable values are visible to any user of the image with the docker history command.


`docker exec -it <container_ID> bash`

`sentry-cli repos list`

## Sentry Documentation
TODO

## GIF
TODO

## Future
- GKE Google Kubernetes Engine
- sentry-kubernetes
- Sentry For Data Teams, data engineering tools/linked microservices, jobs running. Track this all with Airflow?
- multiple different demo's (i.e. endpoints) you could call. The containers will all spin up in milliseconds as need be.
- Google Cloud Functions