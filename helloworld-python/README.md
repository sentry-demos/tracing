# helloworld-python
The example follows the tutorial at https://cloud.google.com/run/docs/quickstarts/build-and-deploy. This builds on the previous tutorial https://cloud.google.com/run/docs/quickstarts/prebuilt-deploy if you'd like to try that first.

And if you want the full experience of managing GCP, then do it with your personal gmail and billing account first:

1. Log out of your sentry.io email
```
// logs you out
gcloud auth revoke --all
If you want to logout from a specific account then run the following command

// shouldn't need this
gcloud auth revoke <your_account>
```

2. Log in using your personal gmail and link a billing account
```
If you want to login with a different account, you can run the following command
gcloud auth login
```
and link your gcloud to your gcp Project"
```
gcloud config set project myapp-164822
```

3. then continue following the example from https://cloud.google.com/run/docs/quickstarts/build-and-deploy 
4. the code from the ^ tutorial is in current directory here.

`gcloud builds submit --tag gcr.io/PROJECT-ID/helloworld`

## Troubleshooting
Do not have a .gcloudignore file with 'Dockerfile' in it or the above command will never find your Dockerfile


### gcloud
`gcloud config list` to see whatsup

use the Project ID and not the Project Name:
`gcloud config set project myapp-164822`

same here DON'T use Project Name!
`gcloud builds submit --tag gcr.io/myapp-164822/helloworld`  
https://stackoverflow.com/questions/47520424/gcp-container-push-not-working-denied-please-enable-google-container-registr