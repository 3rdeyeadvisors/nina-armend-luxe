import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Isabella Silva",
    location: "Rio de Janeiro",
    text: "The most luxurious swimwear I've ever owned. The fit is absolute perfection and the fabric feels like a dream.",
    rating: 5
  },
  {
    name: "Sophia Martinez",
    location: "Miami, FL",
    text: "Nina Armend captured the Brazilian spirit perfectly. I get compliments every time I wear my Copacabana set!",
    rating: 5
  },
  {
    name: "Alessandra Rossi",
    location: "Milan, Italy",
    text: "True luxury craftsmanship. You can tell every piece is made with intention and high-quality materials.",
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl mb-4">What Our Muse Says</h2>
          <p className="text-muted-foreground uppercase tracking-[0.2em] text-xs">Stories from the Inner Circle</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background p-8 rounded-2xl border border-primary/10 shadow-sm relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
              <div className="flex mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground italic mb-6 leading-relaxed">"{t.text}"</p>
              <div>
                <p className="font-sans font-bold text-sm uppercase tracking-tight">{t.name}</p>
                <p className="text-[10px] text-primary uppercase tracking-widest">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
