import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchPopupBanner, PopupBannerData } from '@/lib/shopify';

/**
 * PromoPopup Component
 * 
 * Displays a promotional popup with an image managed through Shopify.
 * 
 * For non-technical users to update:
 * 1. Go to Shopify Admin (admin.shopify.com)
 * 2. Navigate to: Online Store > Pages
 * 3. Edit (or create) the page with handle "popup-descuentos"
 * 4. Upload/change the promotional image in the page content
 * 5. Publish the page to show the popup, unpublish to hide it
 * 
 * The popup will appear every time a user enters the site.
 */
const PromoPopup = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [bannerData, setBannerData] = useState<PopupBannerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const data = await fetchPopupBanner();
        if (data) {
          setBannerData(data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error loading popup banner:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBanner();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleImageClick = () => {
    setIsOpen(false);
    navigate('/cursos');
  };

  // Don't render anything while loading or if there's no banner
  if (isLoading || !bannerData) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute -top-4 -right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Cerrar popup"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>

            {/* Image - Clickable to navigate to courses catalog */}
            <div 
              className="relative rounded-lg overflow-hidden shadow-2xl cursor-pointer hover:opacity-95 transition-opacity"
              onClick={handleImageClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleImageClick();
                }
              }}
            >
              <img
                src={bannerData.imageUrl}
                alt={bannerData.altText}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromoPopup;
