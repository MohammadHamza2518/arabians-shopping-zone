import urllib.request
import json

req = urllib.request.Request("http://localhost:3000/api/products")
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    print(f"Products from API count: {len(data)}")
    print(f"First product: {data[0]['name']}")
