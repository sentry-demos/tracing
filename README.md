# tracing
SDK Tracing between a React javascript app and back-end Flask app. For prod deployment this uses GCP's Cloud Build, Cloud Container Registry and Cloud Run. See troubleshooting for how to run individually and work with the cloudbuild.yaml.

Future development include:
- adding more microservices in the back-end stack
- updated front-end
- use in conkunction with Discover

## Setup
#### Versions
this was tested on:

| dependency    | version
| ------------- |:-------------:|
| Google Cloud SDK | 277.0.0 |
| bq | 2.0.52 |
| AVD | Nexus 5x API 29 x86 |
| core | 2020.01.17 |
| gsutil 4.47 | gsutil 4.47 |
#### Setup Instructions
1. Have an admin set you as Owner on the Project in GCP
2. Download `gcloud` google cloud sdk https://cloud.google.com/sdk/docs/. This will have you 'initialize' your sdk from command line, and set some defaults. If you get asked for 'zone' select us-central1-a. 'region' is us-central1
3. `gcloud auth login` opens browser with Google OAUTH, select your Sentry email
4. `gcloud config set project <project ID>` get Google Cloud Project ID from console.cloud.google.com.
5. `gcloud config set run/region us-central1` to set 'us-central1' as default region
6. update the REACT_APP_BACKEND_URL react/.env with your `whoami` so your React container will call your Flask container.

## Run Prod
1. `make all`

## Run Local
1. `npm run deploylocal` for running react app locally  

## Technical Notes
#### Some Design Decisions

could submodule to sentry-demos/react one day

could do multi-stage build in docker file if wanted

`docker-compose.yaml` for running the containers locally


## Troubleshooting
#### gcloud
```
// logout from a specific account then run the following command
gcloud auth revoke <your_account>
// logout from all accounts
gcloud auth revoke --all
// see whatsup
gcloud config list
```

Build image in Cloud Build  
`gcloud builds submit --tag gcr.io/<PROJECT-ID>/<APP_NAME>`  
Run container in Cloud Run  
`gcloud run deploy --image gcr.io/<PROJECT-ID>/<APP_NAME> --platform managed`  

IF you change your `$(GCP_DEPLOY)-react` to `$(GCP_DEPLOY)-react-feature123`
THEN you need to change the URL (REACT_APP_BACKEND) in `.env` to reflect that

The container must listen for requests on 0.0.0.0 on the port defined by the GCP's $PORT environment variable. It is defaulted to 8080  
https://cloud.google.com/run/docs/reference/container-contract#port 

if you run `npm start` then the React app will bring you to a handled error page, instead of seeing User Feedback popup

#### docker-compose
Warning: It is not recommended to use build-time variables for passing secrets like github keys, user credentials etc. Build-time variable values are visible to any user of the image with the docker history command.  
https://docs.docker.com/engine/reference/builder/

`docker exec -it <container_ID> bash`

see `clean.sh` for how to quickly remove all dead images and containers

#### other
`sentry-cli repos list`

Build 1 image, without cloundbuild.yaml
`gcloud builds submit --tag gcr.io/PROJECT-ID/<APP_NAME>`

Run a container (Makefile is doing this for you)
`gcloud run deploy --image gcr.io/PROJECT-ID/<APP_NAME> --platform managed`

Don't forget to update your .env with the URL of your backend container, should you change the container's its name

## Sentry Documentation
tracing docs
https://forum.sentry.io/t/sentrys-apm-docs-alpha/7843

tracing example
https://github.com/getsentry/sentry/blob/master/src/sentry/static/sentry/app/bootstrap.jsx 

tracing example 
https://www.notion.so/sentry/Tracing-Examples-Documentation-3f70bbdd20cf4e818eed42d13ef9986a#c453b93910b940fcba31ff8859673562

tracing implemented in the React error demo
https://github.com/thinkocapo/react/tree/apm-alpha  
https://github.com/thinkocapo/flask/tree/apm-alpha

## GIF

