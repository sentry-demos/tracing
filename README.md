# tracing
SDK Tracing between a React javascript app and back-end Flask app. For prod deployment this uses GCP's Cloud Build, Cloud Container Registry and Cloud Run. See troubleshooting for how to run individually and work with the cloudbuild.yaml.

## Setup
#### Versions
this was tested on:

| dependency    | version
| ------------- |:-------------:|
| sentry_sdk | 0.16.1 |
| @sentry/browser | 5.15.0 |
| @sentry/apm | 5.20.1 |
| @sentry/react 5.20.1 | 
| node | v.14.2 |
| redux | 4.0.5 |
| react-redux | 7.2.1 |
| react-dom | 16.13.1 |
| react | 16.13.3 |
| Google Cloud SDK | 277.0.0 |
| bq | 2.0.52 |
| AVD | Nexus 5x API 29 x86 |
| core | 2020.01.17 |
| gsutil 4.47 | gsutil 4.47 |
| docker | 19.03.12 |
#### Setup Instructions
1. Have an admin set you as Owner on the Project in GCP
2. Download `gcloud` google cloud sdk https://cloud.google.com/sdk/docs/. This will have you 'initialize' your sdk from command line, and set some defaults. If you get asked for 'zone' select us-central1-a. 'region' is us-central1
3. `gcloud auth login` opens browser with Google OAUTH, select your Sentry email
4. `gcloud config set project <project ID>` get Google Cloud Project ID from console.cloud.google.com.
5. `gcloud config set run/region us-central1` to set 'us-central1' as default region
6. Create a `react/.env` using `react/.env.default` as an example, and fill in the values. In the `REACT_APP_BACKEND_URL` put your `whoami` so your React container will call the right Flask container.
7. Create a `flask/.env` using `flask/.env.default` as an example, and fill in the values.
8. Whitelist your IP address in Cloud SQL for the database you see there.
9. **Dev - without docker** `cd ./flask && pip install -r requirements.txt`, recommended inside a virtualenv.
10. **Dev - without docker** `cd ./react` and `npm install`

## Run
#### Prod - GCP
1. `make all`

#### Dev - with docker
1. `make docker_compose`  
docker-compose down

The dockerfile uses whatever is in `./react/build` so make sure you have an updated build.

#### Dev - without docker
1. `cd ./react && npm run deploylocal` 
2. `cd ./flask && make deploy`

## Troubleshooting

```
// logout from a specific account then run the following command
gcloud auth revoke <your_account>
// logout from all accounts
gcloud auth revoke --all
// see whatsup
gcloud config list
```

Build single image in Cloud Build  
`gcloud builds submit --tag gcr.io/<PROJECT-ID>/<APP_NAME>`  
Run single container in Cloud Run  
`gcloud run deploy --image gcr.io/<PROJECT-ID>/<APP_NAME> --platform managed`  

IF you change your `$(GCP_DEPLOY)-react` to `$(GCP_DEPLOY)-react-feature123`
THEN you need to change the URL (REACT_APP_BACKEND) in `.env` to reflect that

The container must listen for requests on 0.0.0.0 on the port defined by the GCP's $PORT environment variable. It is defaulted to 8080  
https://cloud.google.com/run/docs/reference/container-contract#port 

if you run `npm start` then the React app will bring you to a handled error page, instead of seeing User Feedback popup

Warning: It is not recommended to use build-time variables for passing secrets like github keys, user credentials etc. Build-time variable values are visible to any user of the image with the docker history command.  
https://docs.docker.com/engine/reference/builder/

`docker exec -it <container_ID> bash`

see `clean.sh` for how to quickly remove all dead images and containers

`sentry-cli repos list`

## Sentry Documentation
docs  
https://docs.sentry.io/performance/distributed-tracing/  
https://forum.sentry.io/t/sentrys-apm-docs-alpha/7843

example  
https://github.com/getsentry/sentry/blob/master/src/sentry/static/sentry/app/bootstrap.jsx 

tracing implemented in sentry-demos/react and sentry-demos/flask  
https://github.com/thinkocapo/react/tree/apm-alpha  
https://github.com/thinkocapo/flask/tree/apm-alpha

## GIF
todo
