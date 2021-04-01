import os
from flask import Flask, request, json, abort, make_response, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from db import get_all_tools, get_inventory, update_inventory
from dotenv import load_dotenv
import datetime
from pytz import timezone
from utils import wait
import time
import numpy
import operator
load_dotenv()
DSN = os.getenv("FLASK_APP_DSN")

def before_send(event, hint):
    if event['request']['method'] == 'OPTIONS':
        return null
    return event

import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

RELEASE = None
if os.environ.get("RELEASE") is None:
    print("Prod environment")
    def week_number_of_month(date_value):
        return (date_value.isocalendar()[1] - date_value.replace(day=1).isocalendar()[1] + 1)
    date_given = datetime.datetime.today().date()
    month = str(date_given.month)
    week = str(week_number_of_month(date_given))
    RELEASE = month + "." + week
else:
    print("Dev environment")
    RELEASE = os.environ.get("RELEASE")
print("release is:", RELEASE)

sentry_sdk.init(
    dsn= DSN or "https://2ba68720d38e42079b243c9c5774e05c@sentry.io/1316515",
    traces_sample_rate=1.0,
    integrations=[FlaskIntegration()],
    release=RELEASE,
    environment="production",
    before_send=before_send
)

app = Flask(__name__)
CORS(app)

@app.route('/success', methods=['GET'])
def success():
    def week_number_month(date_value):
        return (date_value.isocalendar()[1] - date_value.replace(day=1).isocalendar()[1] + 1)
    date_given = datetime.datetime.today().date()
    month = str(date_given.month)
    week = str(week_number_month(date_given))
    RELEASE = month + "." + week

    response = make_response(str(RELEASE))
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
    wait(operator.ge, 14, .5)
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
