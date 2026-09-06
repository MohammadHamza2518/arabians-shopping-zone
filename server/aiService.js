import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const poolFilePath = path.join(__dirname, 'data', 'ai_agents_pool.json');

// In-memory pool state
let agentsPool = [];
let currentPoolIndex = 0;

function loadPool() {
  try {
    if (fs.existsSync(poolFilePath)) {
      const raw = fs.readFileSync(poolFilePath, 'utf8');
      agentsPool = JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error loading ai_agents_pool.json:", e.message);
  }
}

function savePool() {
  try {
    fs.writeFileSync(poolFilePath, JSON.stringify(agentsPool, null, 2), 'utf8');
  } catch (e) {
    console.error("Error saving ai_agents_pool.json:", e.message);
  }
}

loadPool();

// Helper to make HTTPS request
function makeGetRequest(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'GET', headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

/**
 * Get signed WebSocket URL with automatic failover across all 6 API keys
 */
export async function getSignedUrlWithFailover() {
  loadPool();
  if (!agentsPool || agentsPool.length === 0) {
    throw new Error("No ElevenLabs AI agents configured in pool.");
  }

  const totalKeys = agentsPool.length;
  let attempts = 0;

  while (attempts < totalKeys) {
    const candidate = agentsPool[currentPoolIndex];
    
    if (!candidate || !candidate.apiKey || !candidate.agentId) {
      currentPoolIndex = (currentPoolIndex + 1) % totalKeys;
      attempts++;
      continue;
    }

    try {
      const url = `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${candidate.agentId}`;
      const res = await makeGetRequest(url, { 'xi-api-key': candidate.apiKey });

      if (res.status === 200 && res.data && res.data.signed_url) {
        candidate.lastUsed = new Date().toISOString();
        candidate.errorCount = 0;
        candidate.active = true;
        savePool();

        return {
          success: true,
          signedUrl: res.data.signed_url,
          agentId: candidate.agentId,
          poolIndex: candidate.index,
          totalInPool: totalKeys
        };
      }

      // Check if limit exceeded or unauthorized or rate limited
      console.warn(`⚠️ ElevenLabs Key #${candidate.index} (${candidate.apiKey.slice(0, 10)}...) returned HTTP ${res.status}: ${JSON.stringify(res.data?.detail || res.data)}. Switching to next key...`);
      candidate.errorCount = (candidate.errorCount || 0) + 1;
      
      // Rotate to next key
      currentPoolIndex = (currentPoolIndex + 1) % totalKeys;
      attempts++;
    } catch (err) {
      console.error(`❌ Network error with Key #${candidate.index}: ${err.message}. Rotating...`);
      currentPoolIndex = (currentPoolIndex + 1) % totalKeys;
      attempts++;
    }
  }

  throw new Error("All ElevenLabs API keys in the pool are currently exhausted or unavailable.");
}

/**
 * Pool status monitor for admin & diagnostics
 */
export function getPoolStatus() {
  loadPool();
  return {
    currentIndex: currentPoolIndex + 1,
    totalKeys: agentsPool.length,
    pool: agentsPool.map(a => ({
      index: a.index,
      maskedKey: a.apiKey ? `${a.apiKey.slice(0, 8)}...${a.apiKey.slice(-4)}` : null,
      agentId: a.agentId,
      active: a.active,
      lastUsed: a.lastUsed,
      errorCount: a.errorCount || 0
    }))
  };
}

/**
 * Intelligent Brain for Interactive Text Chat & Recommendations
 * Formats warm, respectful Hinglish/Urdu responses with rich product links
 */
export function handleTextQuery(rawQuery, storeProducts = []) {
  const q = (rawQuery || '').toLowerCase().trim();
  let text = '';
  let recommendations = [];
  let quickPrompts = [];

  // 1. TALBINA INQUIRIES
  if (q.includes('talbina') || q.includes('talbeena') || q.includes('jau') || q.includes('daliya') || q.includes('bimar') || q.includes('kamzor') || q.includes('taqat') || q.includes('weakness') || q.includes('depression') || q.includes('gham') || q.includes('sugar free')) {
    text = `Wa Alaykum As-Salam brother/sister! 🥣✨

**Talbina** ek mubarak Sunnah tonic hai jise roasted jau (barley), badam, pista, kaju, chhuhare (dry dates) aur shuddh sahad se banaya jata hai.

**Mubarak Hadith (Sahih Bukhari):**
Rasoolullah ﷺ ne farmaya: *"Talbina ghamzada dil ko sukoon deta hai aur kamzori ko door karta hai."*

**Aapke Liye Best Options:**
- **Milk Mawa Flavor (₹349):** Rozana taqat aur lazeez creamy taste ke liye sabse famous.
- **Sugar-Free Talbina (₹349):** Sugar ya diabetes ke mareezon ke liye 100% safe.
- **Dry Dates Special (₹349):** Jismani kamzori aur natural stamina ke liye.

**Kaise Banayein:** 2 se 3 chammach Talbina ko 200ml gungune doodh ya paani me 3-5 minute paka kar subah nashte me nosh farmayein!`;

    recommendations = (storeProducts || []).filter(p => (p.category === 'health' || p.name.toLowerCase().includes('talbina'))).slice(0, 3);
    quickPrompts = ['Sugar Free Talbina dikhao', 'Order kaise karein?', 'COD milega?'];
  }

  // 2. MEN'S ROYAL ATTIRE & THOBE SIZES
  else if (q.includes('thobe') || q.includes('jubba') || q.includes('kurta') || q.includes('saudi') || q.includes('emirati') || q.includes('amama') || q.includes('cap') || q.includes('topi') || q.includes('bisht') || q.includes('qubba') || q.includes('size')) {
    text = `Jee bilkul! Hamare paas premium imported **Saudi, Emirati & Omani Thobes (Jubba)**, traditional **7-Meter Amama Sharif**, Turkish Velvet Caps aur groom ke liye **Royal Syrian Qubba (Bisht)** dastiyab hain.

📏 **Thobe Height Sizing Guide:**
- 5'2" se 5'4" ke liye ➔ **Size 52**
- 5'4" se 5'6" ke liye ➔ **Size 54**
- 5'7" se 5'9" ke liye ➔ **Size 56**
- 5'10" se 6'0" ke liye ➔ **Size 58**
- 6'1"+ ke liye ➔ **Size 60**

Har Thobe breathable luxury cotton-blend fabric me tailored hai jo garmi me thanda aur wrinkle-free rehta hai!`;

    recommendations = (storeProducts || []).filter(p => (p.category === 'wearing' || p.name.toLowerCase().includes('thobe') || p.name.toLowerCase().includes('bisht'))).slice(0, 3);
    quickPrompts = ['White Saudi Thobe dikhao', 'Royal Bisht Groom', 'Coupon Code kya hai?'];
  }

  // 3. OUD & PURE ATTAR
  else if (q.includes('oud') || q.includes('attar') || q.includes('itar') || q.includes('khushboo') || q.includes('fragrance') || q.includes('bakhoor') || q.includes('perfume') || q.includes('dehnul oud')) {
    text = `MashaAllah! Hamari fragrances 100% **Alcohol-Free, Pure & Namaz-Safe** hain:

🌿 **Top Fragrance Collections:**
- **Cambodian Dehnul Oud (₹999):** Shuddh purana aged oudh jiski royal woody khushboo kapdon par 48 ghante tak rehti hai.
- **Pure White Oudh & Kasturi:** Rozana namaz aur jummah ke liye soft aur sukoon-bakhsh roohani khushboo.
- **Arabian Bakhoor & Electric Mabkhara:** Ghar ya dukan ko Masjid-e-Nabwi jaisa mehkane ke liye shuddh bakhoor chips.

Ispar flat 10% discount ke liye coupon **ARABIAN10** zaroor use karein!`;

    recommendations = (storeProducts || []).filter(p => (p.category === 'fragrance' || p.name.toLowerCase().includes('oud') || p.name.toLowerCase().includes('attar'))).slice(0, 3);
    quickPrompts = ['Cambodian Dehnul Oud', 'Bakhoor Burner Set', 'Delivery kitne din me hogi?'];
  }

  // 4. MUSLIM WEDDING & HOME DECOR
  else if (q.includes('nikah') || q.includes('wedding') || q.includes('shaadi') || q.includes('shadi') || q.includes('dulha') || q.includes('dulhan') || q.includes('gift') || q.includes('clock') || q.includes('frame') || q.includes('tugra') || q.includes('pen')) {
    text = `Mubarak ho brother/sister! Nikah aur Islamic Home Decor ke liye hamara collection bohot hi khususi hai:

💍 **Sunnah Nikah Essentials:**
- **Royal Velvet Nikah Nama Booklet:** Custom gold calligraphy ke sath lifelong yaadgaar.
- **Feather Signing Pens & Thumb Boards:** Nikah stage photos ke liye royal look.
- **Haq Mehar Luxury Boxes:** Shariat-e-Islami ke mutabiq mahr pesh karne ke liye.

🏠 **Islamic Decor:** Handcrafted Emerald Resin Wall Clocks aur Golden Acrylic Tugra Frames direct hamare studio se tayyar hote hain!`;

    recommendations = (storeProducts || []).filter(p => (p.category === 'wedding' || p.category === 'decor')).slice(0, 3);
    quickPrompts = ['Nikah Nama Booklet', 'Emerald Resin Clock', 'Payment COD milega?'];
  }

  // 5. ORDER TRACKING & STATUS
  else if (q.includes('track') || q.includes('kahan hai') || q.includes('status') || q.includes('parcel') || q.includes('order id') || q.includes('awb')) {
    text = `Aap apna parcel live track kar sakte hain! 🚚✨

Aap hamari website ke dedicated Tracking Page par jaakar apna **Order ID** (e.g. ASZ-1089 ya sirf 1089) ya apna **10-digit Mobile Number** enter karein:

👉 **[Live Track Page: /#/track](/#/track)**

Aapko BlueDart / Delhivery ka live courier status aur 5-step progress bar turant mil jayega!`;

    quickPrompts = ['Live Track Page kholein', 'Customer Care WhatsApp', 'New Order Place karein'];
  }

  // 6. SHIPPING, COD, DELIVERY TIME & COUPON
  else if (q.includes('delivery') || q.includes('shipping') || q.includes('cod') || q.includes('kitne din') || q.includes('offer') || q.includes('coupon') || q.includes('discount')) {
    text = `Befikr rahiye! Delivery aur offers ki poori jankari ye hai:

🚚 **Delivery & Shipping:**
- **Cash on Delivery (COD):** Poore Hindustan me har pincode par COD available hai!
- **Free Delivery:** ₹999 se zyada ke orders par Express Free Pan-India Delivery milti hai.
- **Delivery Time:** Order place hone ke 24 ghante me BlueDart Air / Delhivery se dispatch hota hai, aur 3-4 dino me aapke darwaze tak pahunch jata hai.

🎟️ **Special Discount Coupon:**
Checkout ke waqt **'ARABIAN10'** code lagayein — aapko foran Flat 10% Discount mil jayega!`;

    quickPrompts = ['Talbina dekhein', 'Royal Thobes dekhein', 'WhatsApp connect'];
  }

  // DEFAULT CONVERSATIONAL RESPONSE
  else {
    text = `Wa Alaykum As-Salam wa Rahmatullahi wa Barakatuh! 🌙

Main **Brother Bilal** hoon — Arabians Shopping Zone ka customer advisor.

Aap mujhse store ke kisi bhi item ke baare me pooch sakte hain:
- 🥣 **Sunnah Talbina** ke fayde aur flavors
- 👔 **Saudi & Emirati Thobes** ka size chart
- 💎 **Pure Dehnul Oud & Non-Alcoholic Attar**
- 💍 **Royal Nikah Nama Booklets & Gift Sets**
- 🚚 **Order Tracking & Free Pan-India COD**

Aap website par direct order karein ya coupon **'ARABIAN10'** laga kar 10% off payein! Farmayein, main aapki kya madad kar sakta hoon?`;

    recommendations = (storeProducts || []).slice(0, 3);
    quickPrompts = ['Talbina ke fayde kya hain?', 'Saudi Thobe size guide', 'Parcel kaise track karein?'];
  }

  return {
    success: true,
    text,
    recommendations: recommendations.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      mrp: p.mrp || p.price,
      image: p.image,
      category: p.category
    })),
    quickPrompts
  };
}
