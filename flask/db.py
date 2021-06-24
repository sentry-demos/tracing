import json
import numpy
import os
import psycopg2
import string
import psycopg2.extras
import random
from random import seed
from random import randint
import time
from datetime import datetime
from pytz import timezone
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
import sqlalchemy
from sqlalchemy import create_engine
from utils import wait
import operator
from dotenv import load_dotenv
load_dotenv()

HOST = os.getenv("HOST")
DATABASE = os.getenv("DATABASE")
USERNAME = os.getenv("USERNAME")
PASSWORD = os.getenv("PASSWORD")
ENV = os.environ.get("FLASK_ENV")

insert_query = """INSERT INTO tools(name, type, sku, image, price)
                  VALUES (%s, %s, %s, %s, %s);"""

# generate random tool names + descriptions
def randomString(stringLength=10):
    """Generate a random string of fixed length"""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))

print("*****ENV *******", ENV)
if ENV == "test":
    db = create_engine('postgresql://' + USERNAME + ':' + PASSWORD + '@' + HOST + ':5432/' + DATABASE)
else:
    cloud_sql_connection_name = "sales-engineering-sf:us-central1:tracing-db-pg"
    db = sqlalchemy.create_engine(
        sqlalchemy.engine.url.URL(
            drivername='postgres+pg8000',
            username=USERNAME,
            password=PASSWORD,
            database=DATABASE,
            query={
                'unix_sock': '/cloudsql/{}/.s.PGSQL.5432'.format(cloud_sql_connection_name)
            }
        )
    )

def get_all_tools():
    tools = []
    try:
        with sentry_sdk.start_span(op="connect to db"):
            conn = db.connect()
        # Execute the query and fetch all results
        with sentry_sdk.start_span(op="run query"):
            wait(operator.le, 12, 1)
            results = conn.execute(
                "SELECT * FROM tools"
            ).fetchall()
        conn.close()

        rows = []
        with sentry_sdk.start_span(op="format results"):
            for row in results:
                rows.append(dict(row))
        return json.dumps(rows)
    except Exception as err:
        raise(err)


def get_inventory():
    try:
        with sentry_sdk.start_span(op="connect to db"):
            conn = db.connect()
        # Execute the query and fetch all results
        with sentry_sdk.start_span(op="run query"):
            results = conn.execute(
                "SELECT * FROM inventory" #will write the correct query in the future
            ).fetchall()
        conn.close()
        rows = []
        for row in results:
            rows.append(dict(row))
        return json.dumps(rows)
    except Exception as err:
        raise(err)

def update_inventory():
    try:
        with sentry_sdk.start_span(op="connect to db"):
            conn = db.connect()
        # Execute the query and fetch all results
        with sentry_sdk.start_span(op="run query"):
            results = conn.execute(
                "SELECT * FROM inventory" #will write the correct query in the future
            ).fetchall()
        conn.close()

        rows = []
        for row in results:
            rows.append(dict(row))
        return json.dumps(rows)
    except Exception as err:
        raise(err)
