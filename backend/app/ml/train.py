import os
import pandas as pd
import numpy as np
import joblib
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'models')

# Official Dataset Paths
OFFICIAL_DATASET_PATH = os.environ.get('OFFICIAL_DATASET_PATH', os.path.join(DATA_DIR, 'official_climate_data.csv'))
TEMP_SAMPLE_PATH = os.path.join(DATA_DIR, 'temp_sample_data.csv')

def generate_temp_data(path: str):
    """Generates temporary sample data ONLY if official data is not yet provided by the user."""
    np.random.seed(42)
    print("WARNING: Official dataset not found. Generating temporary isolated sample data for pipeline testing...")
    
    states = ["Maharashtra", "Karnataka", "Kerala", "Gujarat", "Rajasthan"]
    
    data = []
    for _ in range(1000):
        state = np.random.choice(states)
        temp = np.random.normal(loc=30, scale=5)
        humidity = np.random.normal(loc=60, scale=15)
        wind = np.random.normal(loc=12, scale=4)
        
        # Target variable (Rainfall)
        rainfall = temp * 0.5 + humidity * 1.2 - wind * 0.3 + np.random.normal(loc=0, scale=10)
        rainfall = max(0, rainfall)
        
        data.append([state, temp, humidity, wind, rainfall])
        
    df = pd.DataFrame(data, columns=['state', 'temp', 'humidity', 'wind', 'rainfall'])
    df.to_csv(path, index=False)
    return df

def get_data() -> pd.DataFrame:
    """Automatically loads official data if it exists, otherwise falls back to temporary sample data."""
    os.makedirs(DATA_DIR, exist_ok=True)
    
    if os.path.exists(OFFICIAL_DATASET_PATH):
        print(f"Loading official dataset from {OFFICIAL_DATASET_PATH}")
        return pd.read_csv(OFFICIAL_DATASET_PATH)
    
    if not os.path.exists(TEMP_SAMPLE_PATH):
        return generate_temp_data(TEMP_SAMPLE_PATH)
        
    print(f"Loading temporary sample dataset from {TEMP_SAMPLE_PATH}")
    return pd.read_csv(TEMP_SAMPLE_PATH)

def preprocess(df: pd.DataFrame):
    # Very basic preprocessing for the pipeline
    # In production with official data, this will handle imputation, scaling, categorical encoding
    df_encoded = pd.get_dummies(df, columns=['state'], drop_first=True)
    
    X = df_encoded.drop(columns=['rainfall'])
    y = df_encoded['rainfall']
    
    return X, y, list(X.columns)

def train_model():
    df = get_data()
    X, y, feature_names = preprocess(df)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = XGBRegressor(n_estimators=100, max_depth=5, learning_rate=0.1)
    model.fit(X_train, y_train)
    
    preds = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    print(f"Model trained successfully. Validation RMSE: {rmse:.2f}")
    
    os.makedirs(MODEL_DIR, exist_ok=True)
    model_path = os.path.join(MODEL_DIR, 'rainfall_model.pkl')
    features_path = os.path.join(MODEL_DIR, 'feature_names.pkl')
    
    joblib.dump(model, model_path)
    joblib.dump(feature_names, features_path)
    
    print(f"Models saved to {MODEL_DIR}")

if __name__ == "__main__":
    train_model()
