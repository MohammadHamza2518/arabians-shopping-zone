export const initialData = {
  settings: {
    storeName: "Arabians Shopping Zone",
    tagline: "Authentic Sunnah Foods, Royal Arabic Attire & Luxury Fragrances",
    phone: "+91 92360 28318",
    callNumber: "+91 92360 28318",
    whatsapp: "917233862626",
    whatsappDisplay: "+91 72338 62626",
    email: "arabiansshoppingzone@gmail.com",
    googleMapsUrl: "https://share.google/8L9V2vJ0LTXI3DQD8",
    instagramUrl: "https://www.instagram.com/arabians_shopping_zone",
    instagramHandle: "@arabians_shopping_zone",
    announcement: "🌙 Special Offer: Free Express Pan-India Delivery on orders above ₹999 | Use Code ARABIAN10 for 10% Off!",
    adminPin: "arabians786",
    currency: "₹"
  },
  categories: [
    {
      id: "health",
      name: "Health & Sunnah Foods",
      subtitle: "Nutritional Talbina, Pure Sidr Honey & Dry Fruit Superfoods",
      icon: "HeartPulse",
      badge: "Flagship Brand",
      image: "/assets/talbina/talbina_vanilla_dryfruits.png"
    },
    {
      id: "wearing",
      name: "Wearing & Royal Attire",
      subtitle: "Emirati & Saudi Thobes, Amama, Rumal, Bisht & Caps",
      icon: "Shirt",
      badge: "Royal Collection",
      image: "/assets/thobes/thobes__al_noor_design_p1_1.png"
    },
    {
      id: "fragrance",
      name: "Attar, Oud & Bakhoor",
      subtitle: "Pure Dehnul Oud, Non-Alcoholic Attars & Luxury Bakhoor",
      icon: "Sparkles",
      badge: "Pure Alcohol-Free",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "decor",
      name: "Islamic Home Decor",
      subtitle: "3D Acrylic Tugra, Resin Islamic Clocks & Sacred Art",
      icon: "Clock",
      badge: "Handcrafted Luxury",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "wedding",
      name: "Nikah & Wedding Collection",
      subtitle: "Luxury Nikah Nama Booklets, Pens, Dupatta & Haq Mehar Box",
      icon: "BookOpen",
      badge: "Sunnah Nikah",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
    }
  ],
  products: [
    // --- HEALTH PRODUCTS (TALBINA & HONEY) ---
    {
      id: "talbina-vanilla",
      name: "Arabian's Talbeena Nutritional Breakfast (Vanilla Dry Fruits)",
      category: "health",
      price: 349,
      mrp: 449,
      rating: 4.9,
      reviewsCount: 148,
      netWeight: "250 Gram",
      badge: "Bestseller",
      stock: 50,
      image: "/assets/talbina/talbina_vanilla_dryfruits.png",
      gallery: [
        "/assets/talbina/talbina_vanilla_dryfruits.png",
        "/assets/talbina/talbina_milk_mawa.png"
      ],
      description: "Original Arabian's Talbina crafted from whole sprouted barley (Jau), premium California almonds, green pistachios, cashews and natural vanilla. Prepared in just 5 minutes with warm milk or water.",
      benefits: [
        "Sunnah superfood recommended for soothing heart and grief",
        "High dietary fiber that heals digestion, acidity and gut health",
        "Natural stamina booster without artificial chemicals",
        "Ready in 5 minutes — perfect wholesome family breakfast"
      ],
      tags: ["Sunnah Food", "100% Veg", "Ready in 5 Min", "High Fiber"]
    },
    {
      id: "talbina-milk-mawa",
      name: "Arabian's Talbeena Nutritional Breakfast (Milk Mawa Flavour)",
      category: "health",
      price: 349,
      mrp: 449,
      rating: 4.8,
      reviewsCount: 96,
      netWeight: "250 Gram",
      badge: "Customer Favorite",
      stock: 45,
      image: "/assets/talbina/talbina_milk_mawa.png",
      gallery: [
        "/assets/talbina/talbina_milk_mawa.png",
        "/assets/talbina/talbina_vanilla_dryfruits.png"
      ],
      description: "Rich, creamy traditional Milk Mawa infused Talbina packed with crunchy dry fruits. Combines the heritage taste of authentic mawa dessert with the supreme nutritional healing of sunnah barley.",
      benefits: [
        "Rich in calcium and healthy fats for joint strength",
        "Delicious creamy taste loved by elders and youth alike",
        "Zero refined sugar; naturally sweetened with dried dates and nuts",
        "Instant energy replenishment after fasting or workout"
      ],
      tags: ["Milk Mawa", "Energy Booster", "Sunnah Recipe"]
    },
    {
      id: "talbina-chocolate",
      name: "Arabian's Talbeena For Kids (Chocolate Flavour - 1+ Years)",
      category: "health",
      price: 369,
      mrp: 499,
      rating: 4.9,
      reviewsCount: 112,
      netWeight: "250 Gram",
      badge: "Kids Special",
      stock: 40,
      image: "/assets/talbina/talbina_chocolate_kids.png",
      gallery: [
        "/assets/talbina/talbina_chocolate_kids.png"
      ],
      description: "Specially formulated for toddlers and growing children aged 1 year plus. Made with natural Dutch cocoa, stone-ground barley, micronutrients and pulverized dry fruits for sharp memory and immunity.",
      benefits: [
        "Yummy chocolate taste that kids drink without fuss",
        "Promotes brain development and bone density in growing children",
        "Free from preservatives, artificial colors or excess sucrose",
        "3 wholesome meals per pack"
      ],
      tags: ["Kids 1+ Years", "Brain Nutrition", "Chocolate"]
    },
    {
      id: "talbina-baby-barley",
      name: "Arabian's Talbeena Baby Cereal With Barley (3+ Years)",
      category: "health",
      price: 329,
      mrp: 429,
      rating: 4.8,
      reviewsCount: 84,
      netWeight: "200 Gram",
      badge: "Gentle Formula",
      stock: 35,
      image: "/assets/talbina/talbina_baby_barley.png",
      gallery: [
        "/assets/talbina/talbina_baby_barley.png"
      ],
      description: "Ultra-fine, gentle barley cereal designed for delicate stomachs. Fortified with essential vitamins, iron, and fiber to support digestion and steady growth.",
      benefits: [
        "Easy to swallow and gentle on little tummies",
        "Prevents constipation and indigestion naturally",
        "100% natural, lab-tested hygienic Sunnah cereal"
      ],
      tags: ["Baby Cereal", "3+ Years", "Easy Digestion"]
    },
    {
      id: "talbina-dry-dates",
      name: "Arabian's Talbeena With Dry Dates & Vanilla Flavour",
      category: "health",
      price: 379,
      mrp: 499,
      rating: 5.0,
      reviewsCount: 167,
      netWeight: "250 Gram",
      badge: "Royal Sidr Blend",
      stock: 60,
      image: "/assets/talbina/talbina_dry_dates_vanilla.png",
      gallery: [
        "/assets/talbina/talbina_dry_dates_vanilla.png"
      ],
      description: "The ultimate Sunnah pairing of Ajwa & Medjool dried dates with roasted barley and aromatic vanilla. Rich in iron, natural fructose, and antioxidants for peak vitality.",
      benefits: [
        "Infused with nutrient-dense dates for natural sweetness and hemoglobin",
        "Sustained energy release without sugar crash",
        "Supports cardiovascular and nervous system wellness"
      ],
      tags: ["Dry Dates", "Natural Iron", "Ajwa Blend"]
    },
    {
      id: "honey-mix-dryfruits",
      name: "Arabians Royal Sidr Honey Mix with Dry Fruits",
      category: "health",
      price: 699,
      mrp: 899,
      rating: 4.9,
      reviewsCount: 78,
      netWeight: "400 Gram",
      badge: "Immunity Powerhouse",
      stock: 30,
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80"
      ],
      description: "100% Raw unprocessed Sidr Honey dipped with roasted California almonds, Iranian pistachios, walnuts, figs, and pumpkin seeds. A royal morning vitality spoon.",
      benefits: [
        "Boosts testosterone, vigor, and daily energy",
        "Natural cold, cough, and throat immunity shield",
        "Pure Sunnah recipe with unheated raw honey"
      ],
      tags: ["Pure Honey", "Dry Fruits Mix", "Sunnah Health"]
    },

    // --- WEARING PRODUCTS (THOBES, JUBBA, AMAMA, BISHT) ---
    {
      id: "thobe-al-noor-signature",
      name: "Al-Noor Signature Embroidered Designer Thobe",
      category: "wearing",
      price: 1899,
      mrp: 2699,
      rating: 4.9,
      reviewsCount: 89,
      sizes: ["52 (S)", "54 (M)", "56 (L)", "58 (XL)", "60 (XXL)"],
      badge: "Exclusive Catalog",
      stock: 25,
      image: "/assets/thobes/thobes__al_noor_design_p1_1.png",
      gallery: [
        "/assets/thobes/thobes__al_noor_design_p1_1.png",
        "/assets/thobes/thobes__al_noor_design_p2_1.png",
        "/assets/thobes/thobes__al_noor_design_p3_1.png",
        "/assets/thobes/thobes__al_noor_design_p4_1.png"
      ],
      description: "Premium handcrafted Al-Noor designer thobe featuring intricate geometric thread embroidery on the collar, chest placket, and cuffs. Made from luxury wrinkle-resistant Korean poly-viscose blend with elegant drape.",
      benefits: [
        "Breathable all-weather fabric suitable for Indian summers and festive occasions",
        "Discreet side pockets and deep chest pocket for phone and miswak",
        "Premium snap-button concealed placket"
      ],
      tags: ["Al Noor", "Embroidered", "Wrinkle Free", "Jummah Special"]
    },
    {
      id: "thobe-burberry-collar",
      name: "Arabian Burberry Pattern Collar Luxury Thobe",
      category: "wearing",
      price: 1999,
      mrp: 2799,
      rating: 4.9,
      reviewsCount: 64,
      sizes: ["52 (S)", "54 (M)", "56 (L)", "58 (XL)", "60 (XXL)"],
      badge: "Trending Design",
      stock: 20,
      image: "/assets/thobes/thobes_burberry_design_p1_1.png",
      gallery: [
        "/assets/thobes/thobes_burberry_design_p1_1.png",
        "/assets/thobes/thobes_burberry_design_p2_1.png",
        "/assets/thobes/thobes_burberry_design_p3_1.png"
      ],
      description: "Sophisticated modern Arabian thobe tailored with designer checked Burberry-inspired accents along the inner collar stand, placket lining, and French cuff trim.",
      benefits: [
        "Designer contrast styling for modern gentlemen",
        "Structured formal collar that retains shape after repeated washing",
        "Silky soft finish with zero skin irritation"
      ],
      tags: ["Burberry Trim", "Modern Cut", "Premium Finish"]
    },
    {
      id: "thobe-al-noor-classic",
      name: "Al-Noor Minimalist Saudi Cut Pure White Thobe",
      category: "wearing",
      price: 1599,
      mrp: 2199,
      rating: 5.0,
      reviewsCount: 130,
      sizes: ["52 (S)", "54 (M)", "56 (L)", "58 (XL)", "60 (XXL)"],
      badge: "Evergreen Classic",
      stock: 40,
      image: "/assets/thobes/thobes_al_noor_2_p1_1.png",
      gallery: [
        "/assets/thobes/thobes_al_noor_2_p1_1.png",
        "/assets/thobes/thobes_al_noor_2_p2_1.png",
        "/assets/thobes/thobes_al_noor_2_p3_1.png"
      ],
      description: "Crisp, pristine Saudi style straight-cut white jubba with standing collar and dual hidden pockets. Engineered for Jummah prayers, Umrah, and everyday Islamic nobility.",
      benefits: [
        "Non-see-through high-density thread count fabric",
        "Stain-resistant easy-iron finish",
        "Authentic Riyadh tailoring proportions"
      ],
      tags: ["Saudi White", "Umrah Ready", "Pristine White"]
    },
    {
      id: "royal-gold-bisht",
      name: "Royal Arabian Bisht / Qubba (Gold Zari Border)",
      category: "wearing",
      price: 3499,
      mrp: 4999,
      rating: 4.9,
      reviewsCount: 42,
      sizes: ["Free Size (54-60)"],
      badge: "Royal Groom",
      stock: 15,
      image: "/assets/thobes/thobes__al_noor_design_p8_1.png",
      gallery: [
        "/assets/thobes/thobes__al_noor_design_p8_1.png"
      ],
      description: "Traditional Arab ceremonial cloak worn over the thobe for weddings, Eid, and high honors. Hand-trimmed with heavy real metallic gold thread (Zari) along the collar and front lapels.",
      benefits: [
        "Gives an instant majestic Sheikh look for grooms and dignitaries",
        "Includes authentic matching gold braided tasselled cord",
        "Lightweight sheer luxury wool-blend drape"
      ],
      tags: ["Royal Bisht", "Groom Wear", "Gold Zari"]
    },
    {
      id: "authentic-amama-rumal",
      name: "Traditional Kashmiri Amama Shareef & Red Shemagh Rumal Set",
      category: "wearing",
      price: 799,
      mrp: 1199,
      rating: 4.8,
      reviewsCount: 55,
      badge: "Sunnah Sunnah",
      stock: 30,
      image: "/assets/thobes/thobes_al_noor_2_p5_1.png",
      gallery: [
        "/assets/thobes/thobes_al_noor_2_p5_1.png"
      ],
      description: "Complete Sunnah headwear combo: 1x Pure Cotton 7-meter Amama Shareef turban cloth and 1x Premium Red & White Arabian Yashmagh (Keffiyeh) with heavy braided Agal head ring.",
      benefits: [
        "Ultra-soft breathable fine cotton cloth",
        "Keeps head cool and protected from sun and dust",
        "Authentic Madina and Hijazi style wrapping length"
      ],
      tags: ["Amama Shareef", "Shemagh Rumal", "Agal"]
    },

    // --- FRAGRANCE (ATTAR, OUD, BAKHOOR) ---
    {
      id: "dehnul-oud-pure",
      name: "Aged Royal Dehnul Oud (Cambodian Reserve - 6ml)",
      category: "fragrance",
      price: 2499,
      mrp: 3499,
      rating: 5.0,
      reviewsCount: 88,
      netWeight: "6 ml Bottle",
      badge: "100% Pure Oil",
      stock: 20,
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"
      ],
      description: "Distilled from aged wild agarwood trees from the Koh Kong forests of Cambodia. A deep, smoky, woody, and resinous aroma with balsamic sweet dry-down that lingers on clothes for days.",
      benefits: [
        "Zero alcohol, 100% pure steam-distilled agarwood oil",
        "24-48 hours extreme longevity with majestic projection",
        "Presented in crystal bottle inside an antique velvet gift box"
      ],
      tags: ["Pure Dehnul Oud", "Cambodian", "Alcohol Free"]
    },
    {
      id: "white-oudh-attar",
      name: "Imperial White Oudh Non-Alcoholic Attar (12ml)",
      category: "fragrance",
      price: 649,
      mrp: 899,
      rating: 4.8,
      reviewsCount: 176,
      netWeight: "12 ml",
      badge: "Top Rated",
      stock: 50,
      image: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=600&q=80"
      ],
      description: "Crisp, airy, and aristocratic blend of white musk, tender agarwood, ambergris, and Taif rose. Clean and refreshing for daily prayers and professional meetings.",
      benefits: [
        "Non-alcoholic Halal roll-on perfume oil",
        "Gentle on sensitive skin with no synthetic burning",
        "Signature scent loved across all age groups"
      ],
      tags: ["White Oudh", "Roll On", "12ml", "Long Lasting"]
    },
    {
      id: "arabian-bakhoor-burner-combo",
      name: "Arabian Royal Bakhoor Oud Chips & Electric Brass Mabkhara Set",
      category: "fragrance",
      price: 1299,
      mrp: 1799,
      rating: 4.9,
      reviewsCount: 94,
      badge: "Home Blessing",
      stock: 25,
      image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80"
      ],
      description: "Transform your home into an Arabian palace. Includes 100g of slow-burning fragrant Oud Muattar chips infused with musk and rose water, accompanied by a heavy brass electric smokeless burner.",
      benefits: [
        "Purifies home air and eliminates stubborn odors",
        "Electric burner operates safely without charcoal or open flame",
        "Creates calm serene atmosphere for Quran recitation and meditation"
      ],
      tags: ["Bakhoor", "Mabkhara", "Electric Burner", "Oud Muattar"]
    },

    // --- HOME DECOR ---
    {
      id: "acrylic-ayatul-kursi-tugra",
      name: "3D Royal Gold Acrylic Ayat-ul-Kursi Tugra Wall Art",
      category: "decor",
      price: 2199,
      mrp: 3299,
      rating: 5.0,
      reviewsCount: 114,
      badge: "Handcrafted 3D",
      stock: 18,
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80"
      ],
      description: "Exquisite 3D mirror-finish gold acrylic Arabic calligraphy plaque featuring Ayat-ul-Kursi in Ottoman Tugra royal crest style. High-grade shatterproof acrylic on matte black backplate.",
      benefits: [
        "Brings divine blessings and royal elegance to living room or office",
        "Ready to hang with heavy-duty pre-installed brass brackets",
        "Scratch-resistant mirror gold that never fades or tarnishes"
      ],
      tags: ["Ayat-ul-Kursi", "3D Gold Acrylic", "Islamic Wall Art"]
    },
    {
      id: "resin-islamic-wall-clock",
      name: "Emerald Green Geode & Gold Resin Islamic Wall Clock",
      category: "decor",
      price: 2799,
      mrp: 3999,
      rating: 4.9,
      reviewsCount: 63,
      badge: "Masterpiece",
      stock: 12,
      image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80"
      ],
      description: "Hand-poured resin geode clock crafted with real crushed crystals, deep emerald pigments, 24K gold leaf veins, and 3D Arabic numerical markers with silent sweep quartz movement.",
      benefits: [
        "100% silent quartz movement (no ticking sound)",
        "Every single clock is unique hand-made artisanal art",
        "16-inch diameter statement centerpiece"
      ],
      tags: ["Resin Clock", "Emerald & Gold", "Silent Quartz"]
    },

    // --- WEDDING PRODUCTS ---
    {
      id: "nikah-nama-booklet-luxury",
      name: "Luxury Velvet Gold-Foil Nikah Nama Certificate Booklet",
      category: "wedding",
      price: 1499,
      mrp: 2299,
      rating: 5.0,
      reviewsCount: 152,
      badge: "Wedding Bestseller",
      stock: 35,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
      ],
      description: "Make your sacred Nikah memorable for eternity. Handbound in deep emerald green velvet with hot-stamped gold foil calligraphy, custom groom/bride name embossing, and parchment archival certificate paper.",
      benefits: [
        "Lifetime keepsake preserving your sacred Sunnah contract",
        "Includes Nikah signature page, Quranic marital verses, and witness slots",
        "Comes with magnetic closure gift presentation box"
      ],
      tags: ["Nikah Nama", "Velvet Gold", "Marriage Certificate", "Bridal Keepsake"]
    },
    {
      id: "nikah-luxury-pen-mirror-set",
      name: "Royal Ostrich Feather Nikah Signing Pen & Mirror Set",
      category: "wedding",
      price: 899,
      mrp: 1299,
      rating: 4.9,
      reviewsCount: 73,
      badge: "Bridal Essential",
      stock: 28,
      image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80"
      ],
      description: "Exquisite fluffy white ostrich feather pen decorated with crystals and gold beads, paired with a matching gold filigree hand mirror for the bridal Qubool Hai moment.",
      benefits: [
        "High-definition crystal ink cartridge ensures zero smudges on contract",
        "Photogenic prop for unforgettable wedding photography",
        "Presented in cushioned keepsake box"
      ],
      tags: ["Nikah Pen", "Feather Pen", "Dulhan Aina", "Qubool Hai"]
    },
    {
      id: "qubool-hai-bridal-dupatta",
      name: "Handcrafted 'Qubool Hai' Velvet Border Bridal Dupatta",
      category: "wedding",
      price: 1999,
      mrp: 2999,
      rating: 4.9,
      reviewsCount: 91,
      badge: "Trending Bridal",
      stock: 20,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
      ],
      description: "Rich crimson red sheer net dupatta featuring deep marron velvet border embroidered with metallic Zardozi script: 'Qubool Hai - Nikah Mubarak' along with scalloped Kiran lace.",
      benefits: [
        "Heavy bridal fall without overwhelming the bride's posture",
        "2.5-meter royal length with four-sided heavy work",
        "Treasured emotional heirloom for Nikah photographs"
      ],
      tags: ["Qubool Hai", "Bridal Dupatta", "Zardozi Work"]
    }
  ],
  reviews: [
    {
      id: "rev-1",
      customerName: "Mohammed Salman",
      avatar: "MS",
      location: "Banjara Hills, Hyderabad",
      verified: true,
      orderId: "ASZ-1089",
      rating: 5,
      date: "28 Aug 2026",
      category: "health",
      productId: "talbina-vanilla",
      productName: "Arabian's Talbeena Vanilla Dry Fruits (500g)",
      comment: "Hyderabad me order karne ke 24 ghante ke andar parcel BlueDart se deliver ho gaya! Vanilla Dry Fruits ka taste bohot shandaar aur mild hai, subah warm milk ke sath lia. Na acidity hoti hai na weakness. Poori family ka favorite breakfast ban gaya hai.",
      helpful: 48
    },
    {
      id: "rev-2",
      customerName: "Farhan Akhtar",
      avatar: "FA",
      location: "Frazer Town, Bengaluru",
      verified: true,
      orderId: "ASZ-1042",
      rating: 5,
      date: "25 Aug 2026",
      category: "wearing",
      productId: "thobe-al-noor-signature",
      productName: "Al-Noor Minimalist Saudi Cut Pure White Thobe",
      comment: "Fabric quality outstanding hai! Pure Saudi standing collar aur concealed snap buttons hain. 5'10 height par size 56 mangwaya tha, fitting ekdum tailored aayi jaise custom boutique se silwaya ho. Jummah prayer me sab doston ne pucha kahan se liya.",
      helpful: 36
    },
    {
      id: "rev-3",
      customerName: "Zubair Ahmed Qureshi",
      avatar: "ZQ",
      location: "Chandni Chowk, Old Delhi",
      verified: true,
      orderId: "ASZ-1077",
      rating: 5,
      date: "21 Aug 2026",
      category: "fragrance",
      productId: "dehnul-oud-pure",
      productName: "Aged Royal Dehnul Oud (Cambodian Reserve)",
      comment: "Delhi me itne attar try kiye par ye Dehnul Oud bilkul authentic wild agarwood oil hai. Pehle smoky woody note aati hai phir dry down me sweet honeyed aroma jo kurte par 48 hours se zyada tika rehta hai. Crystal bottle presentation royal hai.",
      helpful: 29
    },
    {
      id: "rev-4",
      customerName: "Ayesha & Tariq Khan",
      avatar: "AK",
      location: "Byculla, Mumbai",
      verified: true,
      orderId: "ASZ-1095",
      rating: 5,
      date: "18 Aug 2026",
      category: "wedding",
      productId: "nikah-nama-booklet-luxury",
      productName: "Luxury Velvet Gold-Foil Nikah Nama Booklet",
      comment: "Humne apne Nikah ceremony ke liye emerald green booklet aur feather quill pen mangwayi thi. 3 din me Mumbai safe bubble-padded packing me aayi. Real gold foil embossing shine karti hai. Sabhi elders aur guests ne bohot pasand kiya!",
      helpful: 41
    },
    {
      id: "rev-5",
      customerName: "Dr. Rizwan Ul Haq",
      avatar: "RH",
      location: "Hazratganj, Lucknow",
      verified: true,
      orderId: "ASZ-1014",
      rating: 5,
      date: "14 Aug 2026",
      category: "health",
      productId: "talbina-milk-mawa",
      productName: "Arabian's Talbeena Milk Mawa Flavour",
      comment: "As a doctor, maine pehle nutrition and ingredients verify kiye: stone-ground roasted barley, California almonds and authentic mawa flavor without artificial chemicals. Sugar-conscious aur elderly patients ke liye naturally soothing hai. Exceptional quality!",
      helpful: 58
    },
    {
      id: "rev-6",
      customerName: "Imran Sheikh",
      avatar: "IS",
      location: "Civil Lines, Nagpur",
      verified: true,
      orderId: "ASZ-1033",
      rating: 5,
      date: "11 Aug 2026",
      category: "fragrance",
      productId: "arabian-bakhoor-burner-combo",
      productName: "Arabian Royal Bakhoor & Electric Brass Mabkhara Set",
      comment: "Brass burner heavy metal build ka hai aur electric switch se bina koyla jalaye 2 minute me smoke start ho jaati hai. Maghrib ke baad bakhoor jalate hain to pure ghar me 4 ghante tak Madinah Sharif jaisi pur-sukoon khushbu rehti hai.",
      helpful: 22
    },
    {
      id: "rev-7",
      customerName: "Shabana Parveen",
      avatar: "SP",
      location: "Park Circus, Kolkata",
      verified: true,
      orderId: "ASZ-1061",
      rating: 5,
      date: "07 Aug 2026",
      category: "health",
      productId: "talbina-chocolate",
      productName: "Arabian's Talbeena Kids Chocolate (1+ Yrs)",
      comment: "Mera beta doodh peene me bohot tang karta tha. Chocolate Talbina dry fruits powder ke sath hai, taste use itna pasand aaya ki roz shaam khud mangta hai. Market ke chemical health powders se hazar guna behtar aur Sunnah barakah hai.",
      helpful: 34
    },
    {
      id: "rev-8",
      customerName: "Suhail Baig",
      avatar: "SB",
      location: "Navrangpura, Ahmedabad",
      verified: true,
      orderId: "ASZ-1028",
      rating: 5,
      date: "02 Aug 2026",
      category: "decor",
      productId: "acrylic-ayatul-kursi-tugra",
      productName: "3D Royal Gold Acrylic Ayat-ul-Kursi Tugra",
      comment: "Wall art ka 3D acrylic mirror reflection bilkul crystal-clear hai. Wooden protective board and bubble pack me aayi, ek bhi corner damage nahi tha. Drawing room wall par lagte hi pure royal aesthetic look aa gaya. Truly satisfied!",
      helpful: 19
    }
  ],
  reels: [
    {
      id: "reel-1",
      title: "Viral Amama Sharif Tying Tutorial 👑",
      views: "20M",
      likes: "180.7K",
      videoUrl: "/assets/reels/real_amama_tutorial.mp4",
      thumbnail: "/assets/reels/real_amama_tutorial.jpg",
      instagramUrl: "https://www.instagram.com/reel/DVVt2k7ERwZ/",
      category: "wearing",
      categoryName: "Attire & Caps",
      productId: "amama-shareef-madani",
      productName: "Traditional Green Amama Shareef (7 Meters)",
      productPrice: "₹599"
    },
    {
      id: "reel-2",
      title: "Special Designer Cap for 12 Rabi-ul-Awal 👑✨",
      views: "2.8M",
      likes: "142.5K",
      videoUrl: "/assets/reels/real_viral_28m.mp4",
      thumbnail: "/assets/reels/real_viral_28m.jpg",
      instagramUrl: "https://www.instagram.com/reel/DNvW2rM0kQV/",
      category: "wearing",
      categoryName: "Caps & Attire",
      productId: "islamic-cap-collection",
      productName: "Handcrafted Turkish Velvet & Omani Cap Set",
      productPrice: "₹449"
    },
    {
      id: "reel-3",
      title: "BIG QURAAN SET 16 inch 😍 | GIFT & WEDDING ❤️",
      views: "1.1M",
      likes: "92.4K",
      videoUrl: "/assets/reels/real_quran_set.mp4",
      thumbnail: "/assets/reels/real_quran_set.jpg",
      instagramUrl: "https://www.instagram.com/reel/DI6jN-5hW82/",
      category: "wedding",
      categoryName: "Wedding Gifts",
      productId: "big-quraan-set-16-inch",
      productName: "Royal Velvet & Acrylic Big Quraan Set (16 Inch)",
      productPrice: "₹2499"
    },
    {
      id: "reel-4",
      title: "SYRIAN QUBBA AVAILABLE AT ARABIANS 🛍️",
      views: "354K",
      likes: "18.8K",
      videoUrl: "/assets/reels/real_syrian_qubba.mp4",
      thumbnail: "/assets/reels/real_syrian_qubba.jpg",
      instagramUrl: "https://www.instagram.com/reel/DSC5bawjdBm/",
      category: "wearing",
      categoryName: "Royal Bisht",
      productId: "royal-arabic-bisht",
      productName: "Royal Arabian Bisht / Syrian Qubba (Gold Zari)",
      productPrice: "₹3499"
    },
    {
      id: "reel-5",
      title: "Arabian's Mosaic Aroma Lamp & Bakhoor Burner ✨",
      views: "3.9K",
      likes: "1.5K",
      videoUrl: "/assets/reels/real_aroma_lamp.mp4",
      thumbnail: "/assets/reels/real_aroma_lamp.jpg",
      instagramUrl: "https://www.instagram.com/reel/Dcnx6dJKfJM/",
      category: "fragrance",
      categoryName: "Aroma & Bakhoor",
      productId: "arabian-bakhoor-burner-combo",
      productName: "Arabian Royal Bakhoor & Electric Mabkhara Set",
      productPrice: "₹1299"
    },
    {
      id: "reel-6",
      title: "Arabian Talbeena — Sunnat Ka Asli Taste & Health 🥣",
      views: "3.4K",
      likes: "1.1K",
      videoUrl: "/assets/reels/real_talbeena_sunnah.mp4",
      thumbnail: "/assets/reels/real_talbeena_sunnah.jpg",
      instagramUrl: "https://www.instagram.com/reel/DcvNdPIRqm6/",
      category: "health",
      categoryName: "Sunnah Talbeena",
      productId: "talbina-milk-mawa",
      productName: "Arabian's Talbeena Milk Mawa Flavour",
      productPrice: "₹349"
    }
  ],
  orders: [
    {
      id: "ASZ-1089",
      date: "2026-09-02 18:45",
      customer: {
        name: "Syed Tariq Hashmi",
        phone: "9871234560",
        email: "tariq.hashmi@gmail.com",
        address: "Flat 402, Al-Madina Heights, Mehdipatnam",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500028"
      },
      items: [
        {
          id: "talbina-vanilla",
          name: "Arabian's Talbeena Vanilla Dry Fruits (250g)",
          price: 349,
          quantity: 2,
          image: "/assets/talbina/talbina_vanilla_dryfruits.png"
        },
        {
          id: "white-oudh-attar",
          name: "Imperial White Oudh Attar (12ml)",
          price: 649,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=600&q=80"
        }
      ],
      subtotal: 1347,
      discount: 135,
      couponCode: "ARABIAN10",
      deliveryFee: 0,
      total: 1212,
      paymentMethod: "COD",
      status: "Dispatched",
      courier: "BlueDart Express",
      trackingNumber: "BD982341982IN",
      timeline: [
        { status: "Order Placed", time: "02 Sep 2026, 06:45 PM", done: true },
        { status: "Verified & Packed", time: "02 Sep 2026, 08:30 PM", done: true },
        { status: "Dispatched (BlueDart)", time: "03 Sep 2026, 10:15 AM", done: true },
        { status: "In Transit to Hyderabad Hub", time: "Expected 04 Sep", done: false },
        { status: "Delivered", time: "Expected 05 Sep", done: false }
      ]
    },
    {
      id: "ASZ-1088",
      date: "2026-09-02 14:20",
      customer: {
        name: "Irfan Mansoori",
        phone: "9123456789",
        email: "irfan.mansoori@yahoo.com",
        address: "House 12, Gulshan Colony, Zakir Nagar, Okhla",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110025"
      },
      items: [
        {
          id: "thobe-al-noor-signature",
          name: "Al-Noor Signature Embroidered Thobe (Size 56)",
          price: 1899,
          quantity: 1,
          image: "/assets/thobes/thobes__al_noor_design_p1_1.png"
        }
      ],
      subtotal: 1899,
      discount: 190,
      couponCode: "ARABIAN10",
      deliveryFee: 0,
      total: 1709,
      paymentMethod: "UPI",
      status: "In Transit",
      courier: "Delhivery Air",
      trackingNumber: "DLH99238419",
      timeline: [
        { status: "Order Placed", time: "02 Sep 2026, 02:20 PM", done: true },
        { status: "Verified & Packed", time: "02 Sep 2026, 04:10 PM", done: true },
        { status: "Dispatched (Delhivery)", time: "02 Sep 2026, 07:00 PM", done: true },
        { status: "In Transit (Delhi Hub)", time: "03 Sep 2026, 06:00 AM", done: true },
        { status: "Delivered", time: "Expected Today", done: false }
      ]
    },
    {
      id: "ASZ-1087",
      date: "2026-09-01 11:15",
      customer: {
        name: "Shabana Begum",
        phone: "9845123456",
        email: "shabana.begum@gmail.com",
        address: "7th Cross, Shivaji Nagar",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560051"
      },
      items: [
        {
          id: "nikah-nama-booklet-luxury",
          name: "Luxury Velvet Gold-Foil Nikah Nama Booklet",
          price: 1499,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "nikah-luxury-pen-mirror-set",
          name: "Royal Ostrich Feather Nikah Signing Pen Set",
          price: 899,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80"
        }
      ],
      subtotal: 2398,
      discount: 200,
      couponCode: "SUNNAH100",
      deliveryFee: 0,
      total: 2198,
      paymentMethod: "UPI",
      status: "Delivered",
      courier: "DTDC Express",
      trackingNumber: "DTDC100234",
      timeline: [
        { status: "Order Placed", time: "01 Sep 2026, 11:15 AM", done: true },
        { status: "Verified & Packed", time: "01 Sep 2026, 01:00 PM", done: true },
        { status: "Dispatched", time: "01 Sep 2026, 05:30 PM", done: true },
        { status: "Out for Delivery", time: "02 Sep 2026, 10:00 AM", done: true },
        { status: "Delivered", time: "02 Sep 2026, 02:45 PM", done: true }
      ]
    }
  ],
  distributors: [
    {
      id: "DIST-101",
      name: "Tariq Jameel Perfumery & Cloth",
      contactPerson: "Tariq Jameel",
      phone: "9820192834",
      email: "tariqjameel.store@gmail.com",
      city: "Srinagar",
      state: "Jammu & Kashmir",
      currentBusiness: "Islamic Bookstore & Attar Shop",
      investmentBudget: "₹50,000 - ₹1,00,000",
      interestedProducts: ["Arabians Talbina (All Flavors)", "Attar & Dehnul Oud", "Thobes"],
      message: "We have 2 prime location stores in Lal Chowk Srinagar. Huge demand for authentic Talbina and Dubai style Thobes. Please send wholesale margin sheet.",
      status: "New Lead",
      date: "2026-09-02"
    },
    {
      id: "DIST-102",
      name: "Al-Barakah Sunnah Mart",
      contactPerson: "Hafiz Naimur Rahman",
      phone: "9447123987",
      email: "albarakah.calicut@gmail.com",
      city: "Calicut (Kozhikode)",
      state: "Kerala",
      currentBusiness: "Organic Sunnah Foods & Dates Retailer",
      investmentBudget: "₹1,00,000 - ₹2,50,000",
      interestedProducts: ["Arabians Talbina Superstockist", "Sidr Honey Mix"],
      message: "Interested in exclusive district dealership for Kozhikode and Malappuram. We sell over 500 boxes of Talbina monthly.",
      status: "Contacted",
      date: "2026-09-01"
    }
  ],
  coupons: [
    { code: "ARABIAN10", discountPercent: 10, minOrder: 499, description: "10% Off on all orders above ₹499" },
    { code: "SUNNAH100", flatDiscount: 100, minOrder: 999, description: "Flat ₹100 Off on orders above ₹999" },
    { code: "RAMADAN50", discountPercent: 5, minOrder: 299, description: "5% Extra Festival Discount" },
    { code: "FIRSTORDER", flatDiscount: 150, minOrder: 1299, description: "Flat ₹150 Off for new shoppers" }
  ]
};
