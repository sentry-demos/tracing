import os
from flask import Flask, request, json, abort, make_response, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
# from db import add_tool, get_all_tools
from db import get_all_tools
def before_send(event, hint):
    if event['request']['method'] == 'OPTIONS':
        return null
    return event    

import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="https://2ba68720d38e42079b243c9c5774e05c@sentry.io/1316515",
    traces_sample_rate=1.0,
    integrations=[FlaskIntegration()],
    release=os.environ.get("VERSION"),
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
        item['type'] = item['type'].encode('utf-8')
        if Inventory[item['type']] <= 0:
            raise Exception("Not enough inventory for " + item['type'])
        else:
            tempInventory[item['type']] -= 1
            print 'Success: ' + item['type'] + ' was purchased, remaining stock is ' + str(tempInventory[item['type']])
    Inventory = tempInventory 

@app.before_request
def sentry_event_context():

    if (request.data):
        order = json.loads(request.data)
        with sentry_sdk.configure_scope() as scope:
                scope.user = { "email" : order["email"] }
    transactionId = request.headers.get('X-Transaction-ID')
    sessionId = request.headers.get('X-Session-ID')
    global Inventory

    with sentry_sdk.configure_scope() as scope:
        scope.set_tag("transaction_id", transactionId)
        scope.set_tag("session-id", sessionId)
        scope.set_extra("inventory", Inventory)

@app.route('/checkout', methods=['POST'])
def checkout():

    order = json.loads(request.data)
    print "Processing order for: " + order["email"]
    cart = order["cart"]
    
    process_order(cart)

    return 'Success'

# @app.route('/tool', methods=['POST'])
# def new_tool():
#     with sentry_sdk.start_span(op="db read"):
#         try:
#             rows = add_tool()
#         except:
#             raise "error adding tool"
#     return str(rows)


@app.route('/tools', methods=['GET'])
def get_tools():
    with sentry_sdk.start_span(op="db read"):
        try:
            rows = get_all_tools()
        except Exception as err:
            sentry_sdk.capture_exception(err)
            raise(err)
    return rows