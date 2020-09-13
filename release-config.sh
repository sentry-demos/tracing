echo 'START'
# SENTRY_AUTH_TOKEN defined in shell profile
RELEASE=8288
SENTRY_PROJECT1=da-react
SENTRY_PROJECT2=da-flask
SENTRY_ORG=testorg-az
PREFIX=static/js

sentry-cli releases -o $SENTRY_ORG new -p $SENTRY_PROJECT1 $RELEASE
sentry-cli releases -o $SENTRY_ORG new -p $SENTRY_PROJECT2 $RELEASE

sentry-cli releases -o $SENTRY_ORG -p $SENTRY_PROJECT1 set-commits --auto $RELEASE
sentry-cli releases -o $SENTRY_ORG -p $SENTRY_PROJECT2 set-commits --auto $RELEASE

sentry-cli releases -o $SENTRY_ORG -p $SENTRY_PROJECT1 files $RELEASE \
		upload-sourcemaps --url-prefix "~/$PREFIX" --validate react/build/$PREFIX

echo 'DONE'
