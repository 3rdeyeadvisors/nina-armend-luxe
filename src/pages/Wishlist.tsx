
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useWishlistStore } from '@/stores/wishlistStore';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Wishlist() {
  const items = useWishlistStore(state => state.items);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl mb-4">Your Wishlist</h1>
            <p className="text-muted-foreground">
              {items.length > 0 ? `You have ${items.length} items saved for later.` : 'Your wishlist is empty.'}
            </p>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {items.map((item, index) => (
                <ProductCard
                  key={item.id}
                  product={{
                    node: {
                      id: item.id,
                      title: item.title,
                      handle: item.handle,
                      description: '',
                      priceRange: { minVariantPrice: { amount: item.price, currencyCode: 'USD' } },
                      images: { edges: [{ node: { url: item.image, altText: null } }] },
                      variants: { edges: [{ node: { id: 'v-' + item.id, title: 'Default', price: { amount: item.price, currencyCode: 'USD' }, availableForSale: true, selectedOptions: [] } }] },
                      options: []
                    }
                  } as any}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">Save your favorite pieces here to view them later.</p>
              <a href="/shop" className="mt-4 inline-block text-primary underline underline-offset-4">
                Continue Shopping
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
