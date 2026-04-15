import { toast } from "sonner";

// Shopify Configuration
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'qvs57u-ve.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '6956b61adb84bc00884de1664986ce6f';

// Blog RSS Configuration - Using the REAL Insecap store
const INSECAP_STORE_DOMAIN = 'insecap-capacitaciones.myshopify.com';
// Using corsproxy.io as it's more reliable
const RSS_PROXY = 'https://corsproxy.io/?url=';

// Insecap Storefront API Configuration (tokenless access for blog)
const INSECAP_API_VERSION = '2026-01';
const INSECAP_STOREFRONT_URL = `https://${INSECAP_STORE_DOMAIN}/api/${INSECAP_API_VERSION}/graphql.json`;

// Types
export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
    productType: string;
    tags: string[];
    vendor: string;
  };
}

export interface ShopifyCategory {
  label: string;
  handle: string;
  count: number;
}

export interface ShopifyCatalogProductSummary {
  handle: string;
  title: string;
  productType: string;
  vendor: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
}

// GraphQL Queries
const STOREFRONT_COLLECTIONS_QUERY = `
  query GetCollections {
    collections(first: 50) {
      edges {
        node {
          id
          title
          handle
          productsCount
        }
      }
    }
  }
`;

const STOREFRONT_PRODUCTS_BY_COLLECTION_QUERY = `
  query GetProductsByCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            productType
            vendor
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            options {
              name
              values
            }
          }
        }
      }
    }
  }
`;

const STOREFRONT_PRODUCT_TYPES_QUERY = `
  query GetProductTypes {
    productTypes(first: 250) {
      edges {
        node
      }
    }
  }
`;

const STOREFRONT_PRODUCTS_COUNT_QUERY = `
  query GetProductsCount($query: String) {
    products(first: 250, query: $query) {
      edges {
        node {
          productType
          tags
        }
      }
    }
  }
`;

const STOREFRONT_PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          tags
          vendor

          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

const STOREFRONT_PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      productType
      vendor
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

const STOREFRONT_CATALOG_PRODUCTS_QUERY = `
  query GetCatalogProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          handle
          title
          productType
          vendor
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Blog Article Types
export interface ShopifyArticle {
  id: string;
  title: string;
  handle: string;
  publishedAt: string;
  /** Date the article was last edited in Shopify (from Atom <updated>). Undefined when only GraphQL is used. */
  updatedAt?: string;
  excerpt: string | null;
  contentHtml: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
  authorV2: {
    name: string;
  } | null;
  blog: {
    handle: string;
  };
}

// Blog Articles Query
const STOREFRONT_BLOG_ARTICLES_QUERY = `
  query GetBlogArticles($blogHandle: String!, $first: Int!) {
    blog(handle: $blogHandle) {
      title
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            id
            title
            handle
            publishedAt
            excerpt
            contentHtml
            image {
              url
              altText
            }
            authorV2 {
              name
            }
            blog {
              handle
            }
          }
        }
      }
    }
  }
`;

const STOREFRONT_ARTICLE_BY_HANDLE_QUERY = `
  query GetArticleByHandle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        id
        title
        handle
        publishedAt
        excerpt
        contentHtml
        image {
          url
          altText
        }
        authorV2 {
          name
        }
        blog {
          handle
        }
      }
    }
  }
`;

// Storefront API helper function
export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Pago requerido", {
      description: "Tu tienda Shopify necesita un plan de pago activo. Visita https://admin.shopify.com para actualizar.",
    });
    throw new Error("Payment required");
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return data;
}

// Fetch products
export async function fetchProducts(first: number = 20, query?: string): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first, query });
  return data.data.products.edges;
}

// Fetch products by collection handle
export async function fetchProductsByCollection(handle: string, first: number = 20): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_BY_COLLECTION_QUERY, { handle, first });
  return data.data.collection.products.edges;
}

// Fetch categories (tags) and counts
export async function fetchCategories(): Promise<ShopifyCategory[]> {
  try {
    const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_COUNT_QUERY);
    const products = data.data.products.edges;
    
    const counts: Record<string, number> = {};
    products.forEach((edge: any) => {
      const tags = edge.node.tags || [];
      // Assuming categories are tags. We might want to filter specific tags if they have a prefix like 'category:'
      tags.forEach((tag: string) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .map(([label, count]) => ({ 
        label, 
        handle: label.toLowerCase().replace(/\s+/g, '-'), 
        count 
      }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Fetch single product by handle

export async function fetchProductByHandle(handle: string) {
  const data = await storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, { handle });
  return data.data.productByHandle;
}

const chunkItems = <T,>(items: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
};

const buildHandleSearchQuery = (handles: string[]): string =>
  handles.map((handle) => `handle:${handle}`).join(' OR ');

const toCatalogProductSummary = (node: {
  handle: string;
  title: string;
  productType: string;
  vendor: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
}): ShopifyCatalogProductSummary => ({
  handle: node.handle,
  title: node.title,
  productType: node.productType,
  vendor: node.vendor,
  image: node.images.edges[0]?.node ?? null,
});

export async function fetchCatalogProductSummaries(
  handles: string[]
): Promise<Record<string, ShopifyCatalogProductSummary>> {
  const uniqueHandles = Array.from(
    new Set(handles.map((handle) => handle.trim()).filter(Boolean))
  );

  if (uniqueHandles.length === 0) {
    return {};
  }

  const chunks = chunkItems(uniqueHandles, 20);
  const responses = await Promise.all(
    chunks.map(async (chunk) => {
      const data = await storefrontApiRequest(STOREFRONT_CATALOG_PRODUCTS_QUERY, {
        first: chunk.length,
        query: buildHandleSearchQuery(chunk),
      });

      return data.data.products.edges as Array<{
        node: {
          handle: string;
          title: string;
          productType: string;
          vendor: string;
          images: {
            edges: Array<{
              node: {
                url: string;
                altText: string | null;
              };
            }>;
          };
        };
      }>;
    })
  );

  return responses.flat().reduce<Record<string, ShopifyCatalogProductSummary>>((accumulator, edge) => {
    accumulator[edge.node.handle] = toCatalogProductSummary(edge.node);
    return accumulator;
  }, {});
}

// Cart item type for checkout
export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

// Create checkout with Storefront API
// rut: RUT chileno del comprador (ej: "12.345.678-9").
// Se envía como cart.attributes → llega como note_attributes al webhook TMS (orders/paid).
export async function createStorefrontCheckout(items: CartItem[], rut: string = ''): Promise<string> {
  try {
    const lines = items.map(item => ({
      quantity: item.quantity,
      merchandiseId: item.variantId,
    }));

    // Incluir RUT como atributo del carrito si está presente
    const attributes = rut.trim()
      ? [{ key: 'rut_comprador', value: rut.trim() }]
      : [];

    const cartData = await storefrontApiRequest(CART_CREATE_MUTATION, {
      input: {
        lines,
        ...(attributes.length > 0 && { attributes }),
      },
    });

    if (cartData.data.cartCreate.userErrors.length > 0) {
      throw new Error(`Cart creation failed: ${cartData.data.cartCreate.userErrors.map((e: { message: string }) => e.message).join(', ')}`);
    }

    const cart = cartData.data.cartCreate.cart;
    
    if (!cart.checkoutUrl) {
      throw new Error('No checkout URL returned from Shopify');
    }

    const url = new URL(cart.checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    return url.toString();
  } catch (error) {
    console.error('Error creating storefront checkout:', error);
    throw error;
  }
}

// Format price for CLP
export function formatPrice(amount: string, currencyCode: string = 'CLP'): string {
  const num = parseFloat(amount);
  if (currencyCode === 'CLP') {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: currencyCode,
  }).format(num);
}

// ========================================
// BLOG ARTICLES - GraphQL API (Modern)
// ========================================

// PageInfo interface for pagination
export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

// Blog Articles Response with pagination
export interface BlogArticlesResponse {
  articles: ShopifyArticle[];
  pageInfo: PageInfo;
}

// GraphQL Query for Blog Articles with Pagination
const BLOG_ARTICLES_PAGINATED_QUERY = `
  query GetBlogArticles($handle: String!, $first: Int!, $after: String) {
    blog(handle: $handle) {
      articles(first: $first, after: $after, sortKey: PUBLISHED_AT, reverse: true) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            publishedAt
            excerpt
            contentHtml
            image {
              url
              altText
            }
            authorV2 {
              name
            }
          }
        }
      }
    }
  }
`;

// GraphQL Query for Single Article
const BLOG_ARTICLE_BY_HANDLE_QUERY = `
  query GetArticleByHandle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        id
        title
        handle
        publishedAt
        excerpt
        contentHtml
        image {
          url
          altText
        }
        authorV2 {
          name
        }
      }
    }
  }
`;

// Insecap Storefront API helper (tokenless access)
async function insecapStorefrontRequest(query: string, variables: Record<string, unknown> = {}) {
  try {
    const response = await fetch(INSECAP_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      throw new Error(`GraphQL Error: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
    }

    return data;
  } catch (error) {
    console.error('Error calling Insecap Storefront API:', error);
    throw error;
  }
}

// Fetch blog articles with pagination using GraphQL (Modern approach)
export async function fetchBlogArticlesGraphQL(
  blogHandle: string = 'noticias',
  first: number = 6,
  after?: string | null
): Promise<BlogArticlesResponse> {
  try {
    const variables: Record<string, unknown> = {
      handle: blogHandle,
      first,
    };

    if (after) {
      variables.after = after;
    }

    const data = await insecapStorefrontRequest(BLOG_ARTICLES_PAGINATED_QUERY, variables);

    if (!data.data?.blog?.articles) {
      return {
        articles: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      };
    }

    const articlesData = data.data.blog.articles;
    const articles: ShopifyArticle[] = articlesData.edges.map((edge: { node: ShopifyArticle }) => ({
      ...edge.node,
      blog: { handle: blogHandle },
    }));

    return {
      articles,
      pageInfo: articlesData.pageInfo,
    };
  } catch (error) {
    console.error('Error fetching blog articles via GraphQL:', error);
    // Fallback to RSS if GraphQL fails
    console.log('Falling back to RSS feed...');
    const rssArticles = await fetchBlogArticles(blogHandle, first);
    return {
      articles: rssArticles,
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

// Fetch single article by handle using GraphQL (Modern approach)
export async function fetchArticleByHandleGraphQL(
  blogHandle: string,
  articleHandle: string
): Promise<ShopifyArticle | null> {
  try {
    const data = await insecapStorefrontRequest(BLOG_ARTICLE_BY_HANDLE_QUERY, {
      blogHandle,
      articleHandle,
    });

    if (!data.data?.blog?.articleByHandle) {
      return null;
    }

    const article = data.data.blog.articleByHandle;
    return {
      ...article,
      blog: { handle: blogHandle },
    };
  } catch (error) {
    console.error('Error fetching article via GraphQL:', error);
    // Fallback to RSS if GraphQL fails
    console.log('Falling back to RSS feed...');
    return await fetchArticleByHandle(blogHandle, articleHandle);
  }
}

// ========================================
// BLOG ARTICLES - RSS Feed (Legacy fallback)
// ========================================

// Parse RSS/Atom feed from Shopify blog
async function parseAtomFeed(xml: string, blogHandle: string): Promise<ShopifyArticle[]> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  
  const entries = doc.querySelectorAll('entry');
  const articles: ShopifyArticle[] = [];
  
  entries.forEach((entry, index) => {
    const title = entry.querySelector('title')?.textContent || '';
    const id = entry.querySelector('id')?.textContent || `article-${index}`;
    const published = entry.querySelector('published')?.textContent || new Date().toISOString();
    const updated = entry.querySelector('updated')?.textContent || undefined;
    const content = entry.querySelector('content')?.textContent || '';
    const summary = entry.querySelector('summary')?.textContent || '';
    const authorName = entry.querySelector('author > name')?.textContent || 'INSECAP';
    
    // Extract link - look for alternate link
    const links = entry.querySelectorAll('link');
    let articleUrl = '';
    links.forEach(link => {
      if (link.getAttribute('rel') === 'alternate') {
        articleUrl = link.getAttribute('href') || '';
      }
    });
    
    // Extract handle from URL
    const urlParts = articleUrl.split('/');
    const handle = urlParts[urlParts.length - 1] || `article-${index}`;
    
    // Extract first image from content
    const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
    const imageUrl = imgMatch ? imgMatch[1] : null;
    
    // Create excerpt from summary or strip HTML from content
    let excerpt = summary;
    if (!excerpt && content) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      excerpt = tempDiv.textContent?.substring(0, 200) + '...' || '';
    }
    
    articles.push({
      id,
      title,
      handle,
      publishedAt: published,
      updatedAt: updated,
      excerpt,
      contentHtml: content,
      image: imageUrl ? { url: imageUrl, altText: title } : null,
      authorV2: { name: authorName },
      blog: { handle: blogHandle }
    });
  });
  
  return articles;
}

// Fetch blog articles via RSS feed (bypasses Storefront API token requirement)
// Shopify Atom feeds are paginated: each page contains at most 20 articles ordered
// by publishedAt DESC. To sort by edit date we need ALL articles, so we paginate
// until we receive a page with fewer than 20 entries (last page).
const ATOM_PAGE_SIZE = 20;

export async function fetchBlogArticles(blogHandle: string = 'noticias', first: number = 10): Promise<ShopifyArticle[]> {
  try {
    const baseUrl = `https://${INSECAP_STORE_DOMAIN}/blogs/${blogHandle}.atom`;
    // Cache-buster rotates every minute so the browser and corsproxy always fetch
    // the latest feed instead of serving a stale cached version.
    const cb = Math.floor(Date.now() / 60_000);
    const allArticles: ShopifyArticle[] = [];
    const seenIds = new Set<string>();
    let page = 1;
    // Safety cap: 50 pages × 20 = 1 000 articles, well above any realistic blog size.
    const MAX_PAGES = 50;

    while (page <= MAX_PAGES) {
      const pageUrl = page === 1
        ? `${baseUrl}?_cb=${cb}`
        : `${baseUrl}?page=${page}&_cb=${cb}`;
      const proxyUrl = `${RSS_PROXY}${encodeURIComponent(pageUrl)}`;

      const response = await fetch(proxyUrl);

      if (!response.ok) {
        if (page === 1) return [];
        break;
      }

      const xml = await response.text();
      const pageArticles = await parseAtomFeed(xml, blogHandle);

      // Shopify repeats the last real page when the requested page exceeds the total.
      // Detect this by checking if any returned ID was already collected.
      const isRepeat = pageArticles.length > 0 && pageArticles.every(a => seenIds.has(a.id));
      if (isRepeat) break;

      for (const a of pageArticles) {
        if (!seenIds.has(a.id)) {
          seenIds.add(a.id);
          allArticles.push(a);
        }
      }

      // Fewer than a full page means this was the last real page.
      if (pageArticles.length < ATOM_PAGE_SIZE) break;

      page++;
    }

    // Sort by effective date (updatedAt when present, else publishedAt) descending
    // so that articles edited recently surface before older unedited ones.
    allArticles.sort((a, b) =>
      new Date(b.updatedAt ?? b.publishedAt).getTime() -
      new Date(a.updatedAt ?? a.publishedAt).getTime()
    );

    // Return only the requested number
    return allArticles.slice(0, first);
  } catch (error) {
    console.error('Error fetching blog articles via RSS:', error);
    return [];
  }
}

// Fetch single article by handle (via RSS - finds in cached articles)
export async function fetchArticleByHandle(blogHandle: string, articleHandle: string): Promise<ShopifyArticle | null> {
  try {
    // Use a high limit so the full feed is searched, not just the top-ranked articles.
    const articles = await fetchBlogArticles(blogHandle, 9999);
    const article = articles.find(a => a.handle === articleHandle);
    return article || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Format date for articles
export function formatArticleDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Returns the most relevant date for an article:
// edit date (updatedAt) when available, otherwise publish date.
export function effectiveDate(article: ShopifyArticle): string {
  return article.updatedAt ?? article.publishedAt;
}

// ========================================
// POPUP BANNER - Shopify Page as CMS
// ========================================

// Query to fetch a Shopify Page by handle
const STOREFRONT_PAGE_BY_HANDLE_QUERY = `
  query GetPageByHandle($handle: String!) {
    page(handle: $handle) {
      id
      title
      body
    }
  }
`;

export interface PopupBannerData {
  imageUrl: string;
  altText: string;
}

/**
 * Fetches the popup banner image from a Shopify Page with handle "popup-descuentos".
 * 
 * How it works for non-technical users:
 * 1. Go to Shopify Admin > Online Store > Pages
 * 2. Create a page with URL handle "popup-descuentos"
 * 3. In the page content editor, insert the promotional image
 * 4. Publish the page to activate the popup, unpublish to deactivate
 * 
 * Returns null if the page doesn't exist, is unpublished, or has no image.
 */
export async function fetchPopupBanner(): Promise<PopupBannerData | null> {
  try {
    const data = await insecapStorefrontRequest(STOREFRONT_PAGE_BY_HANDLE_QUERY, {
      handle: 'popup-descuentos',
    });

    const page = data.data?.page;
    if (!page || !page.body) {
      return null;
    }

    // Parse the HTML body to extract the first image
    const imgMatch = page.body.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
    if (!imgMatch) {
      return null;
    }

    const imageUrl = imgMatch[1];

    // Try to extract alt text from the img tag
    const altMatch = imgMatch[0].match(/alt="([^"]*)"/i);
    const altText = altMatch ? altMatch[1] : page.title || 'Promoción de temporada';

    return { imageUrl, altText };
  } catch (error) {
    console.error('Error fetching popup banner:', error);
    return null;
  }
}
