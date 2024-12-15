import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServicesSection';
import VantagensSection from '../components/VantagensSection';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

function Landing() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ServicesSection />
      <VantagensSection />
      <Footer />
      <AuthModal />
    </main>
  );
}

export default Landing;