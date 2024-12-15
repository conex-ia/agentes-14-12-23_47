import React, { useEffect, useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollTo } from '../hooks/useScrollTo';
import useAuthModal from '../hooks/useAuthModal';
import useAuth from '../stores/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollTo = useScrollTo();
  const { openModal } = useAuthModal();
  const { userUid, clearAuth } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const navItems = [
    { label: 'Serviços', id: 'servicos' },
    { label: 'Recursos', id: 'recursos' },
    { label: 'Vantagens', id: 'vantagens' },
    { label: 'Sobre', id: 'sobre' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/30 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold">
              <span className="text-white">Conex</span>
              <span className="text-emerald-500">IA</span>
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-white hover:text-emerald-400 transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
              {userUid ? (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors duration-200"
                >
                  <LogOut size={18} />
                  Sair
                </button>
              ) : (
                <button 
                  onClick={() => openModal('login')}
                  className="px-6 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors duration-200"
                >
                  Área do Cliente
                </button>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <button className="text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;