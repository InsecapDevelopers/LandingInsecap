import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ShoppingCart,
  Clock,
  Monitor,
  Award,
  Search,
  X,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import PageHero from '@/components/PageHero';
import {
  fetchCategories,
  fetchProducts,
  formatPrice,
  ShopifyCategory,
  ShopifyProduct,
} from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';

const isEcommerceEnabled = import.meta.env.VITE_ECOMMERCE_ENABLED !== 'false';

// ─── Product Card (same design as ShopifyProducts) ──────────────────────────
const ShopifyProductCard = ({ product }: { product: ShopifyProduct }) => {
  const addItem = useCartStore((state) => state.addItem);
  const { node } = product;

  const firstVariant = node.variants.edges[0]?.node;
  const firstImage = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!firstVariant) {
      toast.error('Curso no disponible');
      return;
    }

    addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    });

    toast.success('Curso agregado al carrito', {
      description: node.title,
      position: 'top-center',
    });
  };

  return (
    <Link to={`/curso/${node.handle}`}>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card h-full flex flex-col">
        <div className="relative h-48 bg-gradient-to-br from-insecap-blue to-insecap-cyan overflow-hidden">
          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.altText || node.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Award className="h-16 w-16 text-white/50" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className="bg-insecap-cyan text-white border-0">
              {node.productType || 'Curso'}
            </Badge>
          </div>
          <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0">
            SENCE
          </Badge>
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-insecap-cyan transition-colors min-h-[3rem]">
            {node.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
            {node.description || 'Capacitación profesional certificada'}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>24 hrs</span>
            </div>
            <div className="flex items-center gap-1">
              <Monitor className="h-4 w-4" />
              <span>{node.productType || 'Online'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            {isEcommerceEnabled ? (
              <>
                <div>
                  <span className="text-xl font-bold text-insecap-cyan">
                    {formatPrice(price.amount, price.currencyCode)}
                  </span>
                </div>
                <Button
                  onClick={handleAddToCart}
                  size="sm"
                  className="bg-insecap-blue hover:bg-insecap-blue/90 text-white"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="w-full bg-insecap-blue hover:bg-insecap-blue/90 text-white"
              >
                Ver curso
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// ─── Product Skeleton ───────────────────────────────────────────────────────
const ProductSkeleton = () => (
  <Card className="overflow-hidden border-0 shadow-lg">
    <Skeleton className="h-48 w-full" />
    <CardContent className="p-5 space-y-3">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between pt-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </CardContent>
  </Card>
);

// ─── Pagination Component ───────────────────────────────────────────────────
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  // Build visible page numbers with ellipsis logic
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav className="flex items-center gap-1.5" aria-label="Paginación">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all
          border border-border bg-card text-muted-foreground
          hover:bg-insecap-blue hover:text-white hover:border-insecap-blue
          disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, idx) =>
        page === 'ellipsis' ? (
          <span key={`e-${idx}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all
              ${page === currentPage
                ? 'bg-insecap-blue text-white shadow-md scale-110'
                : 'border border-border bg-card text-foreground hover:bg-insecap-blue/10 hover:border-insecap-blue'
              }`}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Página ${page}`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all
          border border-border bg-card text-muted-foreground
          hover:bg-insecap-blue hover:text-white hover:border-insecap-blue
          disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
};

// ─── Category Filter Bar ────────────────────────────────────────────────────
const CategoryFilterBar = ({
  categories,
  selected,
  onSelect,
  isLoading,
}: {
  categories: ShopifyCategory[];
  selected: string | null;
  onSelect: (cat: string | null) => void;
  isLoading: boolean;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, categories]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-hidden py-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-full shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative group/filters">
      {/* Left arrow — desktop only */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full
            bg-white/95 shadow-lg border border-border backdrop-blur
            flex items-center justify-center
            hover:bg-insecap-blue hover:text-white hover:border-insecap-blue
            transition-all hidden md:flex"
          aria-label="Desplazar filtros a la izquierda"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {/* Scrollable pill container */}
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto py-2 px-1 scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* "Todos" button */}
        <button
          onClick={() => onSelect(null)}
          className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap
            ${selected === null
              ? 'bg-insecap-blue text-white shadow-md shadow-insecap-blue/30 scale-[1.03]'
              : 'bg-card border border-border text-foreground hover:bg-insecap-blue/10 hover:border-insecap-blue/40'
            }`}
        >
          <LayoutGrid className="inline-block h-4 w-4 mr-1.5 -mt-0.5" />
          Todos
        </button>

        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => onSelect(cat.label)}
            className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap
              ${selected === cat.label
                ? 'bg-insecap-blue text-white shadow-md shadow-insecap-blue/30 scale-[1.03]'
                : 'bg-card border border-border text-foreground hover:bg-insecap-blue/10 hover:border-insecap-blue/40'
              }`}
          >
            {cat.label}
            <span className={`ml-1.5 text-xs ${selected === cat.label ? 'text-white/70' : 'text-muted-foreground'}`}>
              ({cat.count})
            </span>
          </button>
        ))}
      </div>

      {/* Right arrow — desktop only */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full
            bg-white/95 shadow-lg border border-border backdrop-blur
            flex items-center justify-center
            hover:bg-insecap-blue hover:text-white hover:border-insecap-blue
            transition-all hidden md:flex"
          aria-label="Desplazar filtros a la derecha"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* Gradient fade edges on mobile */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none md:hidden" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
      )}
    </div>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────────────
const PRODUCTS_PER_PAGE = 16;

const CourseCatalog = () => {
  const [categories, setCategories] = useState<ShopifyCategory[]>([]);
  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>([]);
  const [isLoadingCats, setIsLoadingCats] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Load categories
  useEffect(() => {
    (async () => {
      try {
        setIsLoadingCats(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
      } finally {
        setIsLoadingCats(false);
      }
    })();
  }, []);

  // Load products — re-fetch when category changes
  useEffect(() => {
    (async () => {
      try {
        setIsLoadingProducts(true);
        const query = selectedCategory ? `tag:${selectedCategory}` : undefined;
        const data = await fetchProducts(250, query);
        setAllProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    })();
  }, [selectedCategory]);

  // Reset page when category changes
  const handleCategorySelect = (cat: string | null) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    document.getElementById('products-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Filter products by search term
  const filteredProducts = searchTerm.trim()
    ? allProducts.filter((p) =>
      p.node.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )
    : allProducts;

  // Pagination math
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    document.getElementById('products-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-16">
        <PageHero
          title={selectedCategory ? `Cursos de ${selectedCategory}` : 'Listado de Cursos'}
          subtitle="Capacitación Especializada"
          breadcrumbs={[{ label: 'Cursos' }]}
        />

        <div className="container mx-auto px-8 md:px-14 lg:px-16 mt-12">
          {/* Intro */}
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explora nuestras categorías de cursos y encuentra la capacitación perfecta para tu desarrollo profesional
            </p>
          </div>

          {/* Category Filter Bar */}
          <div className="mb-6">
            <CategoryFilterBar
              categories={categories}
              selected={selectedCategory}
              onSelect={handleCategorySelect}
              isLoading={isLoadingCats}
            />
          </div>

          {/* Products Area */}
          <div id="products-area" className="scroll-mt-28">
            {/* Search + Top Pagination row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              {/* Search Bar */}
              <div className="w-full sm:max-w-sm">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Buscar cursos por nombre..."
                    className="w-full h-10 pl-10 pr-10 rounded-full border border-border bg-card text-foreground text-sm
                      placeholder:text-muted-foreground
                      focus:outline-none focus:ring-2 focus:ring-insecap-blue/40 focus:border-insecap-blue
                      shadow-sm hover:shadow-md transition-all duration-200"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => handleSearchChange('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full
                        bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
                      aria-label="Limpiar búsqueda"
                    >
                      <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                  )}
                </div>
                {searchTerm.trim() && !isLoadingProducts && (
                  <p className="text-xs text-muted-foreground mt-1.5 pl-4">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado' : 'resultados'} para "{searchTerm.trim()}"
                  </p>
                )}
              </div>

              {/* Top Pagination */}
              {!isLoadingProducts && filteredProducts.length > PRODUCTS_PER_PAGE && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoadingProducts
                ? Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))
                : paginatedProducts.map((product) => (
                  <ShopifyProductCard key={product.node.id} product={product} />
                ))}
            </div>

            {/* Empty state */}
            {!isLoadingProducts && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <LayoutGrid className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No se encontraron cursos
                  {searchTerm.trim() ? ` que coincidan con "${searchTerm.trim()}"` : ''}
                  {selectedCategory ? ` en la categoría "${selectedCategory}"` : ''}.
                </p>
              </div>
            )}

            {/* Bottom Pagination */}
            {!isLoadingProducts && filteredProducts.length > PRODUCTS_PER_PAGE && (
              <div className="flex justify-end mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseCatalog;
