import urllib.request
import json

req = urllib.request.Request("http://localhost:3000/api/products")
with urllib.request.urlopen(req) as resp:
    products = json.loads(resp.read().decode('utf-8'))

for p in products:
    if "Luxury Test Royal Bisht" in p["name"]:
        del_req = urllib.request.Request(f"http://localhost:3000/api/products/{p['id']}", method='DELETE')
        with urllib.request.urlopen(del_req) as del_resp:
            print("Deleted test product:", p['id'], json.loads(del_resp.read().decode('utf-8')))

print("Cleaned up successfully!")
