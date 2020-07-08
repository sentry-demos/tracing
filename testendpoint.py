import os
from flask import Flask, request
from flask_cors import CORS

# FLASK_APP=testendpoint.py FLASK_ENV='test' flask run -p 3003

# def before_send(event, hint):
#     print('\nbeforesend')
#     if event['request']['method'] == 'OPTIONS':
#         return null
#     return event    



import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn= "https://6547dceffa934b738d0a40adec45c652@o87286.ingest.sentry.io/5260888",
    traces_sample_rate=1.0,
    integrations=[FlaskIntegration()]
)


app = Flask(__name__)
old_wsgi_app = app.wsgi_app
def wsgi_app(*a, **kw):
    with sentry_sdk.configure_scope() as scope:
        print('wsgi tag test')
        scope.user = { "email" : "thisistheemail" }
        scope.set_tag("testtag", "thisisthetag")
    return old_wsgi_app(*a, **kw)
app.wsgi_app = wsgi_app
CORS(app)

@app.route('/test', methods=['GET'])
def test():
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

@app.route('/handled', methods=['GET'])
def handled():
    with sentry_sdk.configure_scope() as scope:
        print('does this still work')
        scope.user = { "email" : "thisistheemail" }
        scope.set_tag("testtag", "thisisthetag")
        try:
            '5' + 5
        except Exception as err:
            sentry_sdk.capture_exception(err)
        return 'failed'