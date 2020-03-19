import psycopg2
connection = psycopg2.connect(
        host = "34.70.84.230",
        database = "tools",
        user = "postgres",
        password = "seatsentry")
cursor = connection.cursor()
cursor.execute("SELECT * FROM items")
all_rows = cursor.fetchall()
print all_rows
cursor.close() 
connection.close()