from flask import Flask, make_response, request, jsonify, send_file
from flask import Response
from bson import Binary 
import base64, binascii
import io
# from datasets.moneySet.moneyModel import predictMoney
# from datasets.sodaSet.sodaModel import predictSoda
# from datasets.phoneSet.phoneModel import predictPhone
from PIL import Image
from flask_cors import CORS

import mysql.connector

app = Flask(__name__)

# Enable CORS for all domains on all routes
CORS(app)

# Database connection
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "pokepals"
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

# TO DO: STARTER FUNCTIONS FOR TESTING

# Function for searching/filtering pokemon cards
@app.route('/search_pokemon', methods=['GET'])
def search_pokemon():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Extract query parameters
    card_id = request.args.get('card_id', default=None, type=str)
    pname = request.args.get('pname', default=None, type=str)
    set_name = request.args.get('set_name', default=None, type=str)
    generation = request.args.getlist('generation')  # Supports multiple values
    rarity = request.args.getlist('rarity')
    pokemon_type = request.args.getlist('pokemon_type')
    subtype = request.args.get('subtype', default=None, type=str)

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
        query += " AND set_name LIKE %s"
        params.append(f"%{set_name}%")
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
        query += " AND subtype LIKE %s"
        params.append(f"%{subtype}%")

    # Execute query
    cursor.execute(query, params)
    results = cursor.fetchall()

    # Close connection
    cursor.close()
    conn.close()

    return jsonify(results)


# Function to gift card (transfer card to receiver)
@app.route('/gift_card', methods=['POST'])
def gift_card():
    conn = get_db_connection()
    cursor = conn.cursor()

    data = request.json
    sender_id = data.get('sender_id')
    receiver_id = data.get('receiver_id')
    card_id = data.get('card_id')


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
    if sender_id == receiver_id:
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
        original_owner = sender_id
    else:
        original_owner = latest_owner[0]

    if original_owner != sender_id:
        cursor.close()
        conn.close()
        return jsonify({"error": "Sender does not own this card"}), 400


    # Transfer the card
    query = "INSERT INTO transaction (card_id, sender_id, receiver_id, tdate) VALUES (%s, %s, %s, NOW())"
    cursor.execute(query, (card_id, sender_id, receiver_id))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Card gifted successfully"})

if __name__ == '__main__':
    app.run(debug=True)