from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from ML_code import calorie
from pymongo.errors import DuplicateKeyError
from RAG import get_embedding_function,populate_database,query_data
import sys
sys.path.append('./Backend')


# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['Calorie']  # Database name
collection = db['Health_data']  # Collection name

# Route to save data in MongoDB
@app.route('/save', methods=['POST'])
def save_data():
    data = request.json
    if data:
        collection.create_index("userId", unique=True)
        try:
            collection.insert_one(data)  # Insert data into MongoDB
            
            return jsonify({"message": "Data saved successfully!"}), 200
        except DuplicateKeyError:
            return jsonify({"message": "User ID already exists!"}), 400
    # else:
    #     return jsonify({"error": "Invalid data!"}), 400

# Route to get user input (userId)
@app.route('/input', methods=['POST'])
def get_input():
    user_input = request.json.get('input')  # Access request data
    if user_input:
        return jsonify({"input": user_input}), 200
    else:
        return jsonify({"error": "User input not provided!"}), 400

# Route to fetch data and calculate calories
@app.route('/res', methods=['GET'])
def fetch_data():
    user_id = request.args.get('userId')  # Get userId from request query params
    if not user_id:
        return jsonify({"error": "UserId is required"}), 400

    # Fetch document for the given userId
    doc = calorie.get_data(client, user_id)
    if doc == "No data found":
        return jsonify({"error": "No data found for the provided UserId"}), 404

    # Calculate calories
    res = calorie.calc(doc)
    return jsonify({"result": res})

@app.route('/query', methods=['POST'])
def get_diet():
    query = request.json.get('query')
    if not query:
        return jsonify({"error": "Query is required"}), 400

    responses = query_data.query_rag(query)
    return jsonify({"result": responses}), 200


# Mock nutrition database (per unit)
FOOD_DB = {
    "apple": {
        "calories": 95,
        "protein": 0.5,
        "carbs": 25,
        "fat": 0.3,
        "fiber": 4.4,
        "vitaminC": 8.4,
    },
    "banana": {
        "calories": 105,
        "protein": 1.3,
        "carbs": 27,
        "fat": 0.3,
        "fiber": 3.1,
        "vitaminC": 10.3,
    },
    "chicken breast": {
        "calories": 165,
        "protein": 31,
        "carbs": 0,
        "fat": 3.6,
        "fiber": 0,
        "vitaminC": 0,
    },
    # Add more foods as needed
}

# Endpoint to get food nutrients
@app.route("/nutrients", methods=["POST"])
def get_nutrients():
    data = request.json
    food = data.get("food", "").lower()
    quantity = float(data.get("quantity", 1))

    if food not in FOOD_DB:
        return jsonify({"error": "Food not found"}), 404

    base = FOOD_DB[food]
    scaled = {k: round(v * quantity, 2) for k, v in base.items()}
    return jsonify({"food": food, "quantity": quantity, **scaled})

# Endpoint to calculate BMI
@app.route("/bmi", methods=["POST"])
def calculate_bmi():
    data = request.json
    try:
        weight = float(data.get("weight"))
        height_cm = float(data.get("height"))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid input"}), 400

    height_m = height_cm / 100
    if height_m <= 0:
        return jsonify({"error": "Height must be greater than zero"}), 400

    bmi = round(weight / (height_m ** 2), 2)
    category = (
        "Underweight" if bmi < 18.5 else
        "Normal" if bmi < 25 else
        "Overweight" if bmi < 30 else
        "Obese"
    )
    return jsonify({"bmi": bmi, "category": category})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)
