import React, { useState } from 'react';
import { ShieldAlert, Server, Lock, KeyRound } from 'lucide-react';

export default function SuspensionNotice({ onUnlocked }) {
  const [showDevModal, setShowDevModal] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleDevUnlock = async (e) => {
    e.preventDefault();
    if (!secretInput.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/system-control?secret=${encodeURIComponent(secretInput.trim())}&action=unlock`);
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('dev_pass', 'hamza786');
        setSuccessMsg('System restored successfully! Reloading...');
        setTimeout(() => {
          if (onUnlocked) onUnlocked();
          window.location.reload();
        }, 1000);
      } else {
        setErrorMsg(data.error || 'Invalid developer credentials.');
      }
    } catch (err) {
      if (secretInput.trim() === 'hamza786') {
        localStorage.setItem('dev_pass', 'hamza786');
        if (onUnlocked) onUnlocked();
        window.location.reload();
      } else {
        setErrorMsg('Network error or invalid credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-xl w-full bg-[#0f172a] border border-red-600/80 rounded-2xl shadow-2xl shadow-red-950/40 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-red-800 to-rose-900 px-5 py-3 text-white flex items-center justify-between text-xs sm:text-sm font-semibold tracking-wider">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-200"></span>
            </span>
            <span>HOSTING & CLOUD INFRASTRUCTURE SUSPENDED</span>
          </div>
          <span className="font-mono bg-red-950/60 px-2 py-0.5 rounded border border-red-400/20 text-xs">
            HTTP 502 / 503
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-5 text-red-500 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
            Website Service Suspended
          </h1>
          <p className="text-sm font-medium text-rose-400 mb-6 flex items-center gap-1.5">
            <Server className="w-4 h-4" /> Cloud Hosting & Server Maintenance Renewal Required
          </p>

          <div className="bg-slate-800/80 border-l-4 border-red-500 p-4 rounded-r-xl text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed space-y-2">
            <p>
              <strong className="text-white">Notice to Account Holder:</strong> This web application and its connected cloud database cluster have been temporarily deactivated due to pending server hosting, domain routing, and development maintenance clearance dues.
            </p>
            <p className="text-slate-400">
              Customer checkout, product catalog, and public storefront traffic are held offline until the outstanding hosting dues are settled.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl divide-y divide-slate-800 mb-6 text-xs sm:text-sm">
            <div className="p-3 sm:px-4 flex justify-between items-center">
              <span className="text-slate-400">Application Node:</span>
              <span className="font-mono text-slate-200 font-semibold">Arabians Shopping Zone (Prod-1)</span>
            </div>
            <div className="p-3 sm:px-4 flex justify-between items-center">
              <span className="text-slate-400">Current Status:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
                SUSPENDED • ACTION REQUIRED
              </span>
            </div>
            <div className="p-3 sm:px-4 flex justify-between items-center">
              <span className="text-slate-400">Reason Code:</span>
              <span className="font-mono text-amber-400 text-xs">ERR_HOSTING_SERVER_COST_PENDING</span>
            </div>
            <div className="p-3 sm:px-4 flex justify-between items-center">
              <span className="text-slate-400">Reference ID:</span>
              <span className="font-mono text-slate-300">ASZ-SRV-SUSPENDED-786</span>
            </div>
          </div>

          <div className="bg-[#090e17] border border-amber-500/20 rounded-xl p-4 text-xs sm:text-sm text-slate-400">
            <div className="text-amber-400 font-semibold mb-1.5 flex items-center gap-1.5">
              <span>⚡</span> How to Reactivate
            </div>
            <p className="leading-relaxed">
              Please contact the project developer / system administrator to clear the pending invoice. Service and storefront access will be restored immediately upon payment confirmation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0a0f1d] border-t border-slate-800/80 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <span>Arabians Shopping Zone Node</span>
          <button
            onClick={() => setShowDevModal(true)}
            className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
            title="Developer / Admin Access"
          >
            <Lock className="w-3 h-3" /> Dev Access
          </button>
        </div>
      </div>

      {/* Secret Dev Unlock Modal */}
      {showDevModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-white font-bold mb-3">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <span>Developer Bypass / Restore</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Enter the developer secret key to restore website access or bypass the suspension notice.
            </p>
            <form onSubmit={handleDevUnlock} className="space-y-3">
              <input
                type="password"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                placeholder="Enter secret key..."
                autoFocus
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
              {successMsg && <p className="text-xs text-emerald-400">{successMsg}</p>}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowDevModal(false); setErrorMsg(''); }}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Unlock Website'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
