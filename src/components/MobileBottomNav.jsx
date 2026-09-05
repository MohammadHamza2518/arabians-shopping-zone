import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Truck, LayoutGrid, UserCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { cartCount } = useStore();

  const currentPath = location.pathname;

  const handleNavClick = (targetPath) => {
    if (currentPath === targetPath || (targetPath !== '/' && currentPath.startsWith(targetPath))) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#032219]/95 backdrop-blur-lg border-t border-amber-500/30 px-3 py-2 shadow-2xl">
      <div className="flex items-center justify-around text-slate-300">
        
        {/* Home */}
        <Link 
          to="/"
          onClick={() => handleNavClick('/')}
          className={`flex flex-col items-center gap-1 p-1 active:scale-95 transition ${
            currentPath === '/' ? 'text-amber-400 font-bold' : 'hover:text-amber-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>

        {/* Shop / Catalog */}
        <Link 
          to="/shop"
          onClick={() => handleNavClick('/shop')}
          className={`flex flex-col items-center gap-1 p-1 active:scale-95 transition ${
            currentPath.startsWith('/shop') ? 'text-amber-400 font-bold' : 'hover:text-amber-300'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px]">Catalog</span>
        </Link>

        {/* Track Order */}
        <Link 
          to="/track"
          onClick={() => handleNavClick('/track')}
          className={`flex flex-col items-center gap-1 p-1 active:scale-95 transition ${
            currentPath.startsWith('/track') ? 'text-amber-400 font-bold' : 'hover:text-amber-300'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px]">Track</span>
        </Link>

        {/* Wholesale Dealer */}
        <Link 
          to="/distributor"
          onClick={() => handleNavClick('/distributor')}
          className={`flex flex-col items-center gap-1 p-1 active:scale-95 transition ${
            currentPath.startsWith('/distributor') ? 'text-amber-400 font-bold' : 'hover:text-amber-300'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span className="text-[10px]">Franchise</span>
        </Link>

        {/* Cart / Checkout */}
        <Link 
          to="/checkout"
          onClick={() => handleNavClick('/checkout')}
          className={`relative flex flex-col items-center gap-1 p-1 active:scale-95 transition ${
            currentPath.startsWith('/checkout') ? 'text-amber-400 font-bold' : 'hover:text-amber-300'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </Link>

      </div>
    </div>
  );
}
