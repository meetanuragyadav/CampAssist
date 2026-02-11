// import Navbar from "../../components/Navbar";
import HeroSection from "./Hero-Section";
import FeaturesSection from "./FeaturesSection";
import CTASection from "./CTASection";
import Footer from "./Footer";
import ChatIcon from "../../components/ChatIcon";

export default function HomePage() {
  return (
    <>
      <div className="container">
        <header>
          
          <HeroSection />
        </header>

        <main id="features">
          <FeaturesSection />
          <CTASection />
        </main>

        <Footer />
      </div>

      <ChatIcon />
    </>
  );
}
