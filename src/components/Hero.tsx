import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Users, GraduationCap, Clock, Instagram, Facebook, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WordRotate } from '@/components/ui/word-rotate';

const CAPIN_IMG = '/CapinMov.webp';

const HERO_BACKGROUNDS = [
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_111938161.png?v=1772461187',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Banner-Nosotros-Web-16-anos-scaled.jpg?v=1773345520',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Cascada-fachada-y-letrero-scaled.jpg?v=1767971535',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Sede-Antofagasta-web.jpg?v=1773345628',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112057871.png?v=1772461266',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112143481.png?v=1772461310',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112230765.png?v=1772461356',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112259390.png?v=1772461385',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112344017.png?v=1772461433',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112418054.png?v=1772461465',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112454997.png?v=1772461500',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/GHorquilla3675_web.jpg?v=1773345899'
];

/* ——— Custom SVG icons ——— */
const XIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.32-2.34-.14-3.41.37-1.33.64-2.18 2.08-2.1 3.59.08 1.48 1.21 2.74 2.66 2.96 1.34.23 2.73-.24 3.63-1.23.54-.59.81-1.35.81-2.14V.02Z" />
  </svg>
);

/* ——— Social media data ——— */
const socialLinks = [
  { icon: <Instagram className="w-5 h-5" />, href: 'https://www.instagram.com/insecap_capacitacion/', label: 'Instagram' },
  { icon: <Facebook className="w-5 h-5" />, href: 'https://www.facebook.com/people/InsecapCapacitación/61561168455014/?mibextid=LQQJ4d&rdid=QsS38qFirhGvNMuy&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2FYBQho3cqYYgUoC3z%2F%3Fmibextid%3DLQQJ4d', label: 'Facebook' },
  { icon: <XIcon className="w-4 h-4" />, href: 'https://x.com/insecap', label: 'X' },
  { icon: <Linkedin className="w-5 h-5" />, href: 'https://www.linkedin.com/company/insecap-capacitacion/posts/?feedView=all', label: 'LinkedIn' },
  { icon: <TikTokIcon className="w-5 h-5" />, href: 'https://www.tiktok.com/@insecap.capacitac', label: 'TikTok' },
];

/* ——— animation helpers ——— */
const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.18, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const fadeInRight = {
  hidden: { opacity: 0, x: 80, scale: 0.92 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.6 + i * 0.12, duration: 0.6, ease: 'easeOut' as const },
  }),
};

const socialCardVariant = {
  hidden: { opacity: 0, x: 30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.8 + i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

/* ——— sub-components ——— */
const CircuitPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
        {/* horizontal lines */}
        <line x1="0" y1="40" x2="80" y2="40" stroke="#38BDF8" strokeWidth="1" />
        <line x1="120" y1="40" x2="200" y2="40" stroke="#38BDF8" strokeWidth="1" />
        <line x1="0" y1="120" x2="60" y2="120" stroke="#38BDF8" strokeWidth="1" />
        <line x1="140" y1="120" x2="200" y2="120" stroke="#38BDF8" strokeWidth="1" />
        {/* vertical lines */}
        <line x1="80" y1="0" x2="80" y2="40" stroke="#38BDF8" strokeWidth="1" />
        <line x1="120" y1="40" x2="120" y2="100" stroke="#38BDF8" strokeWidth="1" />
        <line x1="60" y1="120" x2="60" y2="200" stroke="#38BDF8" strokeWidth="1" />
        <line x1="140" y1="100" x2="140" y2="120" stroke="#38BDF8" strokeWidth="1" />
        {/* nodes (dots) */}
        <circle cx="80" cy="40" r="3" fill="#38BDF8" />
        <circle cx="120" cy="40" r="3" fill="#38BDF8" />
        <circle cx="60" cy="120" r="3" fill="#38BDF8" />
        <circle cx="140" cy="120" r="3" fill="#38BDF8" />
        <circle cx="140" cy="100" r="2" fill="#38BDF8" />
        <circle cx="120" cy="100" r="2" fill="#38BDF8" />
        {/* diagonal accents */}
        <line x1="80" y1="40" x2="120" y2="100" stroke="#38BDF8" strokeWidth="0.5" />
        <line x1="140" y1="100" x2="140" y2="120" stroke="#38BDF8" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#circuit)" />
  </svg>
);

const Hero = () => {
  const { t, i18n } = useTranslation();

  type HeroPhrase = {
    h1: string;
    h2: string;
    prefix: string;
    words: string[];
    suffix: string;
  };

  const heroPhrase = useMemo(() => {
    const phrases = t('hero.phrases', { returnObjects: true }) as HeroPhrase[];
    return phrases[Math.floor(Math.random() * phrases.length)] ?? phrases[0];
  }, [i18n.resolvedLanguage, t]);

  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 6000); // Change image every 6 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-screen lg:min-h-[780px] overflow-hidden flex items-center">
      {/* ── Background Carousel ── */}
      {HERO_BACKGROUNDS.map((bg, idx) => (
        <motion.div
          key={bg}
          initial={false}
          animate={{
            opacity: currentBg === idx ? 1 : 0,
            filter: currentBg === idx ? 'blur(0px)' : 'blur(10px)',
            scale: currentBg === idx ? 1 : 1.05,
          }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${bg}')` }}
        />
      ))}

      {/* Blue Overlays (Similar to Catalog) */}
      <div className="absolute inset-0 bg-blue-800 bg-opacity-70 backdrop-blur-[2px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900 opacity-60"></div>
      <CircuitPattern />

      {/* subtle radial glow */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 70% 30%, #38BDF8 0%, transparent 60%)',
        }}
      />

      {/* ── Main Content ── */}
      <div className="container mx-auto px-8 sm:px-14 lg:px-16 relative z-10 pt-32 pb-36 lg:pt-32 lg:pb-44">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-4">
          {/* ─── LEFT COLUMN ─── */}
          <div className="flex-1 text-center lg:text-left max-w-xl lg:max-w-[560px]">
            <motion.h1
              custom={0}
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold text-white leading-[1.12] mb-4 tracking-tight"
            >
              {heroPhrase.h1}
            </motion.h1>

            <motion.div
              custom={0.5}
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold text-white/90 mb-6 leading-tight"
            >
              {heroPhrase.prefix}
              <br />
              <WordRotate
                as="span"
                words={heroPhrase.words}
                duration={2500}
                className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-400 inline-block drop-shadow-sm mt-1"
              />
              {heroPhrase.suffix && (
                <>
                  <br className="hidden sm:block" />
                  {heroPhrase.suffix}
                </>
              )}
            </motion.div>

            <motion.p
              custom={1}
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="text-white/70 text-base sm:text-[1.1rem] mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {heroPhrase.h2}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              custom={2}
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10"
            >
              <motion.a
                href="#cursos-destacados"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('cursos-destacados')?.scrollIntoView({ behavior: 'smooth' });
                }}
                animate={{ y: [0, -120, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 2.5,
                  ease: "easeInOut",
                }}
                className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.35)]"
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #38BDF8 100%)',
                }}
              >
                <BookOpen className="w-4 h-4" />
                {t('hero.ctaCourses')}
              </motion.a>
              <motion.a
                href="#contacto"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
                }}
                animate={{ y: [0, -120, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 2.5,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-white border-2 border-white/30 hover:border-sky-400 hover:text-sky-300 transition-all duration-300 backdrop-blur-sm"
              >
                {t('hero.ctaContact')}
              </motion.a>
            </motion.div>

            {/* ── Stats row ── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="flex gap-8 sm:gap-10 justify-center lg:justify-start"
            >
              {[
                { icon: <Users className="w-5 h-5 text-sky-400" />, value: '53k+', label: t('hero.stats.trainedUsers') },
                { icon: <GraduationCap className="w-5 h-5 text-sky-400" />, value: '2,3K+', label: t('hero.stats.coursesDelivered') },
                { icon: <Clock className="w-5 h-5 text-sky-400" />, value: '16 años', label: t('hero.stats.experience') },
              ].map((stat, i) => (
                <motion.div key={stat.label} custom={i} variants={fadeInUp} className="flex flex-col items-center lg:items-start gap-1">
                  <div className="flex items-center gap-2">
                    {stat.icon}
                    <span className="text-white font-bold text-lg sm:text-xl">{stat.value}</span>
                  </div>
                  <span className="text-white/50 text-xs font-medium">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* ── Certificaciones & Membresías ── */}
            <motion.div
              custom={3}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              className="mt-8 pt-6 border-t border-white/15"
            >
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-semibold mb-3 text-center lg:text-left">
                {t('hero.certifications')}
              </p>
              <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                {/* SENCE */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center h-9 px-3 rounded-lg bg-white border border-white/30 hover:bg-white/90 transition-colors cursor-pointer">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/logosence_png.png?v=1772478498"
                    alt="SENCE"
                    className="h-5 w-auto object-contain"
                    loading="lazy"
                  />
                </motion.div>
                {/* NCh2728 */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center h-9 px-3 rounded-lg bg-white border border-white/30 hover:bg-white/90 transition-colors cursor-pointer">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/logo_slogan.svg?v=1772193702"
                    alt="NCh2728"
                    className="h-5 w-auto object-contain"
                    loading="lazy"
                  />
                </motion.div>
                {/* ISO 9001 */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="flex items-center justify-center h-9 px-3 rounded-lg bg-white border border-white/30 hover:bg-white/90 transition-colors cursor-pointer">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-02-27_085941459.png?v=1772193585"
                    alt="ISO 9001"
                    className="h-5 w-auto object-contain"
                    loading="lazy"
                  />
                </motion.div>
                {/* CCS
                <div className="flex items-center justify-center h-9 px-3 rounded-lg bg-white border border-white/30 hover:bg-white/90 transition-colors">
                  <span className="text-gray-700 text-xs font-bold tracking-wide">CCS</span>
                </div> */}
                {/* SICEP */}
                {/* <div className="flex items-center justify-center h-9 px-3 rounded-lg bg-white border border-white/30 hover:bg-white/90 transition-colors">
                  <span className="text-gray-700 text-xs font-bold tracking-wide">SICEP</span>
                </div> */}
              </div>
            </motion.div>
          </div>

          {/* ─── RIGHT COLUMN — Mascot + floating cards ─── */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            className="flex-1 relative flex items-end justify-center min-h-[380px] sm:min-h-[480px] lg:min-h-[540px]"
          >
            {/* Capin mascot */}
            <motion.img
              src={CAPIN_IMG}
              alt="Capín — mascota de Insecap"
              className="relative z-10 w-[260px] sm:w-[320px] lg:w-[380px] h-auto drop-shadow-2xl object-contain"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }}
            />

            {/* ── Floating Social Media Bar ── */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 sm:right-2 lg:-right-6 z-20 hidden sm:flex flex-col gap-3">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  custom={i}
                  variants={socialCardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                  whileHover={{ scale: 1.15, x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-xl bg-insecap-cyan backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-insecap-cyan/80 hover:border-white/40 transition-colors shadow-lg cursor-pointer"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom Wave ── */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
        <svg
          className="relative block w-full"
          style={{ height: '100px' }}
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Celeste/sky wave behind */}
          <path
            d="M0,60 C240,20 480,90 720,50 C960,10 1200,70 1440,40 L1440,100 L0,100 Z"
            fill="#0ea5e9"
            opacity="0.5"
          />
          {/* Blue accent wave */}
          <path
            d="M0,70 C360,30 720,95 1080,55 C1260,35 1380,60 1440,50 L1440,100 L0,100 Z"
            fill="#0369a1"
            opacity="0.35"
          />
          {/* White foreground wave */}
          <path
            d="M0,80 C320,55 640,95 960,70 C1120,58 1300,80 1440,65 L1440,100 L0,100 Z"
            fill="hsl(210, 20%, 98%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
