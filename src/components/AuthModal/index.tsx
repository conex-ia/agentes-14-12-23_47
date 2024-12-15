import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ValidateCnpjForm from './ValidateCnpjForm';
import CompanyCreatedForm from './CompanyCreatedForm';
import useAuthModal from '../../hooks/useAuthModal';

const AuthModal = () => {
  const { isOpen, view, closeModal } = useAuthModal();

  const getForm = () => {
    switch (view) {
      case 'login':
        return <LoginForm />;
      case 'signup':
        return <ValidateCnpjForm />;
      case 'complete-signup':
        return <SignupForm />;
      case 'company-created':
        return <CompanyCreatedForm />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[900px] bg-white rounded-2xl overflow-hidden shadow-xl"
            >
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
              >
                <X size={20} />
              </motion.button>

              {/* Content */}
              <div className="flex h-[600px]">
                {/* Image */}
                <div className="hidden md:block w-1/2 relative">
                  <img
                    src="https://s3.conexcondo.com.br/fmg/conex-login-signup-flavio-guardia.png"
                    alt="Login"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                {/* Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                  {getForm()}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;