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

app = Flask(__name__)

# Enable CORS for all domains on all routes
CORS(app)


# TO DO: STARTER FUNCTIONS FOR TESTING

@app.route('/search', methods=['GET'])
def search(name):
    # search by id or name?
    # TO DO: implement

    try:
        pass
    except Exception as e:
        return jsonify({'error': str(e)})

    

    # ERROR CHECKING



    pass



if __name__ == '__main__':
    app.run(debug=True)