FROM python:3.8-slim

COPY . ./app
WORKDIR /app

RUN pip install -r requirements.txt

CMD FLASK_APP=main.py flask run --host=0.0.0.0 -p $PORT
