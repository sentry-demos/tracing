# Must have `sentry-cli` installed globally
# Following variable must be passed in
# SENTRY_AUTH_TOKEN
SENTRY_ORG=testorg-az
SENTRY_PROJECT=will-frontend-react
RELEASE=2.3
PREFIX=static/js

setup_release: create_release associate_commits upload_sourcemaps

create_release:
	sentry-cli releases -o $(SENTRY_ORG) new -p $(SENTRY_PROJECT) $(RELEASE)

associate_commits:
	sentry-cli releases -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) set-commits --auto $(RELEASE)

upload_sourcemaps:
	sentry-cli releases -o $(SENTRY_ORG) -p $(SENTRY_PROJECT) files $(RELEASE) \
		upload-sourcemaps --url-prefix "~/$(PREFIX)" --validate build/$(PREFIX)
