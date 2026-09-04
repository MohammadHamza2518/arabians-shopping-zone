import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getHamperOrderWhatsAppUrl } from '../utils/whatsapp';
import { 
  Gift, 
  Sparkles, 
  Check, 
  ShoppingBag, 
  Zap, 
  MessageSquare, 
  ShieldCheck, 
  Truck, 
  ArrowRight,
  ArrowLeft,
  Search,
  PenTool,
  CheckCircle2,
  Share2,
  EyeOff,
  Package,
  Heart,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CARD_MESSAGES = [
  "Barakallahu Lakuma wa Baraka Alaikuma wa Jama'a Bainakuma Fee Khair (Nikah Blessings)",
  "Eid Mubarak! May this season bring peace, dignity, and divine prosperity to your family.",
  "With warm prayers, sincere love, and warmest prophetic wishes for barakah and shifa.",
  "A token of royal appreciation and honor for your gracious presence."
];

const TRUNK_THEMES = [
  {
    id: "emerald",
    name: "Royal Emerald & Antique Brass",
    tag: "Sunnah Classic",
    bgClass: "from-[#021e16] via-[#043325] to-[#021e16]",
    borderClass: "border-amber-500/50",
    accentColor: "text-amber-400",
    badgeBg: "bg-emerald-800 text-amber-300"
  },
  {
    id: "midnight",
    name: "Imperial Midnight Black & Gold",
    tag: "Modern Luxury",
    bgClass: "from-[#0d1017] via-[#1a1f2c] to-[#0d1017]",
    borderClass: "border-amber-400/60",
    accentColor: "text-amber-400",
    badgeBg: "bg-slate-800 text-amber-300"
  },
  {
    id: "burgundy",
    name: "Royal Velvet Burgundy Crimson",
    tag: "Nikah Special",
    bgClass: "from-[#290710] via-[#420d1c] to-[#290710]",
    borderClass: "border-amber-400/60",
    accentColor: "text-amber-300",
    badgeBg: "bg-rose-950 text-amber-300"
  }
];

export default function HamperBuilderPage() {
  const navigate = useNavigate();
  const { products, addToCart, showToast, settings } = useStore();

  // Dynamic products filtered from store catalog
  const thobeOptions = useMemo(() => {
    const list = products.filter(p => p.category === 'wearing');
    return list.length > 0 ? list : products.slice(0, 4);
  }, [products]);

  const fragranceOptions = useMemo(() => {
    const list = products.filter(p => p.category === 'fragrance');
    return list.length > 0 ? list : products.slice(0, 4);
  }, [products]);

  const keepsakeOptions = useMemo(() => {
    const list = products.filter(p => p.category === 'wedding' || p.category === 'health' || p.category === 'decor');
    return list.length > 0 ? list : products.slice(0, 6);
  }, [products]);

  // Active Occasion Preset
  const [activeOccasion, setActiveOccasion] = useState('groom');

  // Step Wizard State (1: Thobe, 2: Fragrance, 3: Keepsake, 4: Greeting Card & Packaging)
  const [currentStep, setCurrentStep] = useState(1);

  // Selections
  const [selectedThobe, setSelectedThobe] = useState(() => thobeOptions[0] || null);
  const [selectedThobeSize, setSelectedThobeSize] = useState("56");
  const [selectedFragrance, setSelectedFragrance] = useState(() => fragranceOptions[0] || null);
  const [selectedKeepsake, setSelectedKeepsake] = useState(() => keepsakeOptions[0] || null);

  // Trunk Packaging & Ribbon Customization
  const [selectedTrunkTheme, setSelectedTrunkTheme] = useState(TRUNK_THEMES[0]);
  const [selectedRibbon, setSelectedRibbon] = useState("Champagne Gold Silk");

  // Direct Gift Surprise Mode
  const [isDirectGift, setIsDirectGift] = useState(true);

  // Optional Sacred Add-on: Olive Wood Tasbih
  const [includeTasbih, setIncludeTasbih] = useState(true);
  const TASBIH_PRICE = 149;

  // Search inside active step
  const [stepSearch, setStepSearch] = useState('');
  const [keepsakeFilter, setKeepsakeFilter] = useState('all');

  // Calligraphy Greeting Card Details
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(CARD_MESSAGES[0]);

  // Load Occasion Presets with 1-Click
  const applyOccasionPreset = (presetKey) => {
    setActiveOccasion(presetKey);
    if (presetKey === 'groom') {
      // White thobe + Cambodian Oud + Nikah Nama
      const whiteThobe = thobeOptions.find(t => t.id.includes('white')) || thobeOptions[0];
      const oud = fragranceOptions.find(f => f.id.includes('oud')) || fragranceOptions[0];
      const nikahBooklet = keepsakeOptions.find(k => k.id.includes('nikah')) || keepsakeOptions[0];
      if (whiteThobe) setSelectedThobe(whiteThobe);
      if (oud) setSelectedFragrance(oud);
      if (nikahBooklet) setSelectedKeepsake(nikahBooklet);
      setSelectedTrunkTheme(TRUNK_THEMES[0]); // Emerald
      setSelectedMessage(CARD_MESSAGES[0]);
      setIncludeTasbih(true);
    } else if (presetKey === 'eid') {
      // Signature Thobe + White Musk + Talbina
      const sigThobe = thobeOptions.find(t => t.id.includes('noor') || t.id.includes('burberry')) || thobeOptions[1] || thobeOptions[0];
      const musk = fragranceOptions.find(f => f.id.includes('musk') || f.id.includes('fragrance')) || fragranceOptions[1] || fragranceOptions[0];
      const talbina = keepsakeOptions.find(k => k.id.includes('talbina')) || keepsakeOptions[1] || keepsakeOptions[0];
      if (sigThobe) setSelectedThobe(sigThobe);
      if (musk) setSelectedFragrance(musk);
      if (talbina) setSelectedKeepsake(talbina);
      setSelectedTrunkTheme(TRUNK_THEMES[1]); // Midnight Black
      setSelectedMessage(CARD_MESSAGES[1]);
      setIncludeTasbih(true);
    } else if (presetKey === 'shifa') {
      // Thobe + Bakhoor + Honey
      const thobe = thobeOptions[2] || thobeOptions[0];
      const bakhoor = fragranceOptions.find(f => f.id.includes('bakhoor') || f.id.includes('burner')) || fragranceOptions[2] || fragranceOptions[0];
      const honey = keepsakeOptions.find(k => k.id.includes('honey')) || keepsakeOptions[2] || keepsakeOptions[0];
      if (thobe) setSelectedThobe(thobe);
      if (bakhoor) setSelectedFragrance(bakhoor);
      if (honey) setSelectedKeepsake(honey);
      setSelectedTrunkTheme(TRUNK_THEMES[2]); // Burgundy
      setSelectedMessage(CARD_MESSAGES[2]);
      setIncludeTasbih(false);
    }
    showToast(`Loaded ${presetKey.toUpperCase()} Curated Trunk! 🎁`);
  };

  // Pricing calculations
  const itemsSubtotal = (selectedThobe?.price || 1499) + (selectedFragrance?.price || 999) + (selectedKeepsake?.price || 999);
  const bundleDiscountPercent = 15;
  const bundleDiscount = Math.round((itemsSubtotal * bundleDiscountPercent) / 100);
  const bundlePrice = itemsSubtotal - bundleDiscount + (includeTasbih ? TASBIH_PRICE : 0);

  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    setStepSearch('');
    window.scrollTo({ top: 140, behavior: 'smooth' });
  };

  // Filtered items inside current step based on search
  const filteredThobes = useMemo(() => {
    if (!stepSearch.trim()) return thobeOptions;
    const q = stepSearch.toLowerCase();
    return thobeOptions.filter(t => t.name.toLowerCase().includes(q) || (t.badge || '').toLowerCase().includes(q));
  }, [thobeOptions, stepSearch]);

  const filteredFragrances = useMemo(() => {
    if (!stepSearch.trim()) return fragranceOptions;
    const q = stepSearch.toLowerCase();
    return fragranceOptions.filter(f => f.name.toLowerCase().includes(q) || (f.badge || '').toLowerCase().includes(q));
  }, [fragranceOptions, stepSearch]);

  const filteredKeepsakes = useMemo(() => {
    let list = keepsakeOptions;
    if (keepsakeFilter !== 'all') {
      list = list.filter(k => k.category === keepsakeFilter);
    }
    if (stepSearch.trim()) {
      const q = stepSearch.toLowerCase();
      list = list.filter(k => k.name.toLowerCase().includes(q) || (k.badge || '').toLowerCase().includes(q));
    }
    return list;
  }, [keepsakeOptions, keepsakeFilter, stepSearch]);

  const createHamperProduct = () => {
    const tName = selectedThobe?.name || "Saudi Thobe";
    const fName = selectedFragrance?.name || "Pure Fragrance";
    const kName = selectedKeepsake?.name || "Nikah Keepsake";

    return {
      id: `hamper-${Date.now()}`,
      name: `Custom Royal Hamper [${selectedTrunkTheme.name}]: ${tName.slice(0, 22)} + ${fName.slice(0, 18)} + ${kName.slice(0, 18)}`,
      price: bundlePrice,
      mrp: itemsSubtotal + 450 + (includeTasbih ? 299 : 0),
      category: "wedding",
      image: selectedKeepsake?.image || selectedThobe?.image || "/assets/studio/mens_white_thobe.jpg",
      badge: "15% Combo Savings",
      selectedSize: `Thobe Size: ${selectedThobeSize}`,
      hamperDetails: {
        trunkTheme: selectedTrunkTheme.name,
        ribbon: selectedRibbon,
        isDirectGift: isDirectGift,
        tasbihIncluded: includeTasbih,
        thobe: `${tName} (Size ${selectedThobeSize})`,
        fragrance: fName,
        keepsake: kName,
        greetingCard: {
          to: recipientName || "Valued Recipient",
          from: senderName || "With Duas",
          message: selectedMessage
        }
      }
    };
  };

  const handleAddHamperToCart = () => {
    const hamperItem = createHamperProduct();
    addToCart(hamperItem, 1, `Size ${selectedThobeSize} Hamper`);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    showToast("Royal Hamper added to your shopping bag! 🎁");
  };

  const handleBuyHamperNow = () => {
    const hamperItem = createHamperProduct();
    addToCart(hamperItem, 1, `Size ${selectedThobeSize} Hamper`);
    navigate('/checkout');
  };

  const handleWhatsAppHamper = () => {
    const waUrl = getHamperOrderWhatsAppUrl({
      trunkTheme: selectedTrunkTheme,
      thobe: selectedThobe,
      thobeSize: selectedThobeSize,
      fragrance: selectedFragrance,
      keepsake: selectedKeepsake,
      recipientName,
      senderName,
      includeTasbih,
      isDirectGift,
      totalPrice: bundlePrice
    }, settings.whatsapp);
    window.open(waUrl, '_blank');
  };

  // WhatsApp Share with Family for Consultation
  const handleShareWithFamily = () => {
    const text = encodeURIComponent(
      `Assalam o Alaikum! Check out this custom Arabians Royal Gift Hamper I curated for *${recipientName || 'our family gift'}*:\n\n` +
      `👑 *Thobe:* ${selectedThobe?.name} (Size ${selectedThobeSize})\n` +
      `🌿 *Fragrance:* ${selectedFragrance?.name}\n` +
      `💍 *Keepsake:* ${selectedKeepsake?.name}\n` +
      `🎁 *Trunk Box:* ${selectedTrunkTheme.name}\n` +
      `💰 *Combo Price:* ₹${bundlePrice} (15% Off)\n\n` +
      `What do you think, should I order this combination?`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Studio Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>The Arabians Bespoke Gifting Studio</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
          Curate a Bespoke Nikah & Sunnah Gift Hamper
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Tailor an imperial velvet presentation trunk for grooms, Nikah solemnization, or Eid family blessings.
        </p>
      </div>

      {/* 1. OCCASION-FIRST QUICK START PRESETS (Human Gifting Intent) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-500/30 shadow-sm space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-amber-600" />
            <span>1. What is the occasion? (1-Tap Auto-Curate)</span>
          </span>
          <span className="text-slate-500 text-[11px]">Select a theme to auto-fill matching items, or customize freely</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => applyOccasionPreset('groom')}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-1.5 ${
              activeOccasion === 'groom'
                ? 'border-amber-500 bg-amber-50 shadow-sm ring-2 ring-amber-400'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base">👑</span>
              {activeOccasion === 'groom' && <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />}
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 leading-tight">Royal Groom Nikah</div>
              <div className="text-[10px] text-slate-500">White Thobe + Oud + Nikah Nama</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyOccasionPreset('eid')}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-1.5 ${
              activeOccasion === 'eid'
                ? 'border-amber-500 bg-amber-50 shadow-sm ring-2 ring-amber-400'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base">🌙</span>
              {activeOccasion === 'eid' && <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />}
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 leading-tight">Eid Family Blessing</div>
              <div className="text-[10px] text-slate-500">Signature Thobe + Musk + Talbina</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyOccasionPreset('shifa')}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-1.5 ${
              activeOccasion === 'shifa'
                ? 'border-amber-500 bg-amber-50 shadow-sm ring-2 ring-amber-400'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base">🌿</span>
              {activeOccasion === 'shifa' && <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />}
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 leading-tight">Prophetic Shifa & Health</div>
              <div className="text-[10px] text-slate-500">Sidr Honey + Bakhoor + Thobe</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => { setActiveOccasion('custom'); showToast('Custom Studio Mode active!'); }}
            className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between gap-1.5 ${
              activeOccasion === 'custom'
                ? 'border-amber-500 bg-amber-50 shadow-sm ring-2 ring-amber-400'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base">🎨</span>
              {activeOccasion === 'custom' && <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />}
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 leading-tight">Custom Build</div>
              <div className="text-[10px] text-slate-500">Pick any item from catalog</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. STEP PROGRESS WIZARD BAR */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-4 gap-1 sm:gap-3 text-center">
          
          <button
            type="button"
            onClick={() => goToStep(1)}
            className={`py-2 px-1 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              currentStep === 1
                ? 'bg-slate-950 text-white font-bold shadow'
                : selectedThobe ? 'bg-amber-50 text-amber-950 font-semibold' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
              currentStep === 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
            }`}>
              1
            </span>
            <span className="text-[11px] sm:text-xs truncate">1. Royal Thobe</span>
          </button>

          <button
            type="button"
            onClick={() => goToStep(2)}
            className={`py-2 px-1 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              currentStep === 2
                ? 'bg-slate-950 text-white font-bold shadow'
                : selectedFragrance ? 'bg-amber-50 text-amber-950 font-semibold' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
              currentStep === 2 ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
            }`}>
              2
            </span>
            <span className="text-[11px] sm:text-xs truncate">2. Fragrance</span>
          </button>

          <button
            type="button"
            onClick={() => goToStep(3)}
            className={`py-2 px-1 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              currentStep === 3
                ? 'bg-slate-950 text-white font-bold shadow'
                : selectedKeepsake ? 'bg-amber-50 text-amber-950 font-semibold' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
              currentStep === 3 ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
            }`}>
              3
            </span>
            <span className="text-[11px] sm:text-xs truncate">3. Keepsake</span>
          </button>

          <button
            type="button"
            onClick={() => goToStep(4)}
            className={`py-2 px-1 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
              currentStep === 4
                ? 'bg-slate-950 text-white font-bold shadow'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
              currentStep === 4 ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
            }`}>
              4
            </span>
            <span className="text-[11px] sm:text-xs truncate">4. Trunk & Card</span>
          </button>

        </div>
      </div>

      {/* ACTIVE STEP CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Active Step Screen (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* ======================================================== */}
          {/* STEP 1: CHOOSE THOBE */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Step 1: Select Royal Men's Thobe ({thobeOptions.length} available)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tailored standing collars & breathable fabric from our live store inventory.
                  </p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-56">
                  <input
                    type="text"
                    placeholder="Search thobes..."
                    value={stepSearch}
                    onChange={(e) => setStepSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredThobes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedThobe(t)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition flex items-center gap-3 relative ${
                      selectedThobe?.id === t.id
                        ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-400'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img src={t.image} alt="" className="w-16 h-16 rounded-xl object-contain bg-slate-50 border p-1 shrink-0" />
                    <div className="min-w-0 flex-1">
                      {t.badge && (
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                          {t.badge}
                        </span>
                      )}
                      <div className="font-bold text-xs text-slate-900 line-clamp-2 mt-1">{t.name}</div>
                      <div className="font-mono text-xs font-bold text-emerald-800 mt-1">₹{t.price}</div>
                    </div>
                    {selectedThobe?.id === t.id && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Size Selector */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Choose Recipient's Size:</span>
                  <span className="text-emerald-700 font-semibold">100% Free Doorstep Replacement</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["52", "54", "56", "58", "60"].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedThobeSize(sz)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        selectedThobeSize === sz
                          ? 'bg-slate-950 text-white shadow ring-2 ring-amber-400'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Size {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wizard Nav Button */}
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 transition shadow-gold flex items-center gap-2"
                >
                  <span>Next: Choose Fragrance →</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: CHOOSE FRAGRANCE */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Step 2: Choose Sacred Fragrance or Bakhoor ({fragranceOptions.length} available)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aged pure Dehnul Oud, non-alcoholic royal attars, and incense burners.
                  </p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-56">
                  <input
                    type="text"
                    placeholder="Search fragrance..."
                    value={stepSearch}
                    onChange={(e) => setStepSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Fragrance Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredFragrances.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFragrance(f)}
                    className={`p-3.5 rounded-2xl border-2 text-center transition flex flex-col justify-between space-y-2 relative ${
                      selectedFragrance?.id === f.id
                        ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-400'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img src={f.image} alt="" className="w-20 h-20 mx-auto rounded-xl object-contain bg-slate-50 border p-1" />
                    <div>
                      {f.badge && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {f.badge}
                        </span>
                      )}
                      <div className="font-bold text-xs text-slate-900 mt-1 line-clamp-2">{f.name}</div>
                      <div className="font-mono text-xs font-bold text-amber-800 mt-1">₹{f.price}</div>
                    </div>
                    {selectedFragrance?.id === f.id && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Wizard Nav Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Thobes</span>
                </button>

                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 transition shadow-gold flex items-center gap-2"
                >
                  <span>Next: Choose Keepsake →</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: CHOOSE KEEPSAKE */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Step 3: Add Keepsake or Prophetic Superfood ({filteredKeepsakes.length} available)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nikah certificate booklets, sprouted barley Talbina, Sidr honey, or Islamic decor.
                  </p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-56">
                  <input
                    type="text"
                    placeholder="Search keepsakes..."
                    value={stepSearch}
                    onChange={(e) => setStepSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Sub-Category Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setKeepsakeFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                    keepsakeFilter === 'all' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Items
                </button>
                <button
                  type="button"
                  onClick={() => setKeepsakeFilter('wedding')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                    keepsakeFilter === 'wedding' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  💍 Nikah Keepsakes
                </button>
                <button
                  type="button"
                  onClick={() => setKeepsakeFilter('health')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                    keepsakeFilter === 'health' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🥣 Sunnah Superfoods (Talbina/Honey)
                </button>
                <button
                  type="button"
                  onClick={() => setKeepsakeFilter('decor')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                    keepsakeFilter === 'decor' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🕌 Islamic Home Decor
                </button>
              </div>

              {/* Keepsakes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredKeepsakes.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setSelectedKeepsake(k)}
                    className={`p-3.5 rounded-2xl border-2 text-center transition flex flex-col justify-between space-y-2 relative ${
                      selectedKeepsake?.id === k.id
                        ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-400'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img src={k.image} alt="" className="w-20 h-20 mx-auto rounded-xl object-contain bg-slate-50 border p-1" />
                    <div>
                      {k.badge && (
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                          {k.badge}
                        </span>
                      )}
                      <div className="font-bold text-xs text-slate-900 mt-1 line-clamp-2">{k.name}</div>
                      <div className="font-mono text-xs font-bold text-emerald-800 mt-1">₹{k.price}</div>
                    </div>
                    {selectedKeepsake?.id === k.id && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Wizard Nav Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Fragrance</span>
                </button>

                <button
                  type="button"
                  onClick={() => goToStep(4)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 transition shadow-gold flex items-center gap-2"
                >
                  <span>Next: Trunk & Card →</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 4: GREETING CARD, TRUNK THEME & PACKAGING */}
          {/* ======================================================== */}
          {currentStep === 4 && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Step 4: Velvet Trunk Presentation & Calligraphy Card
                </h3>
                <p className="text-xs text-slate-500">
                  Select your luxury velvet trunk finish, satin ribbon, and personalized card inscription.
                </p>
              </div>

              {/* Velvet Trunk Color Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-600" />
                  <span>Choose Velvet Trunk Finish:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {TRUNK_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTrunkTheme(theme)}
                      className={`p-3 rounded-2xl border-2 text-left transition flex items-center justify-between ${
                        selectedTrunkTheme.id === theme.id
                          ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-1 ring-amber-400'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">{theme.name.split('&')[0]}</div>
                        <div className="text-[10px] text-slate-500">{theme.tag}</div>
                      </div>
                      <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${theme.bgClass} border border-amber-400`}></span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Gift Surprise Mode Toggle */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-300 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="directGift"
                  checked={isDirectGift}
                  onChange={(e) => setIsDirectGift(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
                <label htmlFor="directGift" className="text-xs cursor-pointer select-none">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                    <span>Send Directly to Recipient as Surprise? (Invoice Hidden)</span>
                  </div>
                  <div className="text-[11px] text-amber-900/80 mt-0.5">
                    We will hand-wrap the velvet trunk with satin ribbon, affix a golden wax seal, and completely hide price receipts from inside the box.
                  </div>
                </label>
              </div>

              {/* Sacred Add-on: Olive Wood Tasbih */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-300 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="tasbihAddon"
                  checked={includeTasbih}
                  onChange={(e) => setIncludeTasbih(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="tasbihAddon" className="text-xs cursor-pointer select-none flex-1">
                  <div className="flex items-center justify-between font-bold text-emerald-950">
                    <span>Add Handcrafted 33-Bead Natural Olive Wood Tasbih</span>
                    <span className="text-amber-800 font-mono">+₹{TASBIH_PRICE}</span>
                  </div>
                  <div className="text-[11px] text-emerald-900/80 mt-0.5">
                    Hand-carved authentic olive wood tasbih beads nestled inside shredded golden paper.
                  </div>
                </label>
              </div>

              {/* Recipient & Sender Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recipient's Name (To):</label>
                  <input
                    type="text"
                    placeholder="e.g. Brother Mohammed Tariq"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Name / Family (From):</label>
                  <input
                    type="text"
                    placeholder="e.g. Abu Bakr & Family"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Blessing Inscription */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Select Blessing Dua Inscription:</label>
                <div className="space-y-2">
                  {CARD_MESSAGES.map((msg, i) => (
                    <label
                      key={i}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-3 text-xs ${
                        selectedMessage === msg
                          ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-medium'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="blessing"
                        checked={selectedMessage === msg}
                        onChange={() => setSelectedMessage(msg)}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>{msg}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Wizard Nav Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Keepsakes</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyHamperNow}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 transition shadow-gold flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-slate-950" />
                  <span>Confirm & Buy Hamper (₹{bundlePrice})</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live Velvet Presentation Trunk Visualizer (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          
          <div className={`rounded-3xl bg-gradient-to-br ${selectedTrunkTheme.bgClass} text-white p-5 sm:p-6 border ${selectedTrunkTheme.borderClass} shadow-2xl space-y-4 transition-all duration-500`}>
            
            {/* Trunk Top Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Gift className={`w-5 h-5 ${selectedTrunkTheme.accentColor}`} />
                <div>
                  <h3 className="font-serif text-lg font-bold text-white leading-none">Your Royal Trunk</h3>
                  <span className="text-[10px] text-emerald-200/80">{selectedTrunkTheme.name}</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow">
                15% Combo Off
              </span>
            </div>

            {/* Visual Trunk Unboxing Slots */}
            <div className="space-y-2 text-xs">
              
              {/* Slot 1: Thobe */}
              <div 
                onClick={() => goToStep(1)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer hover:border-amber-400/60 transition group"
              >
                <img src={selectedThobe?.image || "/assets/studio/mens_white_thobe.jpg"} alt="" className="w-12 h-12 rounded-lg object-contain bg-white/5 p-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-amber-400 font-bold uppercase flex items-center justify-between">
                    <span>👑 Royal Thobe</span>
                    <span className="text-[9px] text-emerald-300 font-normal group-hover:underline">Change ▾</span>
                  </div>
                  <div className="font-bold text-white truncate">{selectedThobe?.name || "Select Thobe"}</div>
                  <div className="text-[10px] text-slate-300">Size {selectedThobeSize} • Tailored Collar</div>
                </div>
                <div className="font-mono text-xs font-bold text-amber-400">₹{selectedThobe?.price || 1499}</div>
              </div>

              {/* Slot 2: Fragrance */}
              <div 
                onClick={() => goToStep(2)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer hover:border-amber-400/60 transition group"
              >
                <img src={selectedFragrance?.image || "/assets/studio/dehnul_oud_pure.jpg"} alt="" className="w-12 h-12 rounded-lg object-contain bg-white/5 p-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-amber-400 font-bold uppercase flex items-center justify-between">
                    <span>🌿 Sacred Fragrance</span>
                    <span className="text-[9px] text-emerald-300 font-normal group-hover:underline">Change ▾</span>
                  </div>
                  <div className="font-bold text-white truncate">{selectedFragrance?.name || "Select Fragrance"}</div>
                  <div className="text-[10px] text-slate-300">Sacred Agarwood Extract</div>
                </div>
                <div className="font-mono text-xs font-bold text-amber-400">₹{selectedFragrance?.price || 999}</div>
              </div>

              {/* Slot 3: Keepsake */}
              <div 
                onClick={() => goToStep(3)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer hover:border-amber-400/60 transition group"
              >
                <img src={selectedKeepsake?.image || "/assets/studio/nikah_nama_booklet.jpg"} alt="" className="w-12 h-12 rounded-lg object-contain bg-white/5 p-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-amber-400 font-bold uppercase flex items-center justify-between">
                    <span>💍 Keepsake / Superfood</span>
                    <span className="text-[9px] text-emerald-300 font-normal group-hover:underline">Change ▾</span>
                  </div>
                  <div className="font-bold text-white truncate">{selectedKeepsake?.name || "Select Keepsake"}</div>
                  <div className="text-[10px] text-slate-300">Heirloom Tradition</div>
                </div>
                <div className="font-mono text-xs font-bold text-amber-400">₹{selectedKeepsake?.price || 999}</div>
              </div>

              {/* Slot 4: Optional Olive Wood Tasbih */}
              {includeTasbih && (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-lg pl-1">📿</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-amber-300 font-bold uppercase">Sunnah Add-On</div>
                    <div className="font-bold text-white text-xs truncate">Handcrafted 33-Bead Olive Wood Tasbih</div>
                  </div>
                  <div className="font-mono text-xs font-bold text-amber-400">₹{TASBIH_PRICE}</div>
                </div>
              )}

            </div>

            {/* Direct Gift Dispatch Badge */}
            {isDirectGift && (
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-[11px] flex items-center gap-2 text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Gift Surprise: Price invoice hidden • Golden Wax Seal attached.</span>
              </div>
            )}

            {/* Pricing Breakdown */}
            <div className="pt-2 border-t border-white/10 space-y-1 text-xs">
              <div className="flex justify-between text-white/70">
                <span>Items Subtotal:</span>
                <span className="line-through">₹{itemsSubtotal + (includeTasbih ? TASBIH_PRICE : 0)}</span>
              </div>
              <div className="flex justify-between text-amber-300 font-semibold">
                <span>Bespoke 15% Combo Off:</span>
                <span>-₹{bundleDiscount}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Velvet Presentation Trunk & Ribbon:</span>
                <span className="text-amber-400 font-bold">FREE (₹450 Value)</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10">
                <span>Hamper Price:</span>
                <span className="font-serif text-2xl text-amber-400">₹{bundlePrice}</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleBuyHamperNow}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 transition shadow-gold flex items-center justify-center gap-2 active:scale-95"
              >
                <Zap className="w-4 h-4 text-slate-950" />
                <span>Buy Hamper Now (₹{bundlePrice})</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddHamperToCart}
                  className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleWhatsAppHamper}
                  className="py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-950" />
                  <span>WhatsApp Order</span>
                </button>
              </div>

              {/* Family WhatsApp Consultation Button */}
              <button
                type="button"
                onClick={handleShareWithFamily}
                className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
                title="Send preview to family or fiance on WhatsApp to get their opinion"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>📲 Share with Family on WhatsApp for Advice</span>
              </button>
            </div>

            {/* Trust Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-amber-400" /> 100% Halal Verified</span>
              <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-amber-400" /> Free Pan-India Courier</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
