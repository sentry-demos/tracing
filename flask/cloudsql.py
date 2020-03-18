import psycopg2
import string
import psycopg2.extras

table_query = """CREATE TABLE IF NOT EXISTS items (id serial NOT NULL, name varchar(45) NOT NULL,description varchar(100) NOT NULL, price integer NOT NULL, PRIMARY KEY (id));"""
insert_query = """INSERT INTO items(name, description, price) 
                VALUES (%s);"""

# CREATE TABLE IF NOT EXISTS app_user (
#   id serial NOT NULL, 
#   name varchar(45) NOT NULL,
#   description varchar(100) NOT NULL,
#   price integer NOT NULL,
#   PRIMARY KEY (id)
# )

# INSERT INTO items(name, description, price)
# VALUES
#    (name_of_the_item, description_of_the_item, 100000);

# generate random tool names + descriptions
def randomString(stringLength=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))


connection = psycopg2.connect(
        host = "",
        database = "tools",
        user = "postgres",
        password = "")

# cursor = connection.cursor(cursor_factory=psycopg2.extras.DictCursor)
cursor = connection.cursor()

try:
    cursor.execute(table_query)
except:
    print "Table creation failed\n"

try:
    cursor.execute(sql, (randomString(10), randomString(10), 10))
except:
    print "Row insert failed\n"

rows = cursor.fetchall()

print rows[0]


cursor.close()
connection.close()