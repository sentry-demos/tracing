# 0 8 * * * cd /home/wcapozzoli/SessionDataGenerator && nohup /home/wcapozzoli/SessionDataGenerator/script.sh
# 0 7 * * * cd /home/wcapozzoli/sdk-payload-sender && yarn start
# */10 * * * * cd /home/wcapozzoli/undertaker; go build -o /home/wcapozzoli/undertaker/bin/main /home/wcapozzoli/undertaker/*.go; /home/wcap
# ozzoli/undertaker/bin/main
# 0 6 * * * cd /home/wcapozzoli/tracing && /home/wcapozzoli/tracing/crontab.sh

SENTRY_ORG=testorg-az
SENTRY_PROJECT=javascript-react
RELEASE=t32
PREFIX=static/js

sentry-cli releases -o $SENTRY_ORG new -p $SENTRY_PROJECT $RELEASE
sentry-cli releases -o $SENTRY_ORG -p $SENTRY_PROJECT set-commits --auto $RELEASE
sentry-cli releases -o $SENTRY_ORG -p $SENTRY_PROJECT files $RELEASE upload-sourcemaps --url-prefix "~/$(PREFIX)" --validate react/build/$(PREFIX)