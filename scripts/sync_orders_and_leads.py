import json

store_path = "server/data/store.json"
with open(store_path, "r", encoding="utf-8") as f:
    store = json.load(f)

demo_orders = [
    {
        "id": "ASZ-1089",
        "createdAt": "2026-09-02 18:45",
        "date": "2026-09-02 18:45",
        "customerName": "Syed Tariq Hashmi",
        "phone": "9871234560",
        "email": "tariq.hashmi@gmail.com",
        "address": "Flat 402, Al-Madina Heights, Mehdipatnam, Hyderabad, Telangana - 500028",
        "customer": {
            "name": "Syed Tariq Hashmi",
            "phone": "9871234560",
            "email": "tariq.hashmi@gmail.com",
            "address": "Flat 402, Al-Madina Heights, Mehdipatnam",
            "city": "Hyderabad",
            "state": "Telangana",
            "pincode": "500028"
        },
        "items": [
            {
                "id": "talbina-vanilla",
                "name": "Arabian's Talbeena Vanilla Dry Fruits (250g)",
                "price": 349,
                "quantity": 2,
                "image": "/assets/talbina/talbina_vanilla_dryfruits.png"
            },
            {
                "id": "white-oudh-attar",
                "name": "Imperial White Oudh Attar (12ml)",
                "price": 649,
                "quantity": 1,
                "image": "/assets/studio/dehnul_oud_pure.jpg"
            }
        ],
        "subtotal": 1347,
        "discount": 135,
        "couponCode": "ARABIAN10",
        "deliveryFee": 0,
        "total": 1212,
        "paymentMode": "cod",
        "status": "Dispatched",
        "courier": "BlueDart Express",
        "trackingNumber": "BD982341982IN"
    },
    {
        "id": "ASZ-1088",
        "createdAt": "2026-09-02 14:20",
        "date": "2026-09-02 14:20",
        "customerName": "Irfan Mansoori",
        "phone": "9123456789",
        "email": "irfan.mansoori@yahoo.com",
        "address": "House 12, Gulshan Colony, Zakir Nagar, Okhla, New Delhi, Delhi - 110025",
        "customer": {
            "name": "Irfan Mansoori",
            "phone": "9123456789",
            "email": "irfan.mansoori@yahoo.com",
            "address": "House 12, Gulshan Colony, Zakir Nagar, Okhla",
            "city": "New Delhi",
            "state": "Delhi",
            "pincode": "110025"
        },
        "items": [
            {
                "id": "thobe-al-noor-signature",
                "name": "Al-Noor Signature Embroidered Thobe",
                "selectedSize": "56 (L)",
                "price": 1899,
                "quantity": 1,
                "image": "/assets/thobes/thobes__al_noor_design_p1_1.png"
            }
        ],
        "subtotal": 1899,
        "discount": 190,
        "couponCode": "ARABIAN10",
        "deliveryFee": 0,
        "total": 1709,
        "paymentMode": "upi",
        "status": "In Transit",
        "courier": "Delhivery Air",
        "trackingNumber": "DLH99238419"
    },
    {
        "id": "ASZ-1087",
        "createdAt": "2026-09-01 11:15",
        "date": "2026-09-01 11:15",
        "customerName": "Farhan Ahmed",
        "phone": "9845123456",
        "email": "farhan.ahmed@gmail.com",
        "address": "7th Cross, Shivaji Nagar, Bangalore, Karnataka - 560051",
        "customer": {
            "name": "Farhan Ahmed",
            "phone": "9845123456",
            "email": "farhan.ahmed@gmail.com",
            "address": "7th Cross, Shivaji Nagar",
            "city": "Bangalore",
            "state": "Karnataka",
            "pincode": "560051"
        },
        "items": [
            {
                "id": "nikah-nama-booklet-luxury",
                "name": "Luxury Velvet Gold-Foil Nikah Nama Booklet",
                "price": 1499,
                "quantity": 1,
                "image": "/assets/studio/nikah_nama_booklet.jpg"
            },
            {
                "id": "nikah-luxury-pen-box-set",
                "name": "Royal Crystal & Ostrich Feather Nikah Signing Pen Set",
                "price": 799,
                "quantity": 1,
                "image": "/assets/studio/nikah_nama_booklet.jpg"
            }
        ],
        "subtotal": 2298,
        "discount": 200,
        "couponCode": "SUNNAH100",
        "deliveryFee": 0,
        "total": 2098,
        "paymentMode": "upi",
        "status": "Delivered",
        "courier": "DTDC Express",
        "trackingNumber": "DTDC100234"
    }
]

demo_distributors = [
    {
        "id": "DIST-101",
        "businessName": "Al-Huda Islamic Emporium",
        "ownerName": "Maulana Abdul Wahid",
        "phone": "9823456780",
        "email": "alhuda.emporium@gmail.com",
        "city": "Lucknow",
        "state": "Uttar Pradesh",
        "investment": "₹50,000 - ₹1,00,000 (City Stockist)",
        "categories": ["Arabians Talbina (All Flavors)", "Designer Thobes & Jubbas (Men)"],
        "notes": "We have 2 prime stores in Aminabad and Chowk. Monthly demand for Sunnah breakfast is huge.",
        "status": "Hot Lead"
    },
    {
        "id": "DIST-102",
        "businessName": "Madina Superstore & Attar House",
        "ownerName": "Zubair Merchant",
        "phone": "9812345678",
        "email": "madina.attar@gmail.com",
        "city": "Calicut (Kozhikode)",
        "state": "Kerala",
        "investment": "₹1,00,000+ (Master District Distributor)",
        "categories": ["Arabians Talbina (All Flavors)", "Attar & Dehnul Oud (Fragrance)", "Bakhoor & Electric Burners"],
        "notes": "Looking for exclusive Malabar district wholesale rights. Immediate warehouse capacity available.",
        "status": "In Discussion"
    }
]

store["orders"] = demo_orders
store["distributors"] = demo_distributors
store["settings"]["phone"] = "98765 43210"

with open(store_path, "w", encoding="utf-8") as f:
    json.dump(store, f, indent=2)

print("Synchronized demo orders and distributor leads into store.json successfully!")
