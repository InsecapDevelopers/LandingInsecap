import Header from '@/components/Header';
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
        <Hero />
        <AccreditationsStrip />
        <NewsSlider />
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
