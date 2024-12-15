import React, { useState } from 'react';
import Background from './Background';
import SectionHeader from './SectionHeader';
import ServicesList from './ServicesList';
import ContactFormModal from '../ContactFormModal';

const ServicesSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="recursos" className="relative py-24 overflow-hidden">
      <Background />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader onOpenModal={() => setIsModalOpen(true)} />
        <ServicesList />
      </div>

      <ContactFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default ServicesSection;