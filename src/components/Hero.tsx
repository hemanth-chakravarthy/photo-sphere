
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle?: string;
  scrollToGallery?: () => void;
}

const Hero = ({ title, subtitle, scrollToGallery }: HeroProps) => {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Starry background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Stars */}
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-white mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}

          {scrollToGallery && (
            <motion.button
              onClick={scrollToGallery}
              className="mt-12 inline-flex items-center justify-center text-white border border-white/30 rounded-full w-12 h-12 hover:bg-white/10 transition-colors"
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
