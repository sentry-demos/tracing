import psycopg2
import string
import psycopg2.extras
import random


insert_query = """INSERT INTO tools(name, description, sku, price) 
                  VALUES (%s, %s, %s, %s);"""

# generate random tool names + descriptions
def randomString(stringLength=10):
    """Generate a random string of fixed length"""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))

def get_connection():
    connection = psycopg2.connect(
        host = "",
        database = "hardwarestore",
        user = "postgres",
        password = "")
    return connection 

def add_tool(name = "Mallot"):
    connection = get_connection()
    cursor = connection.cursor()
    try:
        cursor.execute(insert_query, (name, name, randomString(10), random.randint(10,50)))
        connection.commit()
    except:
        print "Row insert failed\n"
    cursor.execute("SELECT * FROM tools ORDER BY ID DESC limit 1")
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return rows

def get_all_tools():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM tools")
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return rows