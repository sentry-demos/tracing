SENTRY_ORG=testorg-az
SENTRY_PROJECT=javascript-react
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
RELEASE="$month.$week"
PREFIX=static/js
echo $RELEASE
REPOSITORY=us.gcr.io/sales-engineering-sf
COMMIT_SHA=`git rev-parse HEAD`

##gcloud run deploy admin
WHOAMI=`whoami`
##gcloud run deploy $WHOAMI
echo $WHOAMI


# build_react
cd react && source $(HOME)/.nvm/nvm.sh && nvm use && npm install && npm run build

# setup_release

# create_release

# associate_commits

# upload_sourcemaps


#build
#gcloud builds submit --substitutions=COMMIT_SHA=$(COMMIT_SHA) --config=cloudbuild.yaml

# run flask
gcloud run deploy admin-flask --image $(REPOSITORY)/workspace_flask:$(COMMIT_SHA) --platform managed --add-cloudsql-instances sales-engineering-sf:us-central1:tracing-db-pg --update-env-vars INSTANCE_CONNECTION_NAME="sales-engineering-sf:us-central1:tracing-db-pg",RELEASE=$(RELEASE)

# run react
# gcloud run deploy admin-react --image $(REPOSITORY)/workspace_react:$(COMMIT_SHA) --platform managed