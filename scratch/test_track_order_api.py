import requests
import json

BASE_URL = "http://localhost:5000"

print("--- 1. Testing Track by Full ID: ASZ-1089 ---")
r = requests.get(f"{BASE_URL}/api/orders/track/ASZ-1089")
print("Status code:", r.status_code)
assert r.status_code == 200, f"Failed: {r.text}"
data = r.json()
assert data["order"]["id"] == "ASZ-1089"
print("SUCCESS: Found order", data["order"]["id"], "Status:", data["order"]["status"])

print("\n--- 2. Testing Track by numeric ID only: 1089 ---")
r = requests.get(f"{BASE_URL}/api/orders/track/1089")
assert r.status_code == 200
data = r.json()
assert data["order"]["id"] == "ASZ-1089"
print("SUCCESS: 1089 resolved to", data["order"]["id"])

print("\n--- 3. Testing Track by #ASZ-1089 ---")
r = requests.get(f"{BASE_URL}/api/orders/track/%23ASZ-1089")
assert r.status_code == 200
data = r.json()
assert data["order"]["id"] == "ASZ-1089"
print("SUCCESS: #ASZ-1089 resolved to", data["order"]["id"])

print("\n--- 4. Testing Track by Phone: 9871234560 ---")
r = requests.get(f"{BASE_URL}/api/orders/track/9871234560")
assert r.status_code == 200
data = r.json()
assert data["order"]["id"] == "ASZ-1089"
print("SUCCESS: Phone matched order", data["order"]["id"])

print("\n--- 5. Testing Track by Phone with +91: +91 98712 34560 ---")
r = requests.get(f"{BASE_URL}/api/orders/track/%2B91%2098712%2034560")
assert r.status_code == 200
data = r.json()
assert data["order"]["id"] == "ASZ-1089"
print("SUCCESS: +91 formatted phone matched order", data["order"]["id"])

print("\n--- 6. Testing Track by AWB number: BD982341982IN ---")
r = requests.get(f"{BASE_URL}/api/orders/track/BD982341982IN")
assert r.status_code == 200
data = r.json()
assert data["order"]["id"] == "ASZ-1089"
print("SUCCESS: BlueDart AWB matched order", data["order"]["id"])

print("\n--- 7. Placing a NEW Real Order via POST /api/orders ---")
new_order_payload = {
    "customer": {
        "name": "Arshad Khan",
        "phone": "9988776655",
        "email": "arshad@test.com",
        "city": "Lucknow",
        "state": "Uttar Pradesh",
        "address": "Hazratganj, Lucknow"
    },
    "items": [
        {
            "id": "thobe-saudi-classic-white",
            "name": "Luxury Saudi Cut Pure White Arabian Thobe",
            "price": 1699,
            "quantity": 1,
            "selectedSize": "54 (M)",
            "image": "/assets/studio/mens_white_thobe.jpg"
        }
    ],
    "subtotal": 1699,
    "discount": 0,
    "deliveryFee": 0,
    "total": 1699,
    "paymentMethod": "COD"
}
post_res = requests.post(f"{BASE_URL}/api/orders", json=new_order_payload)
assert post_res.status_code == 201, f"Failed: {post_res.text}"
new_order = post_res.json()
new_order_id = new_order["id"]
print("Created real new order:", new_order_id)

print(f"\n--- 8. Tracking newly created order by ID: {new_order_id} ---")
track_res = requests.get(f"{BASE_URL}/api/orders/track/{new_order_id}")
assert track_res.status_code == 200
assert track_res.json()["order"]["id"] == new_order_id
print(f"SUCCESS: Newly created order {new_order_id} is 100% trackable!")

print(f"\n--- 9. Tracking newly created order by Phone: 9988776655 ---")
track_phone_res = requests.get(f"{BASE_URL}/api/orders/track/9988776655")
assert track_phone_res.status_code == 200
assert track_phone_res.json()["order"]["id"] == new_order_id
print("SUCCESS: Newly created order is 100% trackable by phone number!")

print("\nALL 9 TRACKING TESTS PASSED PERFECTLY!")
