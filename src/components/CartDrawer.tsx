import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  Award,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";

// ─── Componente CartDrawer ────────────────────────────────────────────────────

export const CartDrawer = () => {
  const {
    items,
    isLoading,
    isDrawerOpen,
    updateQuantity,
    removeItem,
    createCheckout,
    getTotalItems,
    getTotalPrice,
    setDrawerOpen,
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleCheckout = async () => {
    try {
      const checkoutUrl = await createCheckout("");
      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank");
        setDrawerOpen(false);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  const canCheckout = items.length > 0 && !isLoading;

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setDrawerOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white hover:bg-white/10"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-insecap-cyan border-0">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="text-insecap-blue">Carrito de Compras</SheetTitle>
          <SheetDescription>
            {totalItems === 0
              ? "Tu carrito está vacío"
              : `${totalItems} curso${totalItems !== 1 ? "s" : ""} en tu carrito`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Tu carrito está vacío</p>
                <p className="text-sm text-muted-foreground">
                  Explora nuestros cursos y agrega los que te interesen
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Área scrollable de items */}
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => {
                    const productImage = item.product.node.images?.edges?.[0]?.node;

                    return (
                      <div
                        key={item.variantId}
                        className="flex gap-4 p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-insecap-blue to-insecap-cyan rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {productImage ? (
                            <img
                              src={productImage.url}
                              alt={item.product.node.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Award className="h-8 w-8 text-white/70" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {item.product.node.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.product.node.productType || "Curso Online"}
                          </p>
                          <p className="font-semibold text-insecap-cyan mt-1">
                            {formatPrice(item.price.amount, item.price.currencyCode)}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => removeItem(item.variantId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sección fixed de checkout */}
              <div className="flex-shrink-0 space-y-4 pt-4 border-t bg-background mt-4">
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-insecap-cyan">
                    {formatPrice(totalPrice.toString(), "CLP")}
                  </span>
                </div>

                {/* Botón de checkout */}
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-insecap-cyan hover:bg-insecap-cyan/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                  disabled={!canCheckout}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Proceder al Pago
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Serás redirigido a Shopify para completar tu compra de forma segura
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
