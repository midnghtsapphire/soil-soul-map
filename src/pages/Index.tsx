import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedListings from "@/components/FeaturedListings";
import MapPreview from "@/components/MapPreview";
import WhyRegenAg from "@/components/WhyRegenAg";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedListings />
        <MapPreview />
        <WhyRegenAg />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
