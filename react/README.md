# react

## Run
#### Prod (Cloud Run)
gcloud builds submit --config=cloudbuild.yaml  
gcloud run deploy --image gcr.io/sales-engineering-sf/wcap-flask --platform managed

#### Dev (docker-compose)
1. docker-compose up --build

#### Dev (docker containers individually)
1. docker build --build-arg SENTRY_AUTH_TOKEN=1234567 -t react:2.0 .
2. docker build --build-arg SENTRY_AUTH_TOKEN=1234567 -t react:2.0 -f Dockerfile.dev .

or from project root:
1. docker build --build-arg SENTRY_AUTH_TOKEN=8c3eaf4784e84978ab9aaae9b789dc5ecf9fbd362af343c7ba8bfbce9eec12f3 -t react:2.1 -f ./react/Dockerfile.dev .
2. docker run <image_name> --rm --name=react -p 5000:5000

#### Software Design
**Multi-stage Build**  
Can build it first `npm run deploy` then put static asset in the Dockerfile/build, this way only 1 build going on in docker  

Can run the web build `npm run deploy` inside of the the docker container  

debate:  
https://medium.com/greedygame-engineering/so-you-want-to-dockerize-your-react-app-64fbbb74c217  
and  
https://dev.to/peterj/run-a-react-app-in-a-docker-container-kjn
