import React from 'react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">Sobre Nós</h2>
      <p className="text-gray-300">
        ConexIA: Transformando o atendimento com inteligência artificial. Nossa missão é criar soluções 
        inovadoras que aproximem empresas e clientes por meio de experiências inteligentes, eficientes 
        e contextuais.
      </p>
    </motion.div>
  );
};

export default AboutSection;