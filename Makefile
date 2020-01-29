

all:
	gcloud builds submit --config=cloudbuild.yaml && gcloud run deploy --image gcr.io/sales-engineering-sf/workspace_flask --platform managed && gcloud run deploy --image gcr.io/sales-engineering-sf/workspace_react --platform managed
