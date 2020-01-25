# tracing
Tracing between React javascript and back-end REST API's and other microservices

Talk about Google Cloud Build, Cloud Container Registry, Cloud Run...

## TODO
- run flask container in Cloud Run
- where to run/serve React app?
- React<>Flask in containers local macbook 
or
- React<>Flask in containers Cloud Run
then...
- All the rest of the Microservices for Tracing demo
and of course...
- React Components manual tracing + Network I/O example

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
#### Instructions
For test running a container yourself, `cd helloworld-python` and follow instructions from there. or put this in troubleshooting

...
per /flask
per /other
...or put the 'Setup' instruction inside of each respective /flask /other

`docker-compose.yaml` for running all locally?

## Run
1. one
2. two
3. three

## Technical Notes
Updating | Some Design Decisions | Dev Tips/Notes | What's Happening

## Troubleshooting
tips'n'tricks
```
docker stop <container>;
docker rm $(docker ps -a -q -f status=exited)
```

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