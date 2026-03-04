import { useState, useEffect } from "react";
import { ChevronUp, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useCartStore } from "@/stores/cartStore";

export default function BackToTop() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

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

  const showCart = totalItems > 0;

  return (
    <>
      {/* Floating Cart Button — mobile only, always visible when cart has items */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed right-8 z-40 md:hidden"
            style={{ bottom: showBackToTop ? "5.5rem" : "2rem" }}
          >
            <motion.div
              animate={{ bottom: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Button
                onClick={() => setDrawerOpen(true)}
                size="icon"
                className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-insecap-cyan hover:bg-insecap-cyan/90 text-white w-12 h-12 relative"
                aria-label="Ver carrito"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-insecap-blue text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 right-8 z-40"
          >
            <Button
              onClick={scrollToTop}
              size="icon"
              className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
              aria-label="Volver al tope"
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
