import HeroSection from "../components/HeroSection";
import AnalyzerSection from "../components/AnalyzerSection";

const Home = () => {

  return (
    <main className="bg-black text-white min-h-screen max-w-screen overflow-x-hidden">
      <HeroSection />
      <AnalyzerSection />
    </main>
  );
};

export default Home;
