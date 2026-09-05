import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Calendar, MapPin, MessageSquare, Check, HelpCircle, Edit3, Award } from 'lucide-react';

/**
 * Checks if a product qualifies for custom engraving / personalization
 */
export function isProductCustomizable(product) {
  if (!product) return false;
  if (product.isCustomizable === true) return true;
  if (product.category === 'wedding') return true;
  
  const name = (product.name || '').toLowerCase();
  const id = (product.id || '').toLowerCase();
  
  if (name.includes('custom') || name.includes('personalized') || name.includes('nameplate') || name.includes('engraved')) {
    return true;
  }
  if (id.includes('nameplate') || id.includes('nikah') || id.includes('custom')) {
    return true;
  }
  
  return false;
}

/**
 * PersonalizationStudio component for Wedding, Nikah & Custom Keepsakes
 */
export default function PersonalizationStudio({ product, onChange, initialValue = null }) {
  const isWedding = product?.category === 'wedding' || (product?.name || '').toLowerCase().includes('nikah');

  const [groomName, setGroomName] = useState(initialValue?.groomName || '');
  const [brideName, setBrideName] = useState(initialValue?.brideName || '');
  const [customText, setCustomText] = useState(initialValue?.customText || '');
  const [eventDate, setEventDate] = useState(initialValue?.eventDate || '');
  const [cityVenue, setCityVenue] = useState(initialValue?.cityVenue || '');
  const [specialNotes, setSpecialNotes] = useState(initialValue?.specialNotes || '');
  const [shareLaterOnWhatsApp, setShareLaterOnWhatsApp] = useState(initialValue?.shareLaterOnWhatsApp || false);

  // Notify parent whenever fields change
  useEffect(() => {
    const hasData = shareLaterOnWhatsApp || 
      (isWedding ? (groomName.trim() || brideName.trim() || eventDate || cityVenue || specialNotes.trim()) 
                 : (customText.trim() || specialNotes.trim()));

    if (!hasData) {
      onChange(null);
      return;
    }

    const payload = {
      isWedding,
      shareLaterOnWhatsApp,
      groomName: groomName.trim(),
      brideName: brideName.trim(),
      customText: customText.trim(),
      eventDate: eventDate,
      cityVenue: cityVenue.trim(),
      specialNotes: specialNotes.trim(),
      summary: shareLaterOnWhatsApp 
        ? 'Will share details directly on WhatsApp'
        : isWedding
          ? `${groomName.trim() || 'Dulha'} & ${brideName.trim() || 'Dulhan'}${eventDate ? ` • ${eventDate}` : ''}`
          : (customText.trim() || 'Custom Inscription')
    };

    onChange(payload);
  }, [groomName, brideName, customText, eventDate, cityVenue, specialNotes, shareLaterOnWhatsApp, isWedding]);

  if (!isProductCustomizable(product)) {
    return null;
  }

  return (
    <div className="rounded-2xl border-2 border-amber-400/60 bg-gradient-to-br from-[#faf8f3] via-amber-50/40 to-[#f4eee1] p-4 sm:p-5 shadow-sm space-y-4">
      
      {/* Header Banner */}
      <div className="flex items-start justify-between gap-3 border-b border-amber-300/40 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-sm shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-serif font-black text-sm text-slate-950">
                {isWedding ? 'Royal Nikah Customization Studio' : 'Custom Engraving & Nameplate Details'}
              </h4>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-500 text-slate-950 shadow-xs">
                Free Included
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {isWedding 
                ? 'Names and Nikah date will be hand-embossed with gold foil / calligraphy.' 
                : 'Enter your family name or custom lettering to be precision laser-cut.'}
            </p>
          </div>
        </div>
      </div>

      {/* Share Later Toggle */}
      <div className="bg-white/80 border border-amber-200 rounded-xl p-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-slate-800">Share details on WhatsApp later?</span>
            <p className="text-[10px] text-slate-500">Order now and send Urdu spellings, date, or card photos via WhatsApp chat.</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input 
            type="checkbox" 
            checked={shareLaterOnWhatsApp} 
            onChange={(e) => setShareLaterOnWhatsApp(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      {!shareLaterOnWhatsApp ? (
        <div className="space-y-3 pt-1">
          {isWedding ? (
            <>
              {/* Bride & Groom Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-xs text-slate-800 mb-1 flex items-center gap-1">
                    <span>👑 Dulha (Groom) Name:</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    placeholder="e.g. Mohammad Imran"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300/80 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block font-bold text-xs text-slate-800 mb-1 flex items-center gap-1">
                    <span>💍 Dulhan (Bride) Name:</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    placeholder="e.g. Sarah Fatima"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300/80 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-inner"
                  />
                </div>
              </div>

              {/* Date & Venue Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-xs text-slate-800 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-700" />
                    <span>Nikah / Event Date:</span>
                  </label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="e.g. 15 November 2026"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300/80 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block font-bold text-xs text-slate-800 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-700" />
                    <span>City / Function Venue:</span>
                  </label>
                  <input
                    type="text"
                    value={cityVenue}
                    onChange={(e) => setCityVenue(e.target.value)}
                    placeholder="e.g. Hyderabad / Royal Palace"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300/80 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-inner"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Non-Wedding Custom text */
            <div>
              <label className="block font-bold text-xs text-slate-800 mb-1 flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                <span>Custom Name / Inscription:</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. The Hashmi Family / Al-Madina House"
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300/80 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-inner"
              />
            </div>
          )}

          {/* Calligraphy Notes / Special Instructions */}
          <div>
            <label className="block font-bold text-[11px] text-slate-700 mb-1 flex items-center gap-1">
              <span>✍️ Special Calligraphy Notes / Urdu Spellings (Optional):</span>
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Please write in Nastaliq Urdu calligraphy, Gold foil border"
              className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300/80 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Live Preview Ribbon */}
          {(groomName || brideName || customText || eventDate) && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border border-amber-500/40 shadow-md">
              <div className="flex items-center justify-between text-[10px] text-amber-300 uppercase tracking-widest font-mono pb-1 border-b border-amber-500/30">
                <span>✦ Live Embossing Preview</span>
                <span className="text-emerald-400 font-bold">Verified Sunnah Standard</span>
              </div>
              <div className="pt-2 text-center">
                {isWedding ? (
                  <div className="space-y-0.5">
                    <div className="font-serif text-sm sm:text-base font-bold text-amber-200 tracking-wide flex items-center justify-center gap-1.5">
                      <span>{groomName || 'Dulha Name'}</span>
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                      <span>{brideName || 'Dulhan Name'}</span>
                    </div>
                    {eventDate && (
                      <div className="text-[11px] text-slate-300 font-sans">
                        🗓️ {eventDate} {cityVenue ? `• ${cityVenue}` : ''}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="font-serif text-sm font-bold text-amber-200">
                    {customText || 'Custom Name'}
                  </div>
                )}
                {specialNotes && (
                  <div className="text-[10px] text-amber-300/80 italic mt-1 font-mono">
                    Note: "{specialNotes}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reassurance badge */}
          <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-100/70 px-3 py-1.5 rounded-lg border border-emerald-300/50 font-medium">
            <Award className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Our team will send a digital mockup on WhatsApp before embossing to ensure 100% spelling accuracy!</span>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2.5">
          <Check className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>No problem! After ordering, we will connect with you on WhatsApp to collect names, card designs, and date.</span>
        </div>
      )}

    </div>
  );
}
