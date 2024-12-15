import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { IMaskInput } from 'react-imask';
import { UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthModal from '../../hooks/useAuthModal';
import useAuth from '../../stores/useAuth';

const LoginForm = () => {
  const navigate = useNavigate();
  const { setView, closeModal } = useAuthModal();
  const { setAuth } = useAuth();
  const [isWhatsAppLogin, setIsWhatsAppLogin] = useState(true);
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [token, setToken] = useState(['', '', '', '', '', '']);
  const tokenRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempUserData, setTempUserData] = useState<{ userUid: string } | null>(null);

  const handleTokenChange = (index: number, value: string) => {
    const newToken = [...token];
    newToken[index] = value;
    setToken(newToken);

    if (value && index < 5) {
      tokenRefs.current[index + 1]?.focus();
    }
  };

  const handleTokenKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !token[index] && index > 0) {
      tokenRefs.current[index - 1]?.focus();
    }
  };

  const handleTokenPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newToken = [...token];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newToken[i] = pastedData[i];
      }
    }
    
    setToken(newToken);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/login-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'validarWpp',
          whatsapp: whatsapp.replace(/\D/g, ''),
        }),
      });

      const data = await response.json();

      if (data.status === 'autorizado') {
        setTempUserData({ userUid: data.userUid });
        setShowTokenInput(true);
      } else if (data.status === 'inexistente') {
        setError('WhatsApp não encontrado');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('Erro ao validar WhatsApp. Por favor, tente novamente.');
      setIsSubmitting(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUserData?.userUid) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/login-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'login',
          token: token.join(''),
          userId: tempUserData.userUid
        }),
      });

      const data = await response.json();

      if (data.status === 'valido') {
        setAuth(data.userId, data.empresaId);
        closeModal();
        navigate('/dashboard');
      } else {
        setError('Token inválido');
      }
    } catch (err) {
      setError('Erro ao validar token. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setShowTokenInput(false);
    setIsSubmitting(false);
    setToken(['', '', '', '', '', '']);
    setWhatsapp('');
    setEmail('');
    setError('');
    setTempUserData(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col items-center justify-center space-y-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center"
      >
        <UserCircle className="w-10 h-10 text-emerald-500" />
      </motion.div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {showTokenInput ? 'Bem-vindo de volta!' : 'Fazer Login'}
        </h2>
        <p className="mt-2 text-gray-600">
          {showTokenInput 
            ? 'Digite o código enviado para seu WhatsApp'
            : 'Escolha como deseja se conectar:'}
        </p>
      </div>

      {!showTokenInput ? (
        <>
          <div className="relative inline-flex bg-gray-100 rounded-lg p-1 shadow-inner">
            <button
              onClick={() => setIsWhatsAppLogin(true)}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                isWhatsAppLogin 
                  ? 'bg-white text-gray-900 shadow-md transform translate-y-[-1px]' 
                  : 'text-gray-600'
              }`}
              disabled={isSubmitting}
            >
              WhatsApp
            </button>
            <button
              onClick={() => setIsWhatsAppLogin(false)}
              className={`px-4 py-2 rounded-md transition-all duration-200 ${
                !isWhatsAppLogin 
                  ? 'bg-white text-gray-900 shadow-md transform translate-y-[-1px]' 
                  : 'text-gray-600'
              }`}
              disabled={isSubmitting}
            >
              E-mail
            </button>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {isWhatsAppLogin ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp
                </label>
                <IMaskInput
                  mask="(00) 00000-0000"
                  value={whatsapp}
                  onAccept={(value: string) => setWhatsapp(value)}
                  placeholder="(00) 00000-0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  disabled={isSubmitting}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  disabled={isSubmitting}
                />
              </div>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-center text-red-600"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || (!whatsapp && !email)}
              className="w-full py-3 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                       transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Validando...' : 'Confirmar'}
            </motion.button>
          </form>

          {!isSubmitting && (
            <p className="text-sm text-gray-600">
              Ainda não tem conta?{' '}
              <button
                onClick={() => setView('signup')}
                className="text-emerald-500 hover:text-emerald-600 font-medium"
              >
                Cadastre-se agora!
              </button>
            </p>
          )}
        </>
      ) : (
        <form onSubmit={handleTokenSubmit} className="w-full space-y-6">
          <div className="flex justify-center gap-2">
            {token.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (tokenRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleTokenChange(index, e.target.value)}
                onKeyDown={(e) => handleTokenKeyDown(index, e)}
                onPaste={handleTokenPaste}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg font-semibold
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-center text-red-600"
            >
              {error}
            </motion.p>
          )}

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || token.some(t => !t)}
              className="w-full py-3 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                       transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Validando...' : 'Fazer Login'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleRestart}
              className="w-full py-3 px-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 
                       transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-red-500"
            >
              Recomeçar
            </motion.button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default LoginForm;