import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key found: {bool(api_key)}")

if api_key:
    genai.configure(api_key=api_key)
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content("Hello, can you hear me?")
        print("Success! Response:")
        print(response.text)
    except Exception as e:
        print(f"Error: {e}")
else:
    print("No API Key found")
