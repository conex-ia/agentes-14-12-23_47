import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Send } from 'lucide-react';
import { IMaskInput } from 'react-imask';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactFormModal = ({ isOpen, onClose }: ContactFormModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/smtp-form-conexia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origem: 'formConexIA',
          nome: formData.name,
          whatsapp: formData.whatsapp || 'vazio',
          'e-mail': formData.email,
          mensagem: formData.message
        }),
      });

      if (response.ok) {
        // Reset form
        setFormData({ name: '', whatsapp: '', email: '', message: '' });
        onClose();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Mail size={24} className="text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Entre em Contato
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Nome <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Digite seu nome"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-300 mb-1">
                    WhatsApp
                  </label>
                  <IMaskInput
                    id="whatsapp"
                    name="whatsapp"
                    mask="(00) 00000-0000"
                    placeholder="Digite seu WhatsApp"
                    value={formData.whatsapp}
                    onAccept={(value: string) => setFormData(prev => ({ ...prev, whatsapp: value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    E-mail <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="Insira seu melhor e-mail"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Mensagem <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Digite sua mensagem"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                </div>

                <p className="text-sm text-gray-400 text-center">
                  Campos marcados com <span className="text-red-400">*</span> são obrigatórios
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                           transition-colors duration-200 font-semibold flex items-center justify-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactFormModal;