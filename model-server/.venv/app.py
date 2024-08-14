from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf 
import numpy as np 
import os

app = Flask(__name__)
CORS(app)

script_dir = os.path.dirname(os.path.realpath(__file__))
model_file_path = os.path.join(script_dir, 'finalized_startup_model_loans_keras.keras')
model = tf.keras.models.load_model(model_file_path)

@app.route("/model-api", methods=["POST"])
def message():
    req = request.get_json()
    data = req['data']
    # prediction = model.predict(data.to_numpy())
    prediction = model.predict(np.array(data).reshape(1, -1))
    return jsonify({'prediction': float(prediction[0][0])})
