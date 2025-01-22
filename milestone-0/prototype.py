import mysql.connector

## Program returns the names of the first n pokemons in the table

n = 50
while True:
    n = int(input("Enter a number between 0-40: "))
    if n >= 0 and n <= 40:
        break

db_connection = mysql.connector.connect(
    host="localhost", user="root", password="Sabi!234", database="pokemon"
)

cursor = db_connection.cursor()

sql = f"SELECT * FROM pokemon_cards LIMIT {n};"
print(sql)
cursor.execute(sql)

result = cursor.fetchall()

count = 1
for card in result:
    print(f"{count}. {card[7]}")
    ++count

db_connection.commit()
cursor.close()
db_connection.close()
