import mysql.connector
import csv
import os
from datetime import datetime
from dotenv import load_dotenv
import bcrypt

# Load environment variables
load_dotenv()

# Get database credentials
DB_HOST = os.getenv("DB_HOST", "localhost")  # sets default value if not found
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "pokepals")

db = mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    passwd=DB_PASSWORD,
    database=DB_NAME
)

mycursor = db.cursor()

# Schema
schema = [
    "DROP TABLE IF EXISTS attacks;",
    "DROP TABLE IF EXISTS abilities;",
    "DROP TABLE IF EXISTS resistances;",
    "DROP TABLE IF EXISTS weaknesses;",
    "DROP TABLE IF EXISTS transaction;",
    "DROP TABLE IF EXISTS ownership",
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

    """
    CREATE TABLE ownership (
        uid INT NOT NULL,
        card_id VARCHAR(20) NOT NULL,
        PRIMARY KEY (uid, card_id),
        FOREIGN KEY(uid) REFERENCES account(uid),
        FOREIGN KEY(card_id) REFERENCES pokemon_card(card_id)
    );
    """,

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
    print(query)
    mycursor.execute(query)

# create index...checks to see if index already exists first
def create_index(table_name, index_name, col_name):

    params = []
    check_index_query = """
    SELECT COUNT(*) 
    FROM information_schema.statistics 
    WHERE table_schema = DATABASE()
    AND table_name = %s
    AND index_name = %s;
    """
    params = [index_name, table_name]
    mycursor.execute(check_index_query, params)
    index_exists = mycursor.fetchone()[0] > 0
    
    if index_exists:
        drop_index_query = "DROP INDEX `{}` ON `{}`;".format(index_name, table_name)  # Use backticks for table and index
        mycursor.execute(drop_index_query)
    create_index_query = f"CREATE INDEX `{index_name}` ON `{table_name}` (`{col_name}`);"
    mycursor.execute(create_index_query)
    db.commit()
create_index("ownership","index_uid", "uid")
create_index("ownership","index_own_card", "card_id")
create_index("pokemon_card","index_card_id", "card_id")


def convert_date(date_str):
    return datetime.strptime(date_str, "%m/%d/%Y").strftime("%Y-%m-%d")

# loading pokemon card table
with open('../database/pokemon_card_production.csv', 'r') as csvfile:
    csvreader = csv.reader(csvfile)
    next(csvreader)
    data_to_insert = []
    for row in csvreader:
        release_date = convert_date(row[6])
        data_to_insert.append((
            row[0],  # card_id
            row[1],  # pname
            row[2],  # set_name
            row[3].lower() == 'false', #is_custom
            row[4],  # image_url
            row[5],  # generation
            release_date,
            row[7],  # rarity
            row[8],  # pokemon_type
            row[9],  # subtype
            int(row[10]),  # hp
            int(row[11]),  # level
            row[12]  # flavour_text
        ))

    mycursor.executemany("""
            INSERT INTO pokemon_card (
                card_id, pname, set_name, is_custom, image_url, generation, release_date,
                rarity, pokemon_type, subtype, hp, level, flavour_text
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, data_to_insert)
    db.commit()
    
    mycursor.execute("SELECT * FROM pokemon_card WHERE pname='Pikachu'")
    
    rows = mycursor.fetchall()
    for row in rows:
        print(row)

# loading account table
with open('../database/account.csv','r') as csvfile:
    csvreader = csv.reader(csvfile)
    next(csvreader)
    data_to_insert = []
    for row in csvreader:
        hashed_pass = bcrypt.hashpw(row[3].encode('utf-8'), bcrypt.gensalt())
        data_to_insert.append((int(row[0]), row[1], row[2], hashed_pass, row[4], row[5])) # uid,username,email,password,bio,pfp
    mycursor.executemany("""
            INSERT INTO account (
                uid, username, email, usr_password, bio, pfp    
            )
            VALUES (%s, %s, %s, %s, %s, %s)
        """, data_to_insert)
    db.commit()

with open('../database/ownership.csv','r') as csvfile:
    csvreader = csv.reader(csvfile)
    next(csvreader)
    data_to_insert = []
    for row in csvreader:
        data_to_insert.append((int(row[0]), row[1])) # uid, card_id
    mycursor.executemany("""
            INSERT INTO ownership (
                uid, card_id
            )
            VALUES (%s, %s)
        """, data_to_insert)
    db.commit()

mycursor.close()



    



