import json
import os
import psycopg2
import string
import psycopg2.extras
import random
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
import sqlalchemy
from sqlalchemy import create_engine
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

# def get_connection():
#     with sentry_sdk.start_span(op="psycopg2.connect"):
#         connection = psycopg2.connect(
#             host = HOST,
#             database = DATABASE,
#             user = USERNAME,
#             password = PASSWORD)
#     return connection 

# def add_tool(name = "Mallot", tool_type = "Hammer", image = "hammer.jpg"):
#     connection = get_connection()
#     cursor = connection.cursor()
#     try:
#         cursor.execute(insert_query, (name, tool_type, randomString(10), image, random.randint(10,50)))
#         connection.commit()
#     except:
#         raise "Row insert failed\n"
#     cursor.execute("SELECT * FROM tools ORDER BY ID DESC limit 1")
#     rows = cursor.fetchall()
#     cursor.close()
#     connection.close()
#     return rows
print("*****ENV *******", ENV)
if ENV == 'development':
    db = create_engine('postgresql://' + USERNAME + ':' + PASSWORD + '@' + HOST + ':5432/' + DATABASE)
else:
    cloud_sql_connection_name = "sales-engineering-sf:us-central1:tracing-db-pg"
    db = sqlalchemy.create_engine(
        # Equivalent URL:
        # postgres+pg8000://<db_user>:<db_pass>@/<db_name>?unix_sock=/cloudsql/<cloud_sql_instance_name>/.s.PGSQL.5432
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
        with db.connect() as conn:
            # Execute the query and fetch all results
            results = conn.execute(
                "SELECT * FROM tools"
            ).fetchall()
            conn.close()
            
            rows = []
            for row in results:
                rows.append(dict(row))
            return json.dumps(rows)
    except Exception as err:
        sentry_sdk.capture_exception(err)
        return 'get all tools1 failed'
        # return rows
        # for row in rows:
        #     tools.append({
        #         'a': row[0],
        #         'b': row[1]
        #     })

# def get_all_tools():
#     connection = get_connection()
#     cursor = connection.cursor()
#     try:
#         print('0000000')
#         with sentry_sdk.start_span(op="run query"):
#             cursor.execute("SELECT * FROM tools")
#             rows = cursor.fetchall()
#         cursor.close()
#         connection.close()
#         print('1111111')
#         return rows
#     except Exception as err:
#         print('2222222')
#         sentry_sdk.capture_exception(err)
#     return 'failed'
#         # print(err)