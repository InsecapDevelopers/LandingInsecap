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
import OpenCourseOffer from '@/components/OpenCourseOffer';
import { isOpenCourseOfferEnabled, isSimulatorsEnabled } from '@/lib/featureFlags';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <VideoHero />
        {/* Fondo unificado: hero → acreditaciones → noticias fluyen sobre un mismo gradiente */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[hsl(210,20%,98%)] via-white to-gray-50">
          <Hero />
          {isOpenCourseOfferEnabled && <OpenCourseOffer />}
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
