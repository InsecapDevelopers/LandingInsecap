import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { isCapinChatEnabled } from "@/lib/featureFlags";

export default function BackToTop() {
  const { t } = useTranslation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  const toggleVisibility = () => {
    setShowBackToTop(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`fixed right-8 z-40 ${isCapinChatEnabled ? 'bottom-32' : 'bottom-8'}`}
          >
            <motion.div whileHover={{ scale: 1.1, y: -3 }} whileTap={{ scale: 0.92 }}>
              <Button
                onClick={scrollToTop}
                size="icon"
                className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-shadow duration-300 bg-primary hover:bg-primary/90 group"
                aria-label={t('aria.backToTop')}
              >
                <ChevronUp className="!h-7 !w-7 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
