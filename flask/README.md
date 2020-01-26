## TODO
- instruction for running this microservice on macbook host docker see thinkocapo/flaskdocker
and
- instruction for running this microservice on Cloud Run. 'Run' section and/or `update.sh <microservice_name>`

## Setup
1. find the Sales Engineering project and its project ID
2. `gcloud auth login`
3. `gcloud config set project <project_ID>`
4. `cd flask`

## Run
1. Build image
`gcloud builds submit --tag gcr.io/PROJECT-ID/flask`
^ uploads the Dockerfile and current directory contents?
^ that then causes a Cloud Build and saves the resulting image to Containe Registry

2. Run container
`gcloud run deploy --image gcr.io/PROJECT-ID/flask --platform managed`
