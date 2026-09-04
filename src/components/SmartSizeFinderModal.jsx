import React, { useState } from 'react';
import { X, Ruler, Check, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export default function SmartSizeFinderModal({ isOpen, onClose, onSelectSize, currentSelectedSize }) {
  if (!isOpen) return null;

  const HEIGHT_OPTIONS = [
    { label: "5'2\" - 5'4\" (158-163 cm)", size: "52", detail: "Short Length" },
    { label: "5'5\" - 5'7\" (165-170 cm)", size: "54", detail: "Medium Length" },
    { label: "5'8\" - 5'10\" (172-178 cm)", size: "56", detail: "Standard Fit (Most Popular)", popular: true },
    { label: "5'11\" - 6'1\" (180-185 cm)", size: "58", detail: "Tall Length" },
    { label: "6'2\" - 6'4\" (188-193 cm)", size: "60", detail: "Extra Tall" }
  ];

  const BUILD_OPTIONS = [
    { id: "slim", label: "Slim Build", desc: "Chest 36-38\" • Tailored fit" },
    { id: "regular", label: "Regular Build", desc: "Chest 40-42\" • Standard drape", default: true },
    { id: "broad", label: "Broad / Relaxed", desc: "Chest 44-46\" • Relaxed comfort" }
  ];

  const [selectedHeight, setSelectedHeight] = useState("56");
  const [selectedBuild, setSelectedBuild] = useState("regular");

  const handleApply = () => {
    onSelectSize(selectedHeight);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-amber-500/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1 text-center sm:text-left pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Saudi Royal Attire Fit Calculator</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-black text-slate-900">
            Thobe Smart Size Finder
          </h3>
          <p className="text-xs text-slate-600">
            Select your height and body build to calculate your exact Saudi/Emirati Jubba size.
          </p>
        </div>

        {/* Step 1: Height Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-amber-600" />
            <span>1. What is your height?</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {HEIGHT_OPTIONS.map((h) => (
              <button
                key={h.size}
                type="button"
                onClick={() => setSelectedHeight(h.size)}
                className={`p-3 rounded-xl text-left border transition text-xs flex items-center justify-between ${
                  selectedHeight === h.size
                    ? 'border-amber-500 bg-amber-50/70 shadow-sm ring-1 ring-amber-400'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900">Size {h.size}</div>
                  <div className="text-[11px] text-slate-500">{h.label}</div>
                </div>
                {selectedHeight === h.size && (
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Build Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800">
            <span>2. What is your body build?</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {BUILD_OPTIONS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBuild(b.id)}
                className={`p-2.5 rounded-xl text-center border transition text-xs ${
                  selectedBuild === b.id
                    ? 'border-amber-500 bg-amber-50/70 shadow-sm ring-1 ring-amber-400'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-bold text-slate-900">{b.label}</div>
                <div className="text-[10px] text-slate-500 truncate">{b.desc.split('•')[0]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Result Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#021812] to-emerald-950 text-white border border-amber-500/40 shadow-inner space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-200">Recommended Saudi Fit:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
              100% Guaranteed
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-black text-amber-400">
              Size {selectedHeight}
            </span>
            <span className="text-xs text-emerald-100/90 font-medium">
              ({selectedBuild === 'slim' ? 'Slim Fit' : selectedBuild === 'broad' ? 'Relaxed Fit' : 'Regular Tailored Cut'})
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-200/80 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Free doorstep size replacement if length or chest does not fit.</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 transition shadow-gold flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Apply Size {selectedHeight} to Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
