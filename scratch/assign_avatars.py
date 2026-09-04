import json
import os

store_path = r"c:\Users\moham\Downloads\arabians shopping zone\server\data\store.json"

with open(store_path, "r", encoding="utf-8") as f:
    store = json.load(f)

reviews = store["reviews"]

# Find our 4 male reviews or update top reviews
# Let's organize top 4 male reviews
males_to_top = [
    {
        "id": "rev-male-1",
        "customerName": "Imran Sheikh",
        "avatar": "IS",
        "avatarUrl": "/assets/avatars/male_avatar_1.jpg",
        "location": "Banjara Hills, Hyderabad",
        "verified": True,
        "orderId": "ASZ-1420",
        "rating": 5,
        "date": "Today, 4 Sept 2026",
        "category": "wearing",
        "productId": "thobe-burberry-luxury",
        "productName": "Arabian Burberry Pattern Collar Luxury Thobe",
        "comment": "Burberry collar pattern thobe bohot classy lagta hai. Subtle gold embroidery aur pocket finishing top notch hai. Fitting ekdum bespoke tailor jaisi aayi.",
        "language": "hinglish",
        "helpful": 42
    },
    {
        "id": "rev-male-2",
        "customerName": "Faisal Patel",
        "avatar": "FP",
        "avatarUrl": "/assets/avatars/male_avatar_2.jpg",
        "location": "Park Circus, Kolkata",
        "verified": True,
        "orderId": "ASZ-1421",
        "rating": 5,
        "date": "Today, 4 Sept 2026",
        "category": "health",
        "productId": "talbina-milk-mawa",
        "productName": "Arabian's Talbeena Milk Mawa Flavour",
        "comment": "Milk Mawa flavour sach me bohot delicious hai! Desi ghee aur mawa ki khushbu aati hai, kheer jaisa taste hai bina unhealthy sugar ke.",
        "language": "hinglish",
        "helpful": 38
    },
    {
        "id": "rev-male-3",
        "customerName": "Mohammed Salman",
        "avatar": "MS",
        "avatarUrl": "/assets/avatars/male_avatar_3.jpg",
        "location": "Frazer Town, Bengaluru",
        "verified": True,
        "orderId": "ASZ-1422",
        "rating": 5,
        "date": "Yesterday, 3 Sept 2026",
        "category": "wearing",
        "productId": "thobe-signature-embroidered",
        "productName": "Al-Noor Signature Embroidered Designer Thobe",
        "comment": "Pure luxury feel deta hai ye designer thobe. Nikah function me pehna tha, sabhi rishtedaron ne tareef ki. Fabric bohot breathable aur premium hai. 5 stars!",
        "language": "hinglish",
        "helpful": 53
    },
    {
        "id": "rev-male-4",
        "customerName": "Zubair Ahmed Qureshi",
        "avatar": "ZQ",
        "avatarUrl": "/assets/avatars/male_avatar_4.jpg",
        "location": "Chandni Chowk, Old Delhi",
        "verified": True,
        "orderId": "ASZ-1423",
        "rating": 5,
        "date": "Yesterday, 3 Sept 2026",
        "category": "fragrance",
        "productId": "oud-aged-cambodian",
        "productName": "Aged Royal Dehnul Oud (Cambodian Reserve)",
        "comment": "Delhi me itne attar try kiye par ye Dehnul Oud bilkul authentic wild agarwood oil hai. Smoky woody note aati hai aur dry down me sweet honeyed aroma jo 48 ghante se zyada tika rehta hai.",
        "language": "hinglish",
        "helpful": 49
    }
]

# Next 4 female reviews ready for female photos in next step:
females_next = [
    {
        "id": "rev-female-1",
        "customerName": "Nafeesa Begum",
        "avatar": "NB",
        "avatarUrl": "",
        "location": "Rajbagh, Srinagar",
        "verified": True,
        "orderId": "ASZ-1424",
        "rating": 5,
        "date": "2 Sept 2026",
        "category": "health",
        "productId": "talbina-dry-dates",
        "productName": "Arabian's Talbeena With Dry Dates (Khajoor)",
        "comment": "Dry fruits aur dates ki quantity bohot achhi hai. Fake sweetness bilkul nahi hai, asli Sunnah standard ka zaiqa hai.",
        "language": "hinglish",
        "helpful": 35
    },
    {
        "id": "rev-female-2",
        "customerName": "Parveen Bano",
        "avatar": "PB",
        "avatarUrl": "",
        "location": "Aminabad, Lucknow",
        "verified": True,
        "orderId": "ASZ-1425",
        "rating": 5,
        "date": "31 Aug 2026",
        "category": "fragrance",
        "productId": "bakhoor-electric-brass-mabkhara",
        "productName": "Arabian Royal Bakhoor & Electric Brass Mabkhara Set",
        "comment": "Electric brass mabkhara bohot royal look deta hai living room me. Bakhoor chips jalte hain toh poore ghar me shahi khushbu phel jati hai.",
        "language": "hinglish",
        "helpful": 41
    },
    {
        "id": "rev-female-3",
        "customerName": "Rizwana Kausar",
        "avatar": "RK",
        "avatarUrl": "",
        "location": "Qutubkhana, Bareilly",
        "verified": True,
        "orderId": "ASZ-1426",
        "rating": 5,
        "date": "28 Aug 2026",
        "category": "health",
        "productId": "talbina-vanilla",
        "productName": "Arabian's Talbeena Vanilla Dry Fruits (500g)",
        "comment": "Mujhe acidity aur weakness ki problem thi. 2 hafte se roz subah le rahi hoon warm milk ke sath, bohot faida mehsoos hua Alhamdulillah.",
        "language": "hinglish",
        "helpful": 36
    },
    {
        "id": "rev-female-4",
        "customerName": "Heena Kausar",
        "avatar": "HK",
        "avatarUrl": "",
        "location": "Bandra West, Mumbai",
        "verified": True,
        "orderId": "ASZ-1427",
        "rating": 5,
        "date": "25 Aug 2026",
        "category": "health",
        "productId": "talbina-milk-mawa",
        "productName": "Arabian's Talbeena Milk Mawa Flavour",
        "comment": "Pure Sunnah diet! Ingredients list check ki thi, koi artificial chemicals ya preservatives nahi hain. JazakAllah khair.",
        "language": "hinglish",
        "helpful": 29
    }
]

# Filter out any old male/female matches to prevent duplication and preserve remaining 320 reviews
used_names = {r["customerName"] for r in males_to_top + females_next}
remaining_reviews = [r for r in reviews if r["customerName"] not in used_names]

# Combine: 4 males on top, 4 females next, then the rest
new_reviews = males_to_top + females_next + remaining_reviews
# Trim/pad to exact 328
if len(new_reviews) > 328:
    new_reviews = new_reviews[:328]

store["reviews"] = new_reviews

with open(store_path, "w", encoding="utf-8") as f:
    json.dump(store, f, indent=2, ensure_ascii=False)

print(f"Total reviews saved: {len(new_reviews)}")
print("Top 4 reviews now have male profile photos:")
for r in new_reviews[:4]:
    print(f"- {r['customerName']}: {r['avatarUrl']}")
