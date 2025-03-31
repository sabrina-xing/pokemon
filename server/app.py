from flask import Flask, session, request, jsonify, send_file
from flask import Response
from bson import Binary 
import base64, binascii
import io
# from datasets.moneySet.moneyModel import predictMoney
# from datasets.sodaSet.sodaModel import predictSoda
# from datasets.phoneSet.phoneModel import predictPhone
from PIL import Image
from flask_cors import CORS
import os
from dotenv import load_dotenv
import mysql.connector

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enable CORS for all domains on all routes
CORS(app,  origins=["http://localhost:3000"])

# Database connection   
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),  # Leave empty if no password
    "database": os.getenv("DB_NAME", "pokepals"),
    "port": int(os.getenv("DB_PORT", 3306)),  # Default MySQL port
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

# Database connection
def get_db():
    return mysql.connector.connect(
        host="localhost",  # Update with your DB host
        user="root",  # Update with your DB user
        password="password",  # Update with your DB password
        database="mydb"  # Update with your DB name
    )

# Function for searching/filtering pokemon cards
@app.route('/search_pokemon', methods=['GET'])
def search_pokemon():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)

    try:
        # Extract query parameters
        card_id = request.args.get('card_id', default=None, type=str)
        pname = request.args.get('pname', default=None, type=str)
        set_name = request.args.get('set_name', default=None, type=str)
        generation = request.args.getlist('generation')
        rarity = request.args.getlist('rarity')
        pokemon_type = request.args.getlist('pokemon_type')
        subtype = request.args.get('subtype', default=None, type=str)
        # Validate inputs (Optional)
        if card_id:
            hyphen_count = card_id.count("-")
            if hyphen_count != 1:
                 return jsonify({"error": "Invalid card_id format"}), 400
            hyphen_index = card_id.find("-")
            if card_id[-1] == "-":
                 return jsonify({"error": "Invalid card_id format"}), 400
            if card_id[:hyphen_index].isalnum() == False or card_id[hyphen_index + 1: ].isalnum() == False:
                return jsonify({"error": "Invalid card_id format"}), 400
           
        if pname and not pname.replace(" ", "").isalpha():
            return jsonify({"error": "Invalid pname format"}), 400

        # Start building the query dynamically
        query = "SELECT * FROM pokemon_card WHERE 1=1"
        params = []

        if card_id:
            query += " AND card_id = %s"
            params.append(card_id)
        if pname:
            query += " AND pname LIKE %s"
            params.append(f"%{pname}%")
        if set_name:
            query += " AND set_name=%s"
            params.append(f"{set_name}")
        if generation:
            query += " AND generation IN (" + ", ".join(["%s"] * len(generation)) + ")"
            params.extend(generation)
        if rarity:
            query += " AND rarity IN (" + ", ".join(["%s"] * len(rarity)) + ")"
            params.extend(rarity)
        if pokemon_type:
            query += " AND pokemon_type IN (" + ", ".join(["%s"] * len(pokemon_type)) + ")"
            
            params.extend(pokemon_type)
        if subtype:
            query += " AND subtype=%s"
            params.append(f"{subtype}")
        # Execute query
        cursor.execute(query, params)
        results = cursor.fetchall()

        # Close connection
        cursor.close()
        conn.close()
        # Handle case when no results are found
        if not results:
            return jsonify({"message": "No Pokémon found"}), 200
        return jsonify(results)

    except mysql.connector.Error as e:
        print(f"Database query error: {e}")
        return jsonify({"error": "Database query failed"}), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Something went wrong"}), 500 
    

@app.route('/get_random_card', methods=['GET'])
def get_random_card():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor(dictionary=True)
    try: 
        uid = request.args.get('uid', type=int)
        if (uid):
            # check if uid exists
            params=[]
            query = "SELECT * FROM account WHERE uid=%s"
            params.append(uid)
            cursor.execute(query, params)
            results = cursor.fetchall()
            if len(results) == 0:
                return jsonify({"error": "User does not exist"}), 400

        # query random card
        # used view
        params = []
        # find 3 random cards
        query = "WITH owned AS (SELECT card_id FROM ownership WHERE uid = %s) "
        query += "SELECT * FROM pokemon_card WHERE card_id NOT IN (SELECT card_id FROM owned) ORDER BY RAND() LIMIT 1;"
        params.append(uid)
        cursor.execute(query, params)
        results = cursor.fetchone()
        if (len(results) < 1):
            return jsonify({"error": "No more Pokemon Cards"}), 500
        cursor.close()
        conn.close()
        return jsonify(results)

    except mysql.connector.Error as e:
        print(f"Database query error: {e}")
        return jsonify({"error": "Database query failed"}), 500
    
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Failed to add card"}), 500 




# add a card to user's account
@app.route('/add_card', methods=['POST'])
def add_card():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    try: 
        data = request.get_json()
        uid = int(data.get("uid"))
        card_id = data.get("card_id")
        if (uid):
            # check if uid exists
            params=[]
            query = "SELECT * FROM account WHERE uid=%s"
            params.append(uid)
            cursor.execute(query, params)
            results = cursor.fetchall()
            if len(results) == 0:
                return jsonify({"error": "User does not exist"}), 400

        if (card_id):
            params=[]
            query = "SELECT * FROM pokemon_card WHERE card_id=%s"
            params.append(card_id)
            cursor.execute(query, params)
            results = cursor.fetchall()
            if len(results) == 0:
                return jsonify({"error": "User does not exist"}), 400

        # used a transaction for insertion
        query = "START TRANSACTION; INSERT INTO ownership (uid, card_id) VALUES (%s,%s); COMMIT;"
        params = [int(uid), card_id]
        cursor.execute(query, params)
        conn.commit()
        print("SUCCESFULLY ADDED")
        return jsonify({"success": "pokemon added"}), 200


    except mysql.connector.Error as e:
        print(f"Database query error: {e}")
        return jsonify({"error": "Database query failed"}), 500
    
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Failed to add card"}), 500 


if __name__ == '__main__':
    app.run(debug=True)