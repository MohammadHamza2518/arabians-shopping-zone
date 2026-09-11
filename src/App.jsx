import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ScrollToTop from './components/ScrollToTop';

// Dedicated Full Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackPage from './pages/TrackPage';
import DistributorPage from './pages/DistributorPage';
import ContactPage from './pages/ContactPage';
import PolicyPage from './pages/PolicyPage';
import AdminPage from './pages/AdminPage';
import HamperBuilderPage from './pages/HamperBuilderPage';
import ReviewsPage from './pages/ReviewsPage';
import StoreLocatorPage from './pages/StoreLocatorPage';
import SuspensionNotice from './components/SuspensionNotice';
import { useStore } from './context/StoreContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

function AppContent() {
  const { toast } = useStore();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const [isSuspended, setIsSuspended] = React.useState(null);

  React.useEffect(() => {
    // 1. Check if dev_pass is in current URL query or hash
    const params = new URLSearchParams(window.location.search);
    const hashSplit = window.location.hash.split('?');
    const hashParams = new URLSearchParams(hashSplit[1] || '');
    const devPass = params.get('dev_pass') || hashParams.get('dev_pass');

    // If explicit dev bypass in URL, allow through
    if (devPass === 'hamza786') {
      setIsSuspended(false);
      return;
    }

    // Otherwise clear any leftover bypass and enforce system status
    try {
      localStorage.removeItem('dev_pass');
    } catch(e) {}

    // 2. Check server system status
    fetch('/api/system-status')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.suspended) {
          setIsSuspended(true);
        } else {
          setIsSuspended(false);
        }
      })
      .catch(() => {
        setIsSuspended(false);
      });
  }, []);

  if (isSuspended) {
    return <SuspensionNotice onUnlocked={() => setIsSuspended(false)} />;
  }

  // Completely isolated Admin Portal Layout (Zero Customer Storefront Clutter)
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#070d12] text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-black">
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>

        {/* Global Toast inside Admin */}
        {toast && (
          <div className="fixed top-4 right-4 z-[9999] animate-bounce">
            <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm font-semibold text-white ${
              toast.type === 'error' 
                ? 'bg-rose-900/90 border-rose-500 text-rose-100' 
                : toast.type === 'info'
                ? 'bg-slate-900/90 border-slate-700 text-slate-200'
                : 'bg-emerald-900/90 border-amber-500/40 text-emerald-100'
            }`}>
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-slate-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Public Customer Storefront Layout
  return (
    <div className="min-h-screen flex flex-col bg-[#021812] text-slate-800 selection:bg-amber-200 selection:text-amber-900">
      <ScrollToTop />
      
      {/* Global Navigation Header */}
      <Header />

      {/* Dedicated Route Views */}
      <main className="flex-1 bg-[#faf8f5]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/distributor" element={<DistributorPage />} />
          <Route path="/dealership" element={<DistributorPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shipping-policy" element={<PolicyPage />} />
          <Route path="/return-policy" element={<PolicyPage />} />
          <Route path="/privacy-policy" element={<PolicyPage />} />
          <Route path="/terms" element={<PolicyPage />} />
          <Route path="/about" element={<PolicyPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/hamper" element={<HamperBuilderPage />} />
          <Route path="/hamper-builder" element={<HamperBuilderPage />} />
          <Route path="/gift-builder" element={<HamperBuilderPage />} />
          <Route path="/store" element={<StoreLocatorPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating 24/7 WhatsApp Quick Assistant */}
      <FloatingWhatsApp />

      {/* Mobile Sticky Navigation */}
      <MobileBottomNav />

      {/* Global Notification Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-semibold text-white ${
            toast.type === 'error' 
              ? 'bg-rose-700 border-rose-500' 
              : toast.type === 'info'
              ? 'bg-slate-900 border-slate-700'
              : 'bg-gradient-to-r from-emerald-800 to-[#032219] border-amber-500/40'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-300" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-slate-300" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

