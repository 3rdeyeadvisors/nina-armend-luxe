
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: products } = useProducts(20, query);

  // Fallback to mock data if Shopify returns nothing or for demonstration
  const filteredMock = MOCK_PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <SearchIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Search Results</h1>
            <p className="text-muted-foreground">
              {query ? `Showing results for "${query}"` : 'Enter a keyword to search our collection'}
            </p>
          </div>

          {filteredMock.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredMock.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={{
                    node: {
                      id: 'gid://shopify/Product/' + product.id,
                      title: product.title,
                      handle: product.handle,
                      description: '',
                      priceRange: { minVariantPrice: { amount: product.price.toString(), currencyCode: 'USD' } },
                      images: { edges: product.images.map(url => ({ node: { url, altText: null } })) },
                      variants: { edges: [{ node: { id: 'v-' + product.id, title: 'Default', price: { amount: product.price.toString(), currencyCode: 'USD' }, availableForSale: true, selectedOptions: [] } }] },
                      options: []
                    }
                  } as any}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">No products found matching your search.</p>
              <button
                onClick={() => window.history.back()}
                className="mt-4 text-primary underline underline-offset-4"
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
