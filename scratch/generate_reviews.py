import json
import random
import os

# Indian Cities & States
locations = [
    "Banjara Hills, Hyderabad", "Charminar, Hyderabad", "Tolichowki, Hyderabad", "Secunderabad, Telangana",
    "Gomti Nagar, Lucknow", "Aminabad, Lucknow", "Hazratganj, Lucknow", "Indira Nagar, Lucknow",
    "Chandni Chowk, Old Delhi", "Jamia Nagar, New Delhi", "Okhla, New Delhi", "Zakir Nagar, New Delhi",
    "Frazer Town, Bengaluru", "Shivajinagar, Bengaluru", "BTM Layout, Bengaluru",
    "Mohammed Ali Road, Mumbai", "Bandra West, Mumbai", "Kurla, Mumbai", "Andheri West, Mumbai",
    "Lal Chowk, Srinagar", "Rajbagh, Srinagar", "Downtown, Srinagar",
    "Park Circus, Kolkata", "Khidirpur, Kolkata", "Ripon Street, Kolkata",
    "Shajahanabad, Bhopal", "Arera Colony, Bhopal", "Koh-e-Fiza, Bhopal",
    "Johari Bazar, Jaipur", "MI Road, Jaipur", "Mansarovar, Jaipur",
    "Navrangpura, Ahmedabad", "Relief Road, Ahmedabad", "Paldi, Ahmedabad",
    "Kozhikode Beach, Calicut", "Mananchira, Calicut", "Kondotty, Malappuram",
    "Civil Lines, Aligarh", "Dodpur, Aligarh", "Medical Road, Aligarh",
    "Frazer Road, Patna", "Sabzibagh, Patna", "Phulwari Sharif, Patna",
    "Civil Lines, Bareilly", "Cantt, Bareilly", "Qutubkhana, Bareilly",
    "George Town, Chennai", "Triplicane, Chennai", "Anna Nagar, Chennai",
    "Camp, Pune", "Kondhwa, Pune", "Kalyani Nagar, Pune",
    "Rander, Surat", "Chowk Bazar, Surat", "Ring Road, Surat",
    "Civil Lines, Kanpur", "Jajmau, Kanpur", "Parade, Kanpur"
]

# Random Men & Women Names
men_names = [
    "Mohammed Salman", "Farhan Akhtar", "Zubair Ahmed Qureshi", "Dr. Rizwan Ul Haq",
    "Imran Sheikh", "Suhail Baig", "Tariq Khan", "Bilal Farooqui", "Faisal Patel",
    "Adil Mansoori", "Danish Anwar", "Owais Qureshi", "Shahnawaz Hussain", "Arshad Warsi",
    "Tanveer Alam", "Amanullah Khan", "Rashid Siddiqui", "Wasim Akram", "Junaid Merchant",
    "Hamza Abbasi", "Nadeem Ashraf", "Rehan Chisti", "Shoaib Malik", "Ziaur Rahman",
    "Mustafa Ali", "Irfan Pathan", "Sameer Qazi", "Waqas Mirza", "Asif Ansari",
    "Nasiruddin Shah", "Kashif Jamal", "Babar Azam", "Sajid Nadiadwala", "Mohsin Raza",
    "Usman Gani", "Saqib Saleem", "Shahid Afridi", "Haroon Rasheed", "Muzaffar Ali"
]

women_names = [
    "Ayesha Siddiqua", "Fatima Zehra", "Shabana Parveen", "Samreen Bano", "Zainab Begum",
    "Bushra Naaz", "Rukhsar Fatima", "Nuzhat Jahan", "Heena Kausar", "Sana Mir",
    "Mariam Khan", "Farzana Tabassum", "Yasmeen Bano", "Dr. Sabiha Khatoon", "Tahira Bano",
    "Nazia Parveen", "Afshan Anjum", "Sumaiya Hashmi", "Zareen Sultana", "Shaheen Akhtar",
    "Salma Ansari", "Asma Khatun", "Mehvish Hayat", "Ghazala Parveen", "Razia Sultana",
    "Parveen Bano", "Lubna Shireen", "Zubaida Tariq", "Nilofer Khan", "Farida Jalal",
    "Humaira Bano", "Shazia Ilmi", "Gulshan Ara", "Nafeesa Begum", "Rizwana Kausar"
]

# Products catalog mapping
products = [
    {
        "id": "talbina-vanilla",
        "name": "Arabian's Talbeena Vanilla Dry Fruits (500g)",
        "category": "health"
    },
    {
        "id": "talbina-milk-mawa",
        "name": "Arabian's Talbeena Milk Mawa Flavour",
        "category": "health"
    },
    {
        "id": "talbina-kids-chocolate",
        "name": "Arabian's Talbeena Kids Chocolate (1+ Yrs)",
        "category": "health"
    },
    {
        "id": "talbina-baby-barley",
        "name": "Arabian's Talbeena Baby Barley Cereal",
        "category": "health"
    },
    {
        "id": "talbina-dry-dates",
        "name": "Arabian's Talbeena With Dry Dates (Khajoor)",
        "category": "health"
    },
    {
        "id": "thobe-saudi-white",
        "name": "Al-Noor Minimalist Saudi Cut Pure White Thobe",
        "category": "wearing"
    },
    {
        "id": "thobe-signature-embroidered",
        "name": "Al-Noor Signature Embroidered Designer Thobe",
        "category": "wearing"
    },
    {
        "id": "thobe-burberry-luxury",
        "name": "Arabian Burberry Pattern Collar Luxury Thobe",
        "category": "wearing"
    },
    {
        "id": "oud-aged-cambodian",
        "name": "Aged Royal Dehnul Oud (Cambodian Reserve)",
        "category": "fragrance"
    },
    {
        "id": "attar-imperial-white-oudh",
        "name": "Imperial White Oudh Non-Alcoholic Attar (12ml)",
        "category": "fragrance"
    },
    {
        "id": "bakhoor-electric-brass-mabkhara",
        "name": "Arabian Royal Bakhoor & Electric Brass Mabkhara Set",
        "category": "fragrance"
    },
    {
        "id": "nikah-nama-velvet-gold",
        "name": "Luxury Velvet Gold-Foil Nikah Nama Booklet",
        "category": "gifts"
    },
    {
        "id": "acrylic-ayatul-kursi-tugra",
        "name": "3D Royal Gold Acrylic Ayat-ul-Kursi Tugra",
        "category": "gifts"
    },
    {
        "id": "sidr-honey-dry-fruits",
        "name": "Arabians Royal Sidr Honey Mix with Dry Fruits",
        "category": "health"
    }
]

# Hinglish Review Templates by Category (~60% total)
hinglish_reviews = {
    "health": [
        "Talbina ka taste bohot lajawab aur natural hai. Subah warm milk ke sath lene par pet halka rehta hai aur din bhar bilkul thakan nahi hoti.",
        "MashaAllah packaging bohot premium hai. Mere walid sahab ke digestion ke liye doctor ne barley recommend kiya tha, ye Talbina best nikli.",
        "Dry fruits ki quantity bohot achhi hai isme. Fake sweetness bilkul nahi hai, asli Sunnah standard ka zaiqa hai. Highly recommend!",
        "Order karne ke agle din hi BlueDart se parcel receive ho gaya. Bachho ko chocolate flavour bohot pasand aaya, breakfast sorted hai.",
        "Mujhe acidity aur weakness ki problem thi. 2 hafte se roz subah le raha hoon, bohot faida mehsoos hua Alhamdulillah.",
        "Milk Mawa flavour sach me bohot delicious hai! Desi ghee aur mawa ki khushbu aati hai, kheer jaisa taste hai bina unhealthy sugar ke.",
        "Baby barley cereal mere 2 saal ke bete ke liye lia tha. Digest bohot jaldi ho jata hai aur digestion bilkul theek rehta hai.",
        "Pure Sunnah diet! Ingredients list check ki thi, koi artificial chemicals ya preservatives nahi hain. JazakAllah khair.",
        "Hyderabad me itni jaldi same-day dispatch ho gayi order slip ke sath. Box airtight hai aur dry dates ka taste super fresh hai.",
        "Winter me warm milk me mila kar pine se energy boost milta hai. Family me sabhi ko bohot pasand aaya, dusra pack order kar diya hai."
    ],
    "wearing": [
        "Saudi cut pure white thobe ka fabric bohot lajawab hai. 5'10 height par size 56 mangwaya tha, fitting boutique jaisi custom aayi.",
        "Collar ki stitching aur concealed snap buttons bohot neat hain. Jummah prayer me doston ne poocha kahan se khareeda.",
        "Garmi ke mausam ke liye best fabric hai, bilkul breathable aur lightweight hai. Press karne par crisp look aata hai.",
        "Burberry collar pattern thobe bohot classy lagta hai. Subtle gold embroidery aur pocket finishing top notch hai.",
        "Pure luxury feel deta hai ye designer thobe. Nikah function me pehna tha, sabhi rishtedaron ne tareef ki. 5 stars!",
        "Stitching ki quality aisi hai jaise Dubai ya Saudi ke branded showroom se lia ho. Button holes aur hemline perfect hain.",
        "Pehle online thobe mangwane me darr lagta tha size ka, par inka size chart ekdum accurate nikla. Ekdum accurate fit hai.",
        "Fabric na shrink hota hai na transparent hai, bilkul decent aur Sunnah compliant cut hai. Worth every rupee."
    ],
    "fragrance": [
        "Aged Cambodian Dehnul Oud ka projection aur longevity zabardast hai. Kurte par lagane ke 48 ghante baad bhi khushbu mehsoos hoti hai.",
        "Shuru me deep woody note aati hai aur dry down me sweet honeyed amber feel hoti hai. Pure non-alcoholic attar hai.",
        "White Oudh attar daily office aur masjid ke liye best hai. Bheed me bhi log poochte hain kaunsa attar lagaya hai.",
        "Electric brass mabkhara bohot royal look deta hai living room me. Bakhoor chips jalte hain toh poore ghar me shahi khushbu phel jati hai.",
        "Market ke chemical wale synthetic attars se 100 guna behtar hai. Na sar me dard hota hai na irritation hoti hai, natural feeling.",
        "Crystal bottle presentation bohot shahi hai, gift dene ke liye bhi best choice hai. Packing bohot safe thi bubble wrap ke sath.",
        "Dehnul oud ki thodi si boond hi kafi hai, ek tola lambe time chalega. Mashallah aisi quality India me milna mushkil hai."
    ],
    "gifts": [
        "Velvet gold-foil Nikah Nama booklet dekh kar dil khush ho gaya! Mere bhai ke Nikah ke liye lia tha, signing ke waqt photo bohot royal aayi.",
        "Ayat-ul-Kursi 3D gold acrylic wall piece drawing room ki shaan ban gaya hai. Finishing aur mirror reflection top notch hai.",
        "Gift hamper packaging bohot shandar thi. Custom note bhi lagakar bheja unhone. Customer support WhatsApp par bohot cooperative hai.",
        "Nikah nama ka velvet cover aur gold embossed Arabic calligraphy bohot authentic aur shahi hai. Lifelong keepsake ban gaya."
    ]
}

# English Review Templates (~25% total)
english_reviews = {
    "health": [
        "Exceptional quality Talbina. Soothing on the stomach, very wholesome ingredients and fast delivery across India. 10/10.",
        "Authentic Sunnah preparation at its finest. My morning energy levels have significantly improved after replacing processed cereals with this.",
        "The Vanilla Dry Fruits blend is perfectly balanced—not overly sweet, packed with crunchy almonds and dates. My whole family loves it.",
        "Prompt doorstep delivery via BlueDart in pristine condition. Highly recommended for senior citizens needing easily digestible nutrition.",
        "I have tested multiple brands across Delhi, but Arabians Talbeena has the best texture and pure barley aroma. JazakAllah!"
    ],
    "wearing": [
        "Impeccable craftsmanship! The Saudi standing collar holds its shape crisply and the fabric feels ultra-luxurious.",
        "Ordered size 54 for Eid. The fit, shoulder drop, and hem length are flawless. Truly boutique quality at an honest price.",
        "Very elegant Saudi thobe with concealed buttons. Lightweight and breathable for warm climates. Will definitely purchase again.",
        "The Burberry pattern accent on the collar adds a subtle modern touch without compromising traditional Sunnah modesty."
    ],
    "fragrance": [
        "Magnificent Cambodian Dehnul Oud. Deep, woody, balsamic notes with outstanding longevity exceeding 36 hours on fabric.",
        "Pure non-alcoholic perfection. Doesn't cause headaches or olfactory fatigue. This is genuine artisanal aged oud oil.",
        "The Electric Mabkhara is both functional and a gorgeous decorative centerpiece. Bakhoor fragrance spreads within minutes.",
        "Imperial White Oudh has a clean, heavenly aura. Extremely versatile for both formal gatherings and daily prayers."
    ],
    "gifts": [
        "The velvet gold-foil Nikah Nama exceeded all expectations. Beautiful keepsake for our special day with premium calligraphy.",
        "The 3D acrylic Ayat-ul-Kursi wall decor arrived safely in heavy wooden crate packing. Superb gold mirror finish."
    ]
}

# Hindi (Devanagari script) Review Templates (~10% total)
hindi_reviews = {
    "health": [
        "तल्बीना की शुद्धता और स्वाद बहुत ही लाजवाब है। सुबह नाश्ते में दूध के साथ लेने से शरीर में दिनभर चुस्ती और ताज़गी बनी रहती है।",
        "पैकिंग बहुत सुरक्षित और एयरटाइट मिली। बादाम और खजूर की मात्रा काफी अच्छी है। पाचन के लिए यह बेहतरीन प्राकृतिक आहार है।",
        "मेरे वालिद साहब को गैस और कमजोरी की दिक्कत थी, यह तल्बीना लेने के बाद से उन्हें काफी राहत मिली है। बहुत धन्यवाद।",
        "बच्चों को चॉकलेट फ्लेवर वाला तल्बीना बहुत पसंद आया। बिना किसी हानिकारक केमिकल के इतना अच्छा स्वाद मिलना मुश्किल है।",
        "ऑर्डर करने के दो दिन के अंदर दिल्ली में पार्सल डिलीवर हो गया। सुन्नत तरीके से बना यह प्रोडक्ट वाकई भरोसेमंद है।"
    ],
    "wearing": [
        "सऊदी कट थोब का कपड़ा बहुत ही उम्दा और आरामदायक है। सिलाई और कॉलर की फिनिशिंग एकदम दर्जी जैसी परफेक्ट आई है।",
        "गर्मी के मौसम में पहनने के लिए यह बहुत ही हल्का और हवादार कपड़ा है। जुमे की नमाज़ के लिए यह बेहतरीन पहनावा है।",
        "साइज चार्ट एकदम सही है। 5'9 हाइट पर साइज 54 बिल्कुल नाप का आया। कपड़ा धोने के बाद भी सिकुड़ता नहीं है।"
    ],
    "fragrance": [
        "देहनुल ऊद की खुशबू बहुत ही शाही और लंबे समय तक टिकने वाली है। कुर्ते पर दो दिन तक इसकी मनमोहक महक रहती है।",
        "इंपीरियल व्हाइट ऊद अत्तार बहुत ही सौम्य और सुकून देने वाला है। बिना अल्कोहल के इतना बेहतरीन अत्तार पहली बार मिला।",
        "इलेक्ट्रिक मबखरा और बखूर का सेट बहुत ही खूबसूरत है। घर में जलाते ही पूरे माहौल में खुशबू और सुकून फैल जाता है।"
    ],
    "gifts": [
        "मखमली गोल्ड-फ़ॉइल निकाह नामा बहुत ही खूबसूरत और यादगार लगा। इसकी अरबी लिखावट बहुत ही मनमोहक है।",
        "आयतल कुर्सी का 3D गोल्ड ऐक्रेलिक डेकोर ड्राइंग रूम में बहुत ही शानदार दिखता है। पैकिंग भी बहुत मजबूत थी।"
    ]
}

# Urdu (Nastaliq/Arabic script) Review Templates (~5% total)
urdu_reviews = {
    "health": [
        "ماشاءاللہ! تلبینہ کا معیار اور ذائقہ بے حد لذیذ اور خالص ہے۔ صبح ناشتے میں استعمال سے طبیعت میں ہلکا پن اور توانائی رہتی ہے۔",
        "سنت نبوی ﷺ کے مطابق تیار کردہ یہ تلبینہ کمزوری اور معدے کے امراض کے لیے بہترین ثابت ہوا۔ جزاک اللہ خیر۔",
        "حیدرآباد سے بلُو ڈارٹ کے ذریعے بروقت پارسل موصول ہوا۔ بادام اور کھجور کی آمیزش بہت عمدہ ہے۔"
    ],
    "wearing": [
        "سعودی کٹ ثوب کا کپڑا اور سلائی انتہائی نفاست سے کی گئی ہے۔ کالر اور کف کی بناوٹ بالکل شاہی لگتی ہے۔",
        "جمعہ کی نماز اور عید کے لیے بہترین ثوب ہے۔ کپڑا بالکل ہلکا پھلکا اور پسینہ جذب کرنے والا ہے۔"
    ],
    "fragrance": [
        "دہن العود کمبوڈیئن کی خوشبو بہت پروقار اور دیرپا ہے۔ کپڑوں پر دو دن تک اس کی خوشبو برقرار رہتی ہے۔",
        "خالص غیر الکحولی عطر ہے جو نماز اور ذکر کی محافل کے لیے نہایت موزوں ہے۔ بوتل کی پیشکش بھی بہت شاندار ہے۔"
    ],
    "gifts": [
        "مخملی گولڈ فوائل نکاح نامہ کتابچہ بے حد خوبصورت اور نفیس ہے۔ نکاح کے موقع پر سب نے بہت پسند کیا۔"
    ]
}

# Generate 328 Realistic Reviews
random.seed(42) # repeatable realism

all_reviews = []
order_counter = 1100

# Let's create target distribution:
# Total 328 reviews:
# Hinglish: ~195 reviews (60%)
# English: ~82 reviews (25%)
# Hindi: ~33 reviews (10%)
# Urdu: ~18 reviews (5%)
# Total = 328!

langs = ['hinglish'] * 195 + ['english'] * 82 + ['hindi'] * 33 + ['urdu'] * 18
random.shuffle(langs)

# Days from recent back to ~6 months
dates = [
    "Today, 4 Sept 2026", "Yesterday, 3 Sept 2026", "2 Sept 2026", "31 Aug 2026",
    "28 Aug 2026", "25 Aug 2026", "21 Aug 2026", "18 Aug 2026", "15 Aug 2026",
    "12 Aug 2026", "08 Aug 2026", "04 Aug 2026", "30 Jul 2026", "25 Jul 2026",
    "20 Jul 2026", "15 Jul 2026", "10 Jul 2026", "04 Jul 2026", "28 Jun 2026",
    "22 Jun 2026", "15 Jun 2026", "08 Jun 2026", "01 Jun 2026", "25 May 2026",
    "18 May 2026", "12 May 2026", "05 May 2026", "28 Apr 2026", "20 Apr 2026",
    "15 Apr 2026", "08 Apr 2026", "01 Apr 2026", "24 Mar 2026", "17 Mar 2026"
]

def get_initials(name):
    parts = name.strip().split()
    if len(parts) >= 2:
        return f"{parts[0][0]}{parts[1][0]}".upper()
    return name[:2].upper()

for idx, lang in enumerate(langs):
    is_woman = random.random() < 0.48  # balanced men & women
    name = random.choice(women_names) if is_woman else random.choice(men_names)
    city = random.choice(locations)
    prod = random.choice(products)
    cat = prod["category"]

    # Select comment based on language & category
    if lang == 'hinglish':
        pool = hinglish_reviews.get(cat, hinglish_reviews["health"])
        comment = random.choice(pool)
    elif lang == 'english':
        pool = english_reviews.get(cat, english_reviews["health"])
        comment = random.choice(pool)
    elif lang == 'hindi':
        pool = hindi_reviews.get(cat, hindi_reviews["health"])
        comment = random.choice(pool)
    else: # urdu
        pool = urdu_reviews.get(cat, urdu_reviews["health"])
        comment = random.choice(pool)

    # Ratings: 89% 5 stars, 11% 4 stars (average ~4.89 / 4.9)
    rating = 5 if random.random() < 0.89 else 4
    date_str = dates[idx % len(dates)]
    order_num = f"ASZ-{order_counter + idx}"
    helpful_count = random.randint(3, 58)

    review_item = {
        "id": f"rev-{idx + 1}",
        "customerName": name,
        "avatar": get_initials(name),
        "avatarUrl": "",
        "location": city,
        "verified": True,
        "orderId": order_num,
        "rating": rating,
        "date": date_str,
        "category": cat,
        "productId": prod["id"],
        "productName": prod["name"],
        "comment": comment,
        "language": lang,
        "helpful": helpful_count
    }
    all_reviews.append(review_item)

# Retain the top user-tested review with custom DP if desired, or set first few as recent
all_reviews[0]["date"] = "Today, 4 Sept 2026"
all_reviews[1]["date"] = "Today, 4 Sept 2026"
all_reviews[2]["date"] = "Yesterday, 3 Sept 2026"

print(f"Generated {len(all_reviews)} reviews!")
print(f"Hinglish: {sum(1 for r in all_reviews if r['language'] == 'hinglish')}")
print(f"English: {sum(1 for r in all_reviews if r['language'] == 'english')}")
print(f"Hindi: {sum(1 for r in all_reviews if r['language'] == 'hindi')}")
print(f"Urdu: {sum(1 for r in all_reviews if r['language'] == 'urdu')}")

# Update store.json
store_path = r"c:\Users\moham\Downloads\arabians shopping zone\server\data\store.json"
with open(store_path, "r", encoding="utf-8") as f:
    store = json.load(f)

store["reviews"] = all_reviews

with open(store_path, "w", encoding="utf-8") as f:
    json.dump(store, f, indent=2, ensure_ascii=False)

print("Successfully updated server/data/store.json with 328 reviews!")
