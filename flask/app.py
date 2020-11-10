import os
from flask import Flask, request, json, abort, make_response, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from db import get_all_tools, get_inventory, update_inventory
from dotenv import load_dotenv
load_dotenv()
DSN = os.getenv("FLASK_APP_DSN")

# use this if sending test data to a proxy and not Sentry
# def testData(DSN):
#     KEY = DSN.split('@')[0]
#     try:
#         # only use for local proxy, not proxy served by ngrok
#         if KEY.index('https') == 0:
#             KEY = KEY[:4] + KEY[5:]
#     except Exception as err:
#         print('DSN key w/ http from self-hosted')
#     PROXY = 'localhost:3001'
#     MODIFIED_DSN_SAVE = KEY + '@' + PROXY + '/3'
#     MODIFIED_DSN_SAVE = KEY + '@' + "3d19db15b56d.ngrok.io" + '/3'
#     return MODIFIED_DSN_SAVE
# DSN = testData(DSN)
# print("> DSN", DSN)

def before_send(event, hint):
    if event['request']['method'] == 'OPTIONS':
        return null
    return event    

import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn= DSN or "https://2ba68720d38e42079b243c9c5774e05c@sentry.io/1316515",
    traces_sample_rate=1.0,
    integrations=[FlaskIntegration()],
    release=os.environ.get("RELEASE"),
    environment="prod",
    before_send=before_send
)

app = Flask(__name__)
CORS(app)

@app.route('/success', methods=['GET'])
def success():
    response = make_response("success")
    return response

@app.route('/handled', methods=['GET'])
def handled_exception():
    try:
        '2' + 2
    except Exception as err:
        sentry_sdk.capture_exception(err)
    return 'failed'

@app.route('/unhandled', methods=['GET'])
def unhandled_exception():
    obj = {}
    obj['keyDoesntExist']

Inventory = {
    'wrench': 1,
    'nails': 1,
    'hammer': 1
}

def process_order(cart):
    global Inventory
    tempInventory = Inventory
    for item in cart:
        if Inventory[item['type']] <= 0:
            raise Exception("Not enough inventory for " + item['type'])
        else:
            tempInventory[item['type']] -= 1
            print 'Success: ' + item['type'] + ' was purchased, remaining stock is ' + str(tempInventory[item['type']])
    Inventory = tempInventory 

@app.before_request
def sentry_event_context():
    print('\nrequest.headers email', request.headers.get('email'))
    global Inventory
    with sentry_sdk.configure_scope() as scope:
        scope.user = { "email" : request.headers.get('email') }
        scope.set_tag("session-id", request.headers.get('X-Session-ID'))
        scope.set_extra("inventory", Inventory)

@app.route('/checkout', methods=['POST'])
def checkout():

    order = json.loads(request.data)
    print "Processing order for: " + request.headers.get('email')
    cart = order["cart"]
    
    with sentry_sdk.start_span(op="db function: get inventory"):
        try:
            rows = get_inventory()
        except Exception as err:
            sentry_sdk.capture_exception(err)
            raise(err)

    with sentry_sdk.start_span(op="process order"):
        process_order(cart)

    with sentry_sdk.start_span(op="db function: update inventory"):
        try:
            rows = update_inventory()
        except Exception as err:
            sentry_sdk.capture_exception(err)
            raise(err)

    return 'Success'

@app.route('/tools', methods=['GET'])
def get_tools():
    with sentry_sdk.start_span(op="db function: get all tools"):
        try:
            rows = get_all_tools()
        except Exception as err:
            sentry_sdk.capture_exception(err)
            raise(err)
    return rows