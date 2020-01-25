## TODO
- instruction for running this microservice on macbook host
and/or
- instruction for running this microservice on macbook host docker
and
- instruction for running this microservice on Cloud Run. 'Run' section and/or `update.sh <microservice_name>`

## Setup
1. make a `flask` project in your Google organization. save the project ID

## Run
1. Build image
`gcloud builds (submit --tag gcr.io/PROJECT-ID/)`
^ uploads the Dockerfile and current directory contents?
^ that then causes a Cloud Build and saves the resulting image to Containe Registry

2. Run container
`gcloud run...`