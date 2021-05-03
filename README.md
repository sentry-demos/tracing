# tracing
SDK Tracing between a React javascript app and back-end Flask app. For prod deployment this uses GCP's Cloud Build, and Cloud Run.

## Setup
#### Versions
this was tested on:

| dependency    | version
| ------------- |:-------------:|
| sentry_sdk | 0.19.1 |
| @sentry/apm | 5.20.1 |
| @sentry/react | ^6.2.1 |
| @sentry/tracing |^6.2.1 |
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

Do the gcloud setup and project env setups here:

#### gcloud setup
1. Have an admin set your permissions in GCP
2. Download `gcloud` google cloud sdk https://cloud.google.com/sdk/docs/. This will have you 'initialize' your sdk from command line, and set some defaults. If you get asked for 'zone' select us-central1-a. 'region' is us-central1
3. `gcloud auth login` opens browser with Google OAUTH, select your Sentry email.
4. `gcloud config set project <project ID>` get your team's Google Cloud Project ID from console.cloud.google.com.
5. `gcloud config set run/region us-central1` to set 'us-central1' as default region
6. `gcloud config list` and confirm your email, project and region are correct.
6. Permit your IP address in GCP Cloud SQL for the database instance.

#### project env setup
1. install [nvm](https://github.com/nvm-sh/nvm)
2. Create a `flask/.env` using `flask/.env.default` as an example, and fill in the values.
3. Create a `react/.env` using `react/.env.default` as an example, and fill in the values. In the `REACT_APP_BACKEND_URL` put your `whoami` so your React app instance will call the right Flask app instance.
4. set your SENTRY_PROJECT in both Makefile and react/Makefile
5. cd react && npm install
6. cd flask && pip install -r requirements.txt

## Run
#### Development
Update your SENTRY_PROJECT in react/Makefile
1. `cd ./react && npm run deploylocal` 
2. `cd ./flask && make deploy`

For Python 3
```
python3 -m venv env
source env/bin/activate
```
1. `cd flask && python3 main.py`

#### Production Cloud Run
This command builds your react app, runs sentry-cli commands for releases, then uploads your source files to GCP where Cloud Build will build an Image and run it as a container in Cloud Run
```
make all
```

#### Production App Engine
Update your react/.env with correct appspot (App Engine) URL's
```
cd flask && gcloud app deploy
cd react && npm run build && gcloud app deploy
```

## Upgrade Pathway

```
If you're on your fork
git remote -v
origin	git@github.com:<your_handle>/tracing.git (fetch)
origin	git@github.com:<your_handle>/tracing.git (push)
upstream	git@github.com:sentry-demos/tracing.git (fetch)
upstream	git@github.com:sentry-demos/tracing.git (push)

# If you don't have an upstream
git remote add upstream git@github.com:sentry-demos/tracing.git

# Make sure you're on master
git checkout master

# get updates from the upstream
git fetch upstream master
git merge upstream/master

# update sentry_sdk's and other modules
cd react && npm install
cd flask && pip install -r requirements.txt

# Check that your react/.env and flask/.env still have the right values
```

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

If you run `npm start` then the React app will bring you to a handled error page, instead of seeing User Feedback popup

Warning: It is not recommended to use build-time variables for passing secrets like github keys, user credentials etc. Build-time variable values are visible to any user of the image with the docker history command.  
https://docs.docker.com/engine/reference/builder/

`docker exec -it <container_ID> bash`

see `clean.sh` for how to quickly remove all dead images and containers

`sentry-cli repos list`

If you get an error 'nvm is not compatible with the npm_config_prefix" environment variable: currently set to "/usr/local" then run `unset npm_config_prefix`