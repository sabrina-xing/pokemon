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


if __name__ == '__main__':
    app.run(debug=True)