
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle?: string;
  scrollToGallery?: () => void;
}

const Hero = ({ title, subtitle, scrollToGallery }: HeroProps) => {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}

          {scrollToGallery && (
            <motion.button
              onClick={scrollToGallery}
              className="mt-12 inline-flex items-center justify-center text-foreground border border-border rounded-full w-12 h-12 hover:bg-accent hover:text-accent-foreground transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{
                opacity: { delay: 1.2, duration: 0.8 },
                y: { delay: 1.2, duration: 1.5, repeat: Infinity, repeatType: "loop" }
              }}
              aria-label="Scroll to gallery"
            >
              <ChevronDown size={24} />
            </motion.button>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
