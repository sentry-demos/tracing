import os
import psycopg2
import string
import psycopg2.extras
import random
import json
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
from dotenv import load_dotenv
load_dotenv()
HOST = os.getenv("HOST")
DATABASE = os.getenv("DATABASE")
USERNAME = os.getenv("USERNAME")
PASSWORD = os.getenv("PASSWORD")

insert_query = """INSERT INTO tools(name, type, sku, image, price) 
                  VALUES (%s, %s, %s, %s, %s);"""

# generate random tool names + descriptions
def randomString(stringLength=10):
    """Generate a random string of fixed length"""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))

def get_connection():
    with sentry_sdk.start_span(op="psycopg2.connect"):
        connection = psycopg2.connect(
            host = HOST,
            database = DATABASE,
            user = USERNAME,
            password = PASSWORD)
    return connection 

def list_dict_to_json(li):
    rows = []
    for row in li:
        rows.append(dict(row))
    return json.dumps(rows)

def add_tool(name = "Mallot", tool_type = "Hammer", image = "hammer.jpg"):
    connection = get_connection()
    cursor = connection.cursor(cursor_factory = psycopg2.extras.DictCursor)
    try:
        cursor.execute(insert_query, (name, tool_type, randomString(10), image, random.randint(10,50)))
        connection.commit()
    except:
        raise "Row insert failed\n"
    cursor.close()
    connection.close()
    return 

def get_all_tools():
    connection = get_connection()
    cursor = connection.cursor(cursor_factory = psycopg2.extras.DictCursor)
    with sentry_sdk.start_span(op="run query"):
        cursor.execute("SELECT * FROM tools")
        results = cursor.fetchall()
    cursor.close()
    connection.close()
    rows = list_dict_to_json(results)
    return rows
    