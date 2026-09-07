/**
 * Arabians Shopping Zone - Smart Product Search Engine
 * 
 * Features:
 * 1. Multi-token keyword search (AND/OR with scoring)
 * 2. Stemming & Plural/Singular normalization (thobes <-> thobe, attars <-> attar, etc.)
 * 3. Islamic & E-commerce Synonyms & Transliterations (Hinglish / Urdu / English)
 * 4. Full-index matching across all product fields (Name, Category, Subcategory, Tags, Description, Benefits, Badges, ID)
 * 5. Automatic compatibility with any future products created via Admin Panel
 * 6. Relevance Scoring & Ranking
 */

const CATEGORY_NAMES_MAP = {
  wearing: ["men's wear", "royal attire", "thobes", "jubba", "clothes", "clothing", "mens wear"],
  health: ["healthy", "sunnah foods", "talbina", "talbeena", "honey", "wellness", "diet", "nutrition"],
  fragrance: ["fragrance", "oud", "attar", "perfume", "bakhoor", "mabkhara", "scent", "khushbu"],
  decor: ["islamic home decor", "home decor", "decor", "wall art", "clock", "clocks", "frame", "frames", "tugra"],
  wedding: ["muslim wedding", "wedding", "nikah", "nikahnama", "marriage", "dulha", "groom", "bride"],
  skincare: ["skin care", "skincare", "soap", "herbal soap", "serum", "kalonji oil", "rose water", "arq-e-gulab", "face wash", "lotion", "cream"]
};

const SUBCATEGORY_NAMES_MAP = {
  thobes: ["thobe", "thobes", "jubba", "jubbah", "saudi thobe", "emirati thobe", "kurta", "kandura", "dishdasha"],
  amama: ["amama", "amama shareef", "amama sharif", "turban", "pagdi", "dastar", "green amama"],
  rumal: ["rumal", "shemagh", "keffiyeh", "ghutra", "agal", "arabian rumal"],
  caps: ["cap", "caps", "topi", "barkati", "turkish cap", "prayer cap", "islamic cap"],
  bisht: ["bisht", "qubba", "arabic bisht", "syrian qubba", "cloak", "royal robe"],
  turban: ["turban", "wedding turban", "groom pagdi", "sehra"],
  
  talbina: ["talbina", "talbeena", "sprouted barley", "barley", "jao", "dalia", "superfood", "pista", "badam", "saffron", "kesar", "elaichi", "cardamom", "vanilla", "chocolate", "strawberry", "kewra"],
  'honey-mix': ["honey mix", "dry fruits honey", "dryfruit honey", "royal honey", "nuts in honey"],
  'pure-honey': ["pure honey", "raw honey", "sidr honey", "kashmir honey", "natural honey", "shehad", "shahad"],
  
  perfume: ["perfume", "perfumes", "arabian perfume", "royal perfume", "spray perfume", "edp"],
  attar: ["attar", "attars", "pure attar", "non alcoholic attar", "itr", "itar", "ittar"],
  bakhoor: ["bakhoor", "bukhoor", "incense", "loban", "dhoop", "oud chips"],
  burner: ["burner", "burners", "mabkhara", "bakhoor burner", "electric mabkhara", "aroma lamp"],
  roomspray: ["room spray", "air freshener", "home fragrance"],
  bodyspray: ["body spray", "deodorant"],
  'essential-oil': ["essential oil", "pure oil", "aroma oil"],
  oudwood: ["oud wood", "agarwood", "real agarwood", "wood chips"],
  dehnuloud: ["dehnul oud", "dehn al oud", "cambodian oud", "assam oud", "pure oud"],
  carperfume: ["car perfume", "hanging perfume", "car freshener"],
  
  'acrylic-tugra': ["acrylic tugra", "tugra frame", "tughra", "ayatul kursi frame", "bismillah frame", "wall frame"],
  'acrylic-clock': ["acrylic clock", "wall clock", "islamic clock", "ghadi"],
  'resin-clock': ["resin clock", "emerald clock", "epoxy clock", "luxury clock"],
  'resin-tugre': ["resin tugre", "resin art", "sacred calligraphy"],
  'acrylic-accessories': ["acrylic accessory", "rehal", "quran stand", "counter", "tasbih holder"],
  
  'nikah-booklet': ["nikah nama", "nikahnama", "nikah booklet", "marriage certificate", "qubul hai"],
  'booklet-box': ["booklet box", "nikahnama box", "velvet box"],
  'nikah-pen': ["nikah pen", "feather pen", "signing pen", "quill pen"],
  'thumb-board': ["thumb board", "fingerprint canvas", "nikah board"],
  'nikah-mirror': ["nikah mirror", "dulhan mirror", "wedding mirror"],
  'nikah-dupatta': ["nikah dupatta", "qubool hai dupatta", "dulhan dupatta"],
  'nikah-sehra': ["nikah sehra", "groom sehra", "dulha sehra"],
  'haq-mehar': ["haq mehar", "mehar box", "mehr trunk"],
  
  'face-care': ["face care", "face serum", "skin serum", "glowing skin", "face wash"],
  'organic-soaps': ["organic soap", "herbal soap", "kalonji soap", "natural soap", "handmade soap"],
  'beard-hair-oil': ["beard oil", "hair oil", "sunnah oil", "kalonji oil", "blackseed oil"],
  'rose-water': ["rose water", "arq-e-gulab", "gulab jal", "facial mist", "toner"],
  'body-lotions': ["body lotion", "body care", "skin cream", "natural moisturiser"]
};

const SYNONYM_DICTIONARY = {
  // Thobes / Clothing
  thobe: ["thobes", "jubba", "jubbah", "kurta", "kandura", "dishdasha", "robe", "attire", "dress"],
  thobes: ["thobe", "jubba", "jubbah", "kurta", "kandura", "dishdasha", "wearing"],
  jubba: ["thobe", "thobes", "jubbah", "kurta"],
  jubbah: ["thobe", "thobes", "jubba", "kurta"],
  kurta: ["thobe", "thobes", "jubba", "attire"],
  wearing: ["thobe", "thobes", "jubba", "mens wear", "clothes", "attire"],
  amama: ["amama shareef", "turban", "pagdi", "dastar"],
  topi: ["cap", "caps", "barkati", "turkish"],
  cap: ["caps", "topi", "barkati", "turkish"],
  caps: ["cap", "topi", "barkati"],
  rumal: ["shemagh", "keffiyeh", "ghutra", "agal"],
  shemagh: ["rumal", "keffiyeh", "ghutra", "agal"],
  bisht: ["qubba", "cloak", "robe"],
  qubba: ["bisht", "syrian qubba"],
  
  // Health / Talbina / Honey
  talbina: ["talbeena", "barley", "jao", "dalia", "superfood", "nutritional"],
  talbeena: ["talbina", "barley", "jao", "dalia", "superfood", "nutritional"],
  honey: ["shehad", "shahad", "sidr", "raw honey", "pure honey", "honey mix"],
  shehad: ["honey", "shahad", "sidr", "pure honey"],
  shahad: ["honey", "shehad", "sidr", "pure honey"],
  barley: ["talbina", "talbeena", "jao"],
  dryfruits: ["dry fruit", "dry fruits", "honey mix", "badam", "almond", "pista", "cashew", "kaju"],
  
  // Fragrance / Oud / Attar
  attar: ["attars", "itr", "itar", "ittar", "perfume", "oud", "fragrance", "khushbu", "khushboo"],
  attars: ["attar", "itr", "itar", "ittar", "perfume", "oud"],
  itr: ["attar", "attars", "itar", "ittar", "fragrance"],
  ittar: ["attar", "attars", "itr", "fragrance"],
  itar: ["attar", "attars", "itr", "fragrance"],
  perfume: ["perfumes", "attar", "oud", "fragrance", "scent", "cologne"],
  perfumes: ["perfume", "attar", "oud", "fragrance"],
  oud: ["oudh", "dehnul oud", "agarwood", "attar", "perfume", "cambodian oud"],
  oudh: ["oud", "dehnul oud", "agarwood"],
  dehnul: ["dehnul oud", "oud", "agarwood", "pure oud"],
  bakhoor: ["bukhoor", "incense", "loban", "dhoop", "mabkhara"],
  bukhoor: ["bakhoor", "incense", "loban", "mabkhara"],
  mabkhara: ["burner", "bakhoor burner", "incense burner", "electric burner"],
  burner: ["mabkhara", "bakhoor burner", "incense burner"],
  khushbu: ["perfume", "attar", "fragrance", "scent", "khushboo"],
  khushboo: ["perfume", "attar", "fragrance", "scent", "khushbu"],
  
  // Decor / Clocks / Frames
  decor: ["home decor", "frame", "clock", "calligraphy", "wall art", "tugra"],
  frame: ["frames", "tugra", "tughra", "acrylic frame", "wall frame", "bismillah frame", "ayatul kursi"],
  frames: ["frame", "tugra", "tughra", "acrylic frame"],
  clock: ["clocks", "ghadi", "wall clock", "resin clock", "acrylic clock"],
  clocks: ["clock", "ghadi", "wall clock"],
  ghadi: ["clock", "clocks", "wall clock"],
  tugra: ["tughra", "frame", "calligraphy", "acrylic tugra"],
  bismillah: ["frame", "decor", "calligraphy", "wall art"],
  
  // Wedding / Nikah
  wedding: ["nikah", "nikahnama", "marriage", "shadi", "shaadi", "dulha", "groom"],
  nikah: ["wedding", "nikahnama", "nikah nama", "marriage", "shaadi"],
  nikahnama: ["nikah nama", "nikah booklet", "marriage booklet", "certificate"],
  shadi: ["wedding", "nikah", "shaadi", "marriage"],
  shaadi: ["wedding", "nikah", "shadi", "marriage"],
  sehra: ["dulha sehra", "groom sehra", "wedding sehra"],
  dupatta: ["nikah dupatta", "qubool hai dupatta", "dulhan dupatta"],
  pen: ["nikah pen", "feather pen", "signing pen"]
};

/**
 * Normalizes text to lowercase, trims whitespace, and removes punctuation.
 */
export function normalizeText(text) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Basic word stemming (handles common English/e-commerce plurals).
 */
export function stemWord(word) {
  if (!word || word.length <= 3) return word;
  
  // Special stems
  if (word.endsWith('ies') && word.length > 4) return word.slice(0, -3) + 'y';
  if (word.endsWith('es') && word.length > 4) {
    if (word.endsWith('boxes')) return 'box';
    if (word.endsWith('thobes')) return 'thobe';
    if (word.endsWith('watches')) return 'watch';
    return word.slice(0, -2);
  }
  if (word.endsWith('s') && !word.endsWith('ss') && word.length > 3) {
    return word.slice(0, -1);
  }
  return word;
}

/**
 * Expands query string into an array of normalized token sets with synonyms and stems.
 */
export function expandQueryTokens(rawQuery) {
  const clean = normalizeText(rawQuery);
  if (!clean) return { rawWords: [], rawPhrase: '', expandedTokens: [] };

  const words = clean.split(' ').filter(Boolean);
  const expanded = new Set();

  words.forEach(w => {
    expanded.add(w);
    const stem = stemWord(w);
    expanded.add(stem);

    // Look up in synonym dictionary
    if (SYNONYM_DICTIONARY[w]) {
      SYNONYM_DICTIONARY[w].forEach(syn => {
        normalizeText(syn).split(' ').forEach(token => expanded.add(token));
      });
    }
    if (SYNONYM_DICTIONARY[stem]) {
      SYNONYM_DICTIONARY[stem].forEach(syn => {
        normalizeText(syn).split(' ').forEach(token => expanded.add(token));
      });
    }
  });

  return {
    rawWords: words,
    rawPhrase: clean,
    expandedTokens: Array.from(expanded)
  };
}

/**
 * Builds a rich searchable text bundle for a product.
 */
export function getProductSearchCorpus(product) {
  const parts = [];

  if (product.name) parts.push(product.name);
  if (product.category) {
    parts.push(product.category);
    if (CATEGORY_NAMES_MAP[product.category]) {
      parts.push(...CATEGORY_NAMES_MAP[product.category]);
    }
  }
  if (product.subcategory || product.subCategory) {
    const sub = product.subcategory || product.subCategory;
    parts.push(sub);
    if (SUBCATEGORY_NAMES_MAP[sub]) {
      parts.push(...SUBCATEGORY_NAMES_MAP[sub]);
    }
  }
  if (product.badge) parts.push(product.badge);
  if (product.description) parts.push(product.description);
  
  if (Array.isArray(product.tags)) {
    parts.push(...product.tags);
  } else if (typeof product.tags === 'string') {
    parts.push(product.tags);
  }

  if (Array.isArray(product.benefits)) {
    parts.push(...product.benefits);
  } else if (typeof product.benefits === 'string') {
    parts.push(product.benefits);
  }

  if (product.id) parts.push(product.id.replace(/-/g, ' '));
  if (product.price) parts.push(`₹${product.price}`, String(product.price));

  return normalizeText(parts.join(' '));
}

/**
 * Calculates a search relevance score for a given product.
 * Returns 0 if not a match, or > 0 based on relevance.
 */
export function calculateRelevanceScore(product, queryInfo) {
  const { rawWords, rawPhrase, expandedTokens } = queryInfo;
  if (!rawPhrase || rawWords.length === 0) return 100; // No search query = match all

  const pName = normalizeText(product.name || '');
  const pCat = normalizeText(product.category || '');
  const pSub = normalizeText(product.subcategory || product.subCategory || '');
  const pTags = Array.isArray(product.tags) 
    ? normalizeText(product.tags.join(' ')) 
    : normalizeText(product.tags || '');
  const pDesc = normalizeText(product.description || '');
  const fullCorpus = getProductSearchCorpus(product);

  let score = 0;

  // 1. EXACT PHRASE MATCHES (Highest Priority)
  if (pName === rawPhrase) {
    score += 500;
  } else if (pName.startsWith(rawPhrase)) {
    score += 300;
  } else if (pName.includes(rawPhrase)) {
    score += 200;
  }

  // 2. TOKEN MATCHES IN TITLE
  let titleTokensMatched = 0;
  rawWords.forEach(w => {
    const stem = stemWord(w);
    if (pName.includes(w) || pName.includes(stem)) {
      titleTokensMatched++;
      score += 60;
    }
  });

  if (titleTokensMatched === rawWords.length && rawWords.length > 1) {
    score += 150; // Bonus for all raw words present in title
  }

  // 3. CATEGORY & SUBCATEGORY MATCHES
  if (pCat.includes(rawPhrase) || (CATEGORY_NAMES_MAP[product.category] && CATEGORY_NAMES_MAP[product.category].some(cn => rawPhrase.includes(cn) || cn.includes(rawPhrase)))) {
    score += 80;
  }
  if (pSub.includes(rawPhrase) || (SUBCATEGORY_NAMES_MAP[product.subcategory] && SUBCATEGORY_NAMES_MAP[product.subcategory].some(sn => rawPhrase.includes(sn) || sn.includes(rawPhrase)))) {
    score += 90;
  }

  // 4. TAGS MATCHES
  if (pTags.includes(rawPhrase)) {
    score += 70;
  }
  rawWords.forEach(w => {
    if (pTags.includes(w) || pTags.includes(stemWord(w))) {
      score += 30;
    }
  });

  // 5. EXPANDED / SYNONYM TOKEN MATCHES
  let expandedMatches = 0;
  expandedTokens.forEach(token => {
    if (token.length > 2 && fullCorpus.includes(token)) {
      expandedMatches++;
      score += 15;
    }
  });

  // 6. DESCRIPTION MATCHES
  if (pDesc.includes(rawPhrase)) {
    score += 40;
  }

  // If none of the raw words or expanded tokens match the corpus, return 0
  const hasRawMatch = rawWords.some(w => fullCorpus.includes(w) || fullCorpus.includes(stemWord(w)));
  const hasExpandedMatch = expandedTokens.some(t => t.length > 2 && fullCorpus.includes(t));

  if (!hasRawMatch && !hasExpandedMatch) {
    return 0;
  }

  return score;
}

/**
 * Searches and ranks products intelligently.
 * Works seamlessly with both hardcoded catalog and dynamically added Admin Panel products.
 */
export function searchProducts(products, searchQuery, options = {}) {
  if (!Array.isArray(products)) return [];
  const query = (searchQuery || '').trim();

  if (!query) {
    return products;
  }

  const queryInfo = expandQueryTokens(query);

  const scoredProducts = [];
  for (const product of products) {
    const score = calculateRelevanceScore(product, queryInfo);
    if (score > 0) {
      scoredProducts.push({ product, score });
    }
  }

  // Sort by relevance score descending
  scoredProducts.sort((a, b) => b.score - a.score);

  return scoredProducts.map(item => item.product);
}
