# Must have `sentry-cli` installed globally
# Following variable must be passed in
# SENTRY_AUTH_TOKEN
SENTRY_ORG=testorg-az
SENTRY_PROJECT=will-frontend-react
# VERSION=`sentry-cli releases propose-version`
# VERWION=`sentry-cli releases -o testorg-az new -p will-frontend-react v123`
VERSION=2.0
PREFIX=static/js

# causes, "Makefile:11: *** missing separator.  Stop."
# echo `sentry-cli repos list`

# TRY echo 'sentry-cli repos list'
# or
# sentry-cli repos list

setup_release: create_release associate_commits upload_sourcemaps

create_release:
	sentry-cli releases -o $(SENTRY_ORG) new -p $(SENTRY_PROJECT) $(VERSION)

associate_commits:
	echo 'associating commits...'
	# sentry-cli releases -o $(SENTRY_ORG) set-commits $(VERSION) --commit "react@sentry-demos"
	# sentry-cli releases -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) set-commits --auto $(VERSION)

upload_sourcemaps:
	sentry-cli releases -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) files $(VERSION) \
		upload-sourcemaps --url-prefix "~/$(PREFIX)" --validate build/$(PREFIX)
