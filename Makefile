SENTRY_ORG=testorg-az
SENTRY_PROJECT=fe-react
# TODO calver
RELEASE=t544
PREFIX=static/js

REPOSITORY=us.gcr.io/sales-engineering-sf
COMMIT_SHA=$(shell git rev-parse HEAD)
GCP_DEPLOY=gcloud run deploy $(shell whoami)

day=$(date +%d)
month=$(date +%-m)
if [ "$day" -ge 0 ] && [ "$day" -le 7 ]; then
  week=1
elif [ "$day" -ge 8 ] &&  [ "$day" -le 14 ]; then
  week=2
elif [ "$day" -ge 15 ] &&  [ "$day" -le 21 ]; then
  week=3
elif [ "$day" -ge 22 ]; then
  week=4
fi
# RELEASE="$month.$day"
# echo 'it is....'
# echo $RELEASE

all: build_react setup_release build deploy-flask deploy-react
docker_compose:
	cd react && npm run buildlocal
	docker-compose build
	docker-compose run -d -e RELEASE=$(RELEASE) -e FLASK_ENV=test -p 3003:3003 flask
	docker-compose run -p 3002:3002 react

build_react:
	cd react && source $(HOME)/.nvm/nvm.sh && nvm use && npm install && npm run build

setup_release: create_release associate_commits upload_sourcemaps

create_release:
	sentry-cli releases -o $(SENTRY_ORG) new -p $(SENTRY_PROJECT) $(RELEASE)
associate_commits:
	sentry-cli releases -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) set-commits --auto $(RELEASE)
upload_sourcemaps:
	sentry-cli releases -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) files $(RELEASE) \
		upload-sourcemaps --url-prefix "~/$(PREFIX)" --validate react/build/$(PREFIX)

build:
	gcloud builds submit --substitutions=COMMIT_SHA=$(COMMIT_SHA) --config=cloudbuild.yaml
deploy-flask:
	$(GCP_DEPLOY)-flask --image $(REPOSITORY)/workspace_flask:$(COMMIT_SHA) --platform managed --add-cloudsql-instances sales-engineering-sf:us-central1:tracing-db-pg --update-env-vars INSTANCE_CONNECTION_NAME="sales-engineering-sf:us-central1:tracing-db-pg",RELEASE=$(RELEASE)
deploy-react:
	$(GCP_DEPLOY)-react --image $(REPOSITORY)/workspace_react:$(COMMIT_SHA) --platform managed

.PHONY: all build_react setup_release create_release associate_commits upload_sourcemaps build deploy-flask deploy-react docker_compose
