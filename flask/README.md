# flask

## Setup
1. make sure you're in `/tracing/flask` or other1, other2

## Run
1. Build image
`gcloud builds submit --tag gcr.io/PROJECT-ID/flask`

2. Run container
`gcloud run deploy --image gcr.io/PROJECT-ID/flask --platform managed`

3. or `run.sh flask` or other1, other2

## What's Happening
`gcloud builds submit --tag gcr.io/PROJECT-ID/flask`

^ uploads the Dockerfile and current directory contents?
^ builds the image in Cloud Build and saves the resulting image to Container Registry

## Troubleshooting
- instruction for running this microservice on macbook host docker see thinkocapo/flaskdocker