# tracing
Tracing between React javascript and back-end REST API's and other microservices

Talk about Google Cloud Build, Cloud Container Registry, Cloud Run...

## TODO
+ helloworld-python on a personal Google Cloud account (gmail)
+ project structure that anyone can follow
+ flask in docker on macbook docker host
+ flask in docker container in Cloud Run
- react in docker on macbook docker host
- react in docker on macbook docker host
- react<>flask containers communicating on macbook or Cloud Run hosts
- more microservices dockerized for tracing demo (getsentry/tracing-example)
- React Components manual tracing + Network I/O example. Use cases CPU https://cloud.google.com/run/docs/reference/container-contract  and Memory https://cloud.google.com/run/docs/reference/container-contract#memory <-- try to reach these limits. Concurrency https://cloud.google.com/run/docs/reference/container-contract#concurrency
- Tool Store demo using Network I/O + React Components examples ^
- Meet with Data Engineering to add additional endpoints/microservices/examples
- Meet with Google Kubernetes Engine maintainers for examples there
- Sentlog/Other/SuperDemo

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

## Run
#### Cloud Build, Cloud Container Registry, Cloud Run
1. `cd flask` or other1, other2
2. gcloud build
3. gcloud run
4. select 'us-central1'
5. or `/run.sh flask` or other1, other2

`docker-compose.yaml` for running all locally?

## Technical Notes
Updating | Some Design Decisions | Dev Tips/Notes | What's Happening

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
```


https://cloud.google.com/run/docs/reference/container-contract#port  
The default GCP $PORT is 8080 https://cloud.google.com/run/docs/reference/container-contract

The container must listen for requests on 0.0.0.0 on the port defined by the PORT environment variable.

## Sentry Documentation
here

## GIF
tbd

## Future
- GKE Google Kubernetes Engine
- sentry-kubernetes
- Sentry For Data Teams, data engineering tools/linked microservices, jobs running. Track this all with Airflow?
- multiple different demo's (i.e. endpoints) you could call. The containers will all spin up in milliseconds as need be.
- Google Cloud Functions