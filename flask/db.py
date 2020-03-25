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

# DB == 'dev' # OS.GETENV("ENVIRONMENT")

# if DB == 'dev':
#     db = psycopg2.connect(
#     host="",
#     database="",
#     user="",
#     password="")

# if DB == 'prod':
#     cloud_sql_connection_name = "sales-engineering-sf:us-central1:tracing-db-pg"
#     db = sqlalchemy.create_engine(
#         # Equivalent URL:
#         # postgres+pg8000://<db_user>:<db_pass>@/<db_name>?unix_sock=/cloudsql/<cloud_sql_instance_name>/.s.PGSQL.5432
#         sqlalchemy.engine.url.URL(
#             drivername='postgres+pg8000',
#             username="",
#             password="",
#             database="",
#             query={
#                 'unix_sock': '/cloudsql/{}/.s.PGSQL.5432'.format(cloud_sql_connection_name)
#             }
#         )
#         # ... Specify additional properties here.
#     )


# generate random tool names + descriptions
def randomString(stringLength=10):
    """Generate a random string of fixed length"""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))

def list_dict_to_json(li):
    rows = []
    for row in li:
        rows.append(dict(row))
    return json.dumps(rows)

def get_connection():
    with sentry_sdk.start_span(op="psycopg2.connect"):
        connection = psycopg2.connect(
            host="",
            database="",
            user="",
            password="")
    return connection 

def add_tool(name = "Mallot", tool_type = "Hammer", image = "hammer.jpg"):
    connection = get_connection()
    cursor = connection.cursor(cursor_factory = psycopg2.extras.DictCursor)
    try:
        cursor.execute(insert_query, (name, tool_type, randomString(10), image, random.randint(10,50)))
        connection.commit()
    except:
        raise "Row insert failed\n"
        return 'fail'
    cursor.close()
    connection.close()
    return 'success'

def get_all_tools():
    connection = get_connection()
    cursor = connection.cursor(cursor_factory = psycopg2.extras.DictCursor)
    try:
        with sentry_sdk.start_span(op="run query"):
            cursor.execute("SELECT * FROM tools")
            results = cursor.fetchall()
        cursor.close()  
        connection.close()
        rows = list_dict_to_json(results)
        return rows
    except Exception as err:
        sentry_sdk.capture_exception(err)
        return 'fail'