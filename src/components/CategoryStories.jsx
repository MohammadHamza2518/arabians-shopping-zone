import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const DEFAULT_STORIES = [
  {
    id: 'wearing',
    name: "Men's Wear",
    image: '/assets/studio/mens_white_thobe.jpg',
    link: '/shop?category=wearing'
  },
  {
    id: 'health',
    name: 'Healthy',
    image: '/assets/products/talbeena_boxes_group.jpg',
    link: '/shop?category=health'
  },
  {
    id: 'fragrance',
    name: 'Fragrance',
    image: '/assets/categories/fragrance_mukh_malaki.jpg',
    link: '/shop?category=fragrance'
  },
  {
    id: 'decor',
    name: 'Home Decor',
    image: '/assets/categories/decor_islamic_wall_clock.jpg',
    link: '/shop?category=decor'
  },
  {
    id: 'wedding',
    name: 'Muslim Wedding',
    image: '/assets/categories/wedding_nikah_frame.jpg',
    link: '/shop?category=wedding'
  },
  {
    id: 'skincare',
    name: 'Skin Care',
    image: '/assets/categories/skincare_kashmiri_herbs.jpg',
    link: '/shop?category=skincare'
  }
];

const STORY_DISPLAY_MAP = {
  wearing: {
    name: "Men's Wear",
    image: '/assets/studio/mens_white_thobe.jpg'
  },
  health: {
    name: 'Healthy',
    image: '/assets/products/talbeena_boxes_group.jpg'
  },
  fragrance: {
    name: 'Fragrance',
    image: '/assets/categories/fragrance_mukh_malaki.jpg'
  },
  decor: {
    name: 'Home Decor',
    image: '/assets/categories/decor_islamic_wall_clock.jpg'
  },
  wedding: {
    name: 'Muslim Wedding',
    image: '/assets/categories/wedding_nikah_frame.jpg'
  },
  skincare: {
    name: 'Skin Care',
    image: '/assets/categories/skincare_kashmiri_herbs.jpg'
  }
};

export default function CategoryStories() {
  const { categories } = useStore();

  // Combine dynamic categories with spotlight items
  const stories = React.useMemo(() => {
    if (!categories || categories.length === 0) return DEFAULT_STORIES;

    // Map store categories
    return categories.map(cat => {
      const fallback = STORY_DISPLAY_MAP[cat.id] || {};
      const displayName = cat.shortName || cat.name || fallback.name;
      const displayImage = cat.image || fallback.image || '/assets/logo/logo_main.png';

      return {
        id: cat.id,
        name: displayName,
        image: displayImage,
        link: `/shop?category=${cat.id}`,
        fallbackImage: fallback.image || '/assets/logo/logo_main.png'
      };
    });
  }, [categories]);

  return (
    <section aria-label="Category Stories" className="bg-[#faf8f5] pt-4 pb-2 sm:pt-5 sm:pb-3 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div 
          className="flex items-start gap-3.5 sm:gap-6 overflow-x-auto no-scrollbar justify-start sm:justify-center py-1 px-1" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {stories.map((story) => (
            <Link
              key={story.id}
              to={story.link}
              className="flex flex-col items-center shrink-0 group focus:outline-none w-[90px] sm:w-[110px] text-center"
            >
              {/* Luxury Gold Story Ring with Soft Halo */}
              <div className="relative mb-1.5 flex justify-center">
                <div className="w-[76px] h-[76px] sm:w-[90px] sm:h-[90px] rounded-full p-[2.5px] bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 shadow-md group-hover:shadow-[0_6px_20px_rgba(217,119,6,0.4)] group-hover:scale-105 transition-all duration-300">
                  <div className="w-full h-full rounded-full bg-[#faf8f5] p-[2px] overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                      loading="eager"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = story.fallbackImage || '/assets/logo/logo_main.png';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Title with Balanced Height Alignment */}
              <div className="w-full text-center mt-0.5 px-0.5">
                <span className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-amber-700 transition-colors leading-tight min-h-[32px] sm:min-h-[36px] flex items-center justify-center">
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
