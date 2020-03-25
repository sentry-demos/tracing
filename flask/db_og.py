import os
import psycopg2
import string
import psycopg2.extras
import random
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
    print("00000")
    with sentry_sdk.start_span(op="psycopg2.connect"):
        connection = psycopg2.connect(
            host="34.70.84.230",
            database="hardwarestore",
            user="postgres",
            password="seatsentry")
    print("11111")
    return connection 

def add_tool(name = "Mallot", tool_type = "Hammer", image = "hammer.jpg"):
    connection = get_connection()
    cursor = connection.cursor()
    try:
        cursor.execute(insert_query, (name, tool_type, randomString(10), image, random.randint(10,50)))
        connection.commit()
    except:
        raise "Row insert failed\n"
    cursor.execute("SELECT * FROM tools ORDER BY ID DESC limit 1")
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return rows

def get_all_tools():
    connection = get_connection()
    cursor = connection.cursor()
    try:
        print("2222")
        with sentry_sdk.start_span(op="run query"):
            cursor.execute("SELECT * FROM tools")
            rows = cursor.fetchall()
        print("3333")        
        cursor.close()
        print("4444")        
        connection.close()
        print("5555")        
        return rows
    except Exception as err:
        sentry_sdk.capture_exception(err)
        return 'fail'