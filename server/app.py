from flask import Flask, session, request, jsonify, send_file
from flask import Response
from bson import Binary 
import base64, binascii
import io
import re
from PIL import Image
from flask_cors import CORS
import os
from dotenv import load_dotenv
import mysql.connector

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enable CORS for all domains on all routes
# CORS(app,  origins=["http://localhost:3000"])
CORS(app)

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
# def get_db():
#     return mysql.connector.connect(**DB_CONFIG)

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
        query = """
            SELECT pc.*, COALESCE(o.username, NULL) AS owner_username
            FROM pokemon_card pc
            LEFT JOIN card_owners o ON pc.card_id = o.card_id
            WHERE 1=1
        """
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

# Email validation function using regex
def is_valid_email(email):
    email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(email_regex, email) is not None
   
@app.route('/view_account', methods=['GET'])
def view_account():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Extract user ID from request
    uid = request.args.get('uid', type=int)
    if not uid:
        return jsonify({"error": "User ID (uid) is required"}), 400

    # Query account information
    query = "SELECT * FROM account WHERE uid = %s"
    cursor.execute(query, (uid,))
    user_data = cursor.fetchone()

    # Close connection
    cursor.close()
    conn.close()

    # Handle case where user does not exist
    if not user_data:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user_data)

# Email validation function using regex
def is_valid_email(email):
    email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(email_regex, email) is not None

@app.route('/update_account', methods=['POST'])
def update_account():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    cursor = conn.cursor()

    # Extract JSON data from request
    data = request.json
    uid = data.get("uid")

    if not uid:
        return jsonify({"error": "User ID (uid) is required"}), 400

    # Allowed fields for update
    allowed_fields = ["username", "email", "password", "bio", "pfp"]
    
    # Filter out fields that should not be updated
    updates = {key: value for key, value in data.items() if key in allowed_fields and value is not None}

    if not updates:
        return jsonify({"error": "No valid fields provided for update"}), 400
    
    # Check email format if email is being updated
    if "email" in updates and not is_valid_email(updates["email"]):
        return jsonify({"error": "Invalid email format"}), 400

    # Build query dynamically
    set_clause = ", ".join(f"{key} = %s" for key in updates.keys())
    query = f"UPDATE account SET {set_clause} WHERE uid = %s"
    
    # Execute query
    try:
        cursor.execute(query, list(updates.values()) + [uid])
        conn.commit()
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "Account updated successfully"})

@app.route('/user_pokemon', methods=['GET'])
def get_user_pokemon():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    cursor = conn.cursor(dictionary=True)

    try:
        # Extract query parameters
        uid = request.args.get("uid", type=int)
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
        query = """
            SELECT pc.*
            FROM ownership o
            JOIN pokemon_card pc ON o.card_id = pc.card_id
            WHERE o.uid = %s
        """
        params = [uid]

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
        print(query)
        print(params)
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

# Function to gift card (transfer card to receiver)
@app.route('/gift_card', methods=['POST'])
def gift_card():
    conn = get_db_connection()
    cursor = conn.cursor()

    data = request.json
    sender_username = data.get('sender_username')
    receiver_username = data.get('receiver_username')
    card_id = data.get('card_id')

    # Get userid from usernames
    cursor.execute("SELECT uid FROM account WHERE username = %s", (receiver_username,))
    receiver_id = cursor.fetchone()[0] > 0
    cursor.execute("SELECT uid FROM account WHERE username = %s", (sender_username,))
    sender_id = cursor.fetchone()[0] > 0

    # Error handling
    # check if sender and receiver exist in the account table
    cursor.execute("SELECT COUNT(*) FROM account WHERE uid = %s", (sender_id,))        
    sender_exists = cursor.fetchone()[0] > 0

    cursor.execute("SELECT COUNT(*) FROM account WHERE uid = %s", (receiver_id,))
    receiver_exists = cursor.fetchone()[0] > 0

    if not sender_exists or not receiver_exists:
        cursor.close()
        conn.close()
        return jsonify({"error": "Sender or receiver does not exist"}), 400

    # prevent self-transfers
    if sender_uid == receiver_uid:
        cursor.close()
        conn.close()
        return jsonify({"error": "Sender and receiver cannot be the same"}), 400

    # check if sender owns the card
    cursor.execute("""
        SELECT receiver_id 
        FROM transaction 
        WHERE card_id = %s 
        ORDER BY tdate DESC 
        LIMIT 1
    """, (card_id,))

    latest_owner = cursor.fetchone()

    # if no previous transactions, check if the card is in the original dataset
    if not latest_owner:
        cursor.execute("SELECT COUNT(*) FROM pokemon_card WHERE card_id = %s", (card_id,))
        card_exists = cursor.fetchone()[0] > 0

        if not card_exists:
            cursor.close()
            conn.close()
            return jsonify({"error": "Card does not exist"}), 400

        # if card exists but never been traded, assume original ownership
        original_owner = sender_uid
    else:
        original_owner = latest_owner[0]

    if original_owner != sender_uid:
        cursor.close()
        conn.close()
        return jsonify({"error": "Sender does not own this card"}), 400


    # Transfer the card
    query = "INSERT INTO transaction (card_id, sender_id, receiver_id, tdate) VALUES (%s, %s, %s, NOW())"
    cursor.execute(query, (card_id, sender_id, receiver_id))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Card gift sent successfully"})

# Function to request card (transfers card to reciever)
@app.route('/request_card', methods=['POST'])
def request_card():
    conn = get_db_connection()
    cursor = conn.cursor()

    data = request.json
    sender_username = data.get('sender_username')
    receiver_username = data.get('receiver_username')
    card_id = data.get('card_id')

    # Get userid from usernames
    cursor.execute("SELECT uid FROM account WHERE username = %s", (receiver_username,))
    receiver_id = cursor.fetchone()[0] > 0
    cursor.execute("SELECT uid FROM account WHERE username = %s", (sender_username,))
    sender_id = cursor.fetchone()[0] > 0

    # Error handling to ensure sender and reciever exists
    cursor.execute("SELECT COUNT(*) FROM account WHERE uid = %s", (sender_id,))
    sender_exists = cursor.fetchone()[0] > 0

    cursor.execute("SELECT COUNT(*) FROM account WHERE uid = %s", (requester_id,))
    requester_exists = cursor.fetchone()[0] > 0

    if not sender_exists or not requester_exists:
        cursor.close()
        conn.close()
        return jsonify({"error": "Sender or requester does not exist"}), 400
    
    # prevent self-transfers
    if sender_id == requester_id:
        cursor.close()
        conn.close()
        return jsonify({"error": "Sender and requester cannot be the same"}), 400
    
    # Check if sender owns card
    cursor.execute("""
        SELECT receiver_id 
        FROM transaction 
        WHERE card_id = %s 
        ORDER BY tdate DESC 
        LIMIT 1
    """, (card_id,))

    latest_owner = cursor.fetchone()

    if not latest_owner or latest_owner != sender_id:
        cursor.close()
        conn.close()
        return jsonify({"error": "Sender does not own card"})
    
    # Transfer the card
    query = """INSERT INTO transaction 
        (card_id, sender_id, receiver_id, tdate)
        VALUES (%s, %s, %s, NOW())"""
    cursor.execut(query, (card_id, sender_id, requester_id))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Card requested successfully"})
    


if __name__ == '__main__':
    app.run(debug=True)
