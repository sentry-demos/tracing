import os
from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
from dotenv import load_dotenv
load_dotenv()
DSN = os.getenv("FLASK_APP_DSN")

# FLASK_APP=testendpoint.py FLASK_ENV='test' flask run -p 3003

def before_send(event, hint):
    print('\nbeforesend')
    if event['request']['method'] == 'OPTIONS':
        return null
    return event    

import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn= "https://2ba68720d38e42079b243c9c5774e05c@sentry.io/1316515",
    traces_sample_rate=1.0,
    integrations=[FlaskIntegration()],
    release=os.environ.get("RELEASE"),
    environment="prod",
    before_send=before_send
)

app = Flask(__name__)
CORS(app)


@app.route('/test', methods=['GET'])
def get_tools():
    with sentry_sdk.configure_scope() as scope:
        print('does this work')
        scope.user = { "email" : "thisistheemail" }
        scope.set_tag("testtag", "thisisthetag")

        with sentry_sdk.start_span(op="db function: get all toolz"):
            try:
                print('did something')
            except Exception as err:
                sentry_sdk.capture_exception(err)
                raise(err)
    return 'success'