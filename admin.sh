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
