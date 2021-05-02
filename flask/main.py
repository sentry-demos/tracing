import os
from flask import Flask
from flask_cors import CORS
from db import get_all_tools, get_inventory, update_inventory
# from db import get_all_tools
from dotenv import load_dotenv
import datetime
from utils import wait
import operator
import sys
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
load_dotenv()

# If you don't set a releaseit gets defaulted to month.week
RELEASE = None
if os.environ.get("RELEASE") is None:
    d=datetime.date.today()
    week=str((d.day-1)//7+1)
    date_given = datetime.datetime.today().date()
    month = str(date_given.month)
    RELEASE = month + "." + week
else:
    RELEASE = os.environ.get("RELEASE")
print("RELEASE is " + RELEASE)

DSN = os.getenv("FLASK_APP_DSN")

def before_send(event, hint):
    if event['request']['method'] == 'OPTIONS':
        return null
    return event

sentry_sdk.init(
    # dsn="https://6547dceffa934b738d0a40adec45c652@o87286.ingest.sentry.io/5260888",
    dsn= DSN or "https://2ba68720d38e42079b243c9c5774e05c@sentry.io/1316515",
    traces_sample_rate=1.0,
    integrations=[FlaskIntegration()],
    release=RELEASE,
    environment="production",
    before_send=before_send
)

app = Flask(__name__)
CORS(app)

@app.route('/success-tracing-flask', methods=['GET'])
def success():    
    sentry_sdk.capture_message("sucecss in tracing-flask")
    return "success in tracing-flask"
    # response = make_response("success")

# @app.route('/handled', methods=['GET'])
# def handled_exception():
#     try:
#         '2' + 2
#     except Exception as err:
#         sentry_sdk.capture_exception(err)
#     return 'failed'

# @app.route('/unhandled', methods=['GET'])
# def unhandled_exception():
#     obj = {}
#     obj['keyDoesntExist']

# Inventory = {
#     'wrench': 1,
#     'nails': 1,
#     'hammer': 1
# }

# def process_order(cart):
#     global Inventory
#     tempInventory = Inventory
#     wait(operator.ge, 14, .5)
#     for item in cart:
#         if Inventory[item['type']] <= 0:
#             raise Exception("Not enough inventory for " + item['type'])
#         else:
#             tempInventory[item['type']] -= 1
#             print("Success: " + item['type'] + " was purchased, remaining stock is " + str(tempInventory[item['type']]))
#             # print("Success: %s was purchased, remaining stock is %s" % (item['type'], str(tempInventory[item['type']])))
#     Inventory = tempInventory

# @app.before_request
# def sentry_event_context():
#     print('\nrequest.headers email', request.headers.get('email'))
#     global Inventory
#     with sentry_sdk.configure_scope() as scope:
#         scope.user = { "email" : request.headers.get('email') }
#         scope.set_extra("inventory", Inventory)

# @app.route('/checkout', methods=['POST'])
# def checkout():

#     order = json.loads(request.data)
#     print("Processing order for: " + request.headers.get('email'))
#     cart = order["cart"]

#     with sentry_sdk.start_span(op="db function: get inventory"):
#         try:
#             rows = get_inventory()
#         except Exception as err:
#             sentry_sdk.capture_exception(err)
#             raise(err)

#     with sentry_sdk.start_span(op="process order"):
#         process_order(cart)

#     with sentry_sdk.start_span(op="db function: update inventory"):
#         try:
#             rows = update_inventory()
#         except Exception as err:
#             sentry_sdk.capture_exception(err)
#             raise(err)

#     return 'Success'

@app.route('/tools', methods=['GET'])
def get_tools():
    with sentry_sdk.start_span(op="db function: get all tools"):
        try:
            rows = get_all_tools()
        except Exception as err:
            sentry_sdk.capture_exception(err)
            raise(err)
    return rows

# TODO test this with Cloud Run
if __name__ == '__main__':
    i = sys.version_info
    # print(i.major)
    # if i.major != "3":
    if sys.version_info[0] < 3:
        raise SystemExit("Failed to start: need python3")
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app.
    app.run(host='127.0.0.1', port=8080, debug=True)