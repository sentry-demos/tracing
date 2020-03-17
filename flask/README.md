# flask

## Setup

## Run
#### Prod (Cloud Run)
1. Build image
`gcloud builds submit --tag gcr.io/PROJECT-ID/flask`

2. Run container
`gcloud run deploy --image gcr.io/PROJECT-ID/flask --platform managed`

#### Dev
1. docker build -t flask:1.0 -f Dockerfile.dev .
2. docker run --rm --name=flask -p 3001:3001 flask:1.0

## Troubleshooting
#### Local Testing to Postgres CloudSQL
1. Master Instnace > Connections > add your IP (whatismyip.com)