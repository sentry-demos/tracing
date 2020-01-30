REPOSITORY=us.gcr.io/sales-engineering-sf
COMMIT_SHA=$(shell git rev-parse HEAD)
GCP_DEPLOY=gcloud run deploy $(shell whoami)

all: build deploy-flask deploy-react
build:
	gcloud builds submit --substitutions=COMMIT_SHA=$(COMMIT_SHA) --config=cloudbuild.yaml
deploy-flask:
	$(GCP_DEPLOY)-flask --image $(REPOSITORY)/workspace_flask:$(COMMIT_SHA) --platform managed
deploy-react:
	$(GCP_DEPLOY)-react --image $(REPOSITORY)/workspace_react:$(COMMIT_SHA) --platform managed

.PHONY: all build deploy-flask deploy-react
