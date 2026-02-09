import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 md:pt-40 pb-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl mb-4 tracking-tight">Thank You For Your Order!</h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Your order has been placed successfully. We'll send you a confirmation email with your order details and tracking information once your package ships.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <Button asChild size="lg" className="w-full bg-primary py-6">
                <Link to="/shop">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full py-6">
                <Link to="/account">View Order Status</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
