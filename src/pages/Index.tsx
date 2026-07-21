import Header from '@/components/Header';
import VideoHero from '@/components/VideoHero';
import Hero from '@/components/Hero';
import AccreditationsStrip from '@/components/AccreditationsStrip';
import Categories from '@/components/Categories';
import ShopifyProducts from '@/components/ShopifyProducts';
import Accreditations from '@/components/Accreditations';
import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';
import MeetUs from '@/components/MeetUs';
import Catalog from '@/components/Catalog';
import OurClients from '@/components/OurClients';
import OurLocations from '@/components/OurLocations';
import DuaSection from '@/components/DuaSection';
import NumberTickerDemo from '@/components/Statistics';
import NewsSlider from '@/components/NewsSlider';
import InnovationSection from '@/components/InnovationSection';
import SimulatorBanner from '@/components/SimulatorBanner';
import { isSimulatorsEnabled } from '@/lib/featureFlags';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <VideoHero />
        {/* Fondo unificado: hero → acreditaciones → noticias fluyen sobre un mismo gradiente */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[hsl(210,20%,98%)] via-white to-gray-50">
          <div
            className="absolute top-[38%] -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #38BDF8 0%, transparent 65%)' }}
            aria-hidden="true"
          />
          <Hero />
          <AccreditationsStrip />
          <NewsSlider />
        </div>
        <Catalog />
        {isSimulatorsEnabled && <SimulatorBanner />}
        <OurClients />
        <InnovationSection />
        <NumberTickerDemo />
        <DuaSection />
        <ShopifyProducts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
