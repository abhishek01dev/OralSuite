import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface WidgetProps {
  tenantId: string;
  apiUrl: string;
}

export const Widget: React.FC<WidgetProps> = ({ tenantId, apiUrl }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/products?limit=6`, {
          headers: { 'x-tenant-id': tenantId },
        });
        const data = (await res.json()) as { data?: Product[] };
        setProducts(data.data ?? []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchProducts();
  }, [apiUrl, tenantId]);

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const next = new Map(prev);
      next.set(productId, (next.get(productId) ?? 0) + 1);
      return next;
    });
  };

  const cartCount = Array.from(cart.values()).reduce((sum, qty) => sum + qty, 0);

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading products...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Featured Products</h2>
        {cartCount > 0 && <span style={styles.cartBadge}>{cartCount} in cart</span>}
      </div>
      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product.id} style={styles.card}>
            <div style={styles.imagePlaceholder} />
            <h3 style={styles.productName}>{product.name}</h3>
            <p style={styles.price}>${product.price.toFixed(2)}</p>
            <button style={styles.addButton} onClick={() => addToCart(product.id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: 800,
    margin: '0 auto',
    padding: 16,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: 600, margin: 0 },
  cartBadge: {
    background: '#2563eb',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 13,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 16,
  },
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 12,
    textAlign: 'center' as const,
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    background: '#f3f4f6',
    borderRadius: 4,
    marginBottom: 8,
  },
  productName: { fontSize: 14, fontWeight: 500, margin: '4px 0' },
  price: { fontSize: 16, fontWeight: 700, color: '#2563eb', margin: '4px 0' },
  addButton: {
    width: '100%',
    padding: '8px 16px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
  },
  loading: { textAlign: 'center' as const, padding: 40, color: '#6b7280' },
};
