import json
import base64

with open('firebase_key.json', 'r') as f:
    data = f.read()
    print(data)
    result = base64.b64encode(data.encode('utf-8'))
    print(result.decode('utf-8'))
