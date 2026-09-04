import React from 'react';
import { Link } from 'react-router-dom';

const STORIES = [
  {
    id: 'wearing',
    name: "Men's Thobes",
    image: '/assets/studio/mens_white_thobe.jpg',
    link: '/shop?category=wearing'
  },
  {
    id: 'health',
    name: 'Sunnah Talbina',
    image: '/assets/talbina/talbina_vanilla_dryfruits.png',
    link: '/product/talbina-vanilla'
  },
  {
    id: 'fragrance',
    name: 'Dehnul Oud',
    image: '/assets/studio/dehnul_oud_pure.jpg',
    link: '/shop?category=fragrance'
  },
  {
    id: 'bakhoor',
    name: 'Bakhoor Burner',
    image: '/assets/studio/bakhoor_mabkhara.jpg',
    link: '/product/bakhoor-burner-luxury-set'
  },
  {
    id: 'decor',
    name: 'Islamic Decor',
    image: '/assets/studio/ayatul_kursi_tugra.jpg',
    link: '/shop?category=decor'
  },
  {
    id: 'wedding',
    name: 'Nikah Keepsakes',
    image: '/assets/studio/nikah_nama_booklet.jpg',
    link: '/shop?category=wedding'
  },
  {
    id: 'honey',
    name: 'Pure Sidr Honey',
    image: '/assets/studio/honey_mix_dryfruits.jpg',
    link: '/product/honey-mix-dryfruits-royal'
  }
];

export default function CategoryStories() {
  return (
    <section aria-label="Category Stories" className="bg-[#faf8f5] border-b border-amber-900/10 py-3.5 sm:py-5 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div 
          className="flex items-start gap-3 sm:gap-6 overflow-x-auto no-scrollbar justify-start sm:justify-center py-1 px-1" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {STORIES.map((story) => (
            <Link
              key={story.id}
              to={story.link}
              className="flex flex-col items-center shrink-0 group focus:outline-none w-[76px] sm:w-[94px] text-center"
            >
              {/* Luxury Gold Story Ring with Soft Halo */}
              <div className="relative mb-1.5 flex justify-center">
                <div className="w-[62px] h-[62px] sm:w-[76px] sm:h-[76px] rounded-full p-[2px] bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 shadow-sm group-hover:shadow-[0_4px_16px_rgba(217,119,6,0.35)] group-hover:scale-105 transition-all duration-300">
                  <div className="w-full h-full rounded-full bg-[#faf8f5] p-[2px] overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                      loading="eager"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Title with Balanced Height Alignment (No Truncation) */}
              <div className="w-full text-center mt-0.5">
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-amber-700 transition-colors leading-tight min-h-[28px] sm:min-h-[32px] flex items-center justify-center px-0.5">
                  {story.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
