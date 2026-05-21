import React, { useEffect } from 'react';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
// import FeaturedNotesCarousel from './components/FeaturedNotesCarousel';
import BranchNavigationGrid from '../../components/ui/BranchNavigationGrid';
import RecentUploadsSection from './components/RecentUploadsSection';
import TrustSignalsSection from './components/TrustSignalsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import { Route, useLocation, useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';

const Home = () => {
  const location = useLocation();
 useEffect(() => {
  if(location.pathname === '/home')
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="AKTU Notes – Free Notes & PYQs for B.Tech Students"
        description="Download free semester-wise B.Tech notes, previous year question papers (PYQs), and exam resources for AKTU university students."
        keywords="AKTU notes, AKTU PYQ, BTech notes, AKTU semester notes, AKTU previous year papers, AKTU exam preparation"
        path="/"
      />
      <Header />

      <main className="pt-16">
        <HeroSection />

   

        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;