import warnings
import whisper
import sys
import os
import json

# Suppress FutureWarning
warnings.filterwarnings("ignore", category=FutureWarning)

# Load Whisper model
model = whisper.load_model("base")

def transcribe_file(file_path):
    if not os.path.exists(file_path):
        return {"error": f"File not found: {file_path}"}

    try:
        result = model.transcribe(file_path, fp16=False)
        return {"text": result["text"]}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path provided"}))
        sys.exit(1)

    file_path = sys.argv[1]
    response = transcribe_file(file_path)
    print(json.dumps(response))
