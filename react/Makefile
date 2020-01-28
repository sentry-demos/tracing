# Must have `sentry-cli` installed globally
# Following variable must be passed in
# SENTRY_AUTH_TOKEN
SENTRY_ORG=testorg-az
SENTRY_PROJECT=will-frontend-react
# TODO get tthe .git in the container...
# VERSION=`sentry-cli releases propose-version`
# VERSION=`sentry-cli releases -o testorg-az new -p will-frontend-react v123`
VERSION=2.0
PREFIX=static/js

setup_release: create_release associate_commits upload_sourcemaps

create_release:
	sentry-cli releases -o $(SENTRY_ORG) new -p $(SENTRY_PROJECT) $(VERSION)

associate_commits:
	echo 'associating commits...'
	# sentry-cli releases -o $(SENTRY_ORG) set-commits $(VERSION) --commit "react@sentry-demos"
	# TODO - try this again since we added the repo tracing to the INtegration..
	sentry-cli releases -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) set-commits --auto $(VERSION)

upload_sourcemaps:
	sentry-cli releases -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) files $(VERSION) \
		upload-sourcemaps --url-prefix "~/$(PREFIX)" --validate build/$(PREFIX)


# causes, "Makefile:11: *** missing separator.  Stop."
# echo `sentry-cli repos list`

# TRY echo 'sentry-cli repos list'
# or
# sentry-cli repos list