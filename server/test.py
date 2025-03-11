import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="",
    database="testdatabase"
)

mycursor = db.cursor()

# Schema
schema = [
    "DROP TABLE IF EXISTS attacks;",
    "DROP TABLE IF EXISTS abilities;",
    "DROP TABLE IF EXISTS resistances;",
    "DROP TABLE IF EXISTS weaknesses;",
    "DROP TABLE IF EXISTS transaction;",
    "DROP TABLE IF EXISTS pokemon_card;",
    "DROP TABLE IF EXISTS account;",

    """CREATE TABLE account (
        uid INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
        username VARCHAR(40) NOT NULL,
        email VARCHAR(255) NOT NULL,
        usr_password VARCHAR(255) NOT NULL,
        bio VARCHAR(255),
        pfp VARCHAR(255)
    );""",

    """CREATE TABLE pokemon_card (
        card_id VARCHAR(20) NOT NULL PRIMARY KEY, 
        pname VARCHAR(50) NOT NULL, 
        set_name VARCHAR(50) NOT NULL, 
        is_custom BOOLEAN NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        generation VARCHAR(50) NOT NULL,
        release_date DATE NOT NULL,
        rarity VARCHAR(50) NOT NULL,
        pokemon_type VARCHAR(20) NOT NULL,
        subtype VARCHAR(50) NOT NULL,
        hp INT NOT NULL, 
        level INT NOT NULL,
        flavour_text VARCHAR(255)
    );""",

    """CREATE TABLE transaction (
        tid INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        card_id VARCHAR(20) NOT NULL,
        tdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(sender_id) REFERENCES account(uid),
        FOREIGN KEY(receiver_id) REFERENCES account(uid),
        FOREIGN KEY(card_id) REFERENCES pokemon_card(card_id)
    );""",

    """CREATE TABLE weaknesses (
        type_name VARCHAR(20) NOT NULL, 
        weakness VARCHAR(20) NOT NULL, 
        PRIMARY KEY (type_name, weakness)
    );""",

    """CREATE TABLE resistances (
        type_name VARCHAR(20) NOT NULL, 
        resistance VARCHAR(20) NOT NULL,
        PRIMARY KEY (type_name, resistance)
    );""",

    """CREATE TABLE attacks (
        card_id VARCHAR(20) NOT NULL,
        attack_name VARCHAR(20) NOT NULL,
        description VARCHAR(255),
        damage INT NOT NULL,
        FOREIGN KEY(card_id) REFERENCES pokemon_card(card_id) ON DELETE CASCADE
    );""",

    """CREATE TABLE abilities (
        card_id VARCHAR(20) NOT NULL,
        ability_name VARCHAR(20) NOT NULL,
        description VARCHAR(255),
        FOREIGN KEY(card_id) REFERENCES pokemon_card(card_id) ON DELETE CASCADE
    );"""
]

for query in schema:
    mycursor.execute(query)

def getPokemon(card_id, pname, set_name, types, generation, evolution):
    query = "SELECT * FROM pokemon_card" 
    params = []
    whereClause = " WHERE"
        



    



