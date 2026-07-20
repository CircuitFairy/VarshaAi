import os
import joblib
import pandas as pd
import numpy as np

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'models')
MODEL_PATH = os.path.join(MODEL_DIR, 'rainfall_model.pkl')
FEATURES_PATH = os.path.join(MODEL_DIR, 'feature_names.pkl')

_model = None
_feature_names = None

def load_model():
    global _model, _feature_names
    if _model is None:
        if not os.path.exists(MODEL_PATH) or not os.path.exists(FEATURES_PATH):
            raise FileNotFoundError("Model files not found. Please train the model first.")
        _model = joblib.load(MODEL_PATH)
        _feature_names = joblib.load(FEATURES_PATH)
    return _model, _feature_names

def predict_rainfall(state: str, temp: float, humidity: float, wind: float) -> float:
    model, feature_names = load_model()
    
    # Create input DataFrame matching training columns
    input_data = {
        'temp': [temp],
        'humidity': [humidity],
        'wind': [wind]
    }
    
    df_input = pd.DataFrame(input_data)
    
    # Handle categorical encoding for the state
    for col in feature_names:
        if col.startswith('state_'):
            state_name = col.replace('state_', '')
            df_input[col] = 1 if state == state_name else 0
            
    # Ensure all columns from training are present in the exact order
    for col in feature_names:
        if col not in df_input.columns:
            df_input[col] = 0
            
    df_input = df_input[feature_names]
    
    prediction = model.predict(df_input)[0]
    return max(0, float(prediction))
