import React, { useState } from 'react';
import ContactFormModal from './ContactFormModal';
import useAuthModal from '../hooks/useAuthModal';

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openModal } = useAuthModal();

  return (
    <div id="servicos" className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Background with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://s3.conexcondo.com.br/fmg/discover-abstract-wave-patterns-dark-background-diverse-media-projects-seamless-loop.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center pt-24">
        {/* Video Container */}
        <div className="w-full max-w-4xl mb-12">
          <div className="relative w-full h-0 pb-[56.25%] rounded-2xl overflow-hidden shadow-2xl bg-black/40">
            <video
              className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
              autoPlay
              muted
              loop
              playsInline
              controls
            >
              <source
                src="https://s3.conexcondo.com.br/fmg/674fbdd286f2f2dc633b9fc7%20%281%29.mp4"
                type="video/mp4"
              />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center mb-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Transforme seu Negócio com
            <span className="text-emerald-500"> Inteligência Artificial</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Soluções inovadoras que impulsionam a eficiência e o crescimento da sua empresa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => openModal('signup')}
              className="px-8 py-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors duration-200 text-lg font-semibold"
            >
              Começar Agora
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors duration-200 text-lg font-semibold backdrop-blur-sm"
            >
              Saiba Mais
            </button>
          </div>
        </div>
      </div>

      <ContactFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Hero;