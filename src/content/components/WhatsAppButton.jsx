import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

export default function WhatsAppButton({ whatsapp }) {
  const [show, setShow] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar botão do WhatsApp após 300px
      setShow(window.scrollY > 300);
      
      // Mostrar botão de voltar ao topo após 500px
      setShowTopButton(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const defaultMessage = encodeURIComponent(
    "Olá! Gostaria de mais informações sobre os serviços de advocacia."
  );

  const whatsappLink = `https://wa.me/${whatsapp}?text=${defaultMessage}`;

  return (
    <>
      {/* Botão do WhatsApp - lado direito */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed z-50 transition-all duration-500 ${
          show 
            ? 'opacity-100 visible scale-100' 
            : 'opacity-0 invisible scale-50'
        } bottom-16 right-6 sm:bottom-20 sm:right-8`}
        aria-label="WhatsApp"
      >
        {/* Container principal */}
        <div className="relative group">
          {/* Ondas de pulsação */}
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40" style={{ transform: 'scale(1.2)' }}></div>
          <div className="absolute inset-0 rounded-full bg-green-400 animate-pulse opacity-30" style={{ transform: 'scale(1.1)' }}></div>
          
          {/* Botão principal */}
          <div className="relative bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full shadow-2xl active:shadow-lg active:scale-95 transition-all duration-200 overflow-hidden">
            
            {/* Efeito de brilho no toque */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-300"></div>
            
            {/* Ícone */}
            <div className="p-5 sm:p-6">
              <FontAwesomeIcon 
                icon={faWhatsapp} 
                className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-xl"
              />
            </div>
          </div>

          {/* Badge "ONLINE" */}
          <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3">
            <div className="relative">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-400 rounded-full animate-ping absolute"></div>
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white relative flex items-center justify-center">
                <span className="text-[8px] sm:text-[10px] font-bold text-white">✓</span>
              </div>
            </div>
          </div>

          {/* Mini texto "WhatsApp" */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-900/90 text-white text-xs sm:text-sm py-1.5 px-3 rounded-full backdrop-blur-sm">
            WhatsApp
            <span className="ml-1 text-green-400">●</span>
          </div>
        </div>
      </a>

      {/* Botão de Voltar ao Topo - lado esquerdo (mesma altura do WhatsApp) */}
      <button
        onClick={scrollToTop}
        className={`fixed z-50 transition-all duration-500 ${
          showTopButton 
            ? 'opacity-100 visible scale-100' 
            : 'opacity-0 invisible scale-50'
        } bottom-16 left-6 sm:bottom-20 sm:left-8`}
        aria-label="Voltar ao topo"
      >
        <div className="relative group">
          {/* Efeito de brilho */}
          <div className="absolute inset-0 rounded-full bg-blue-500 animate-pulse opacity-20" style={{ transform: 'scale(1.1)' }}></div>
          
          {/* Botão principal */}
          <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/30 active:shadow-lg active:scale-95 transition-all duration-200 overflow-hidden">
            
            {/* Efeito de brilho no hover/toque */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300"></div>
            
            {/* Ícone */}
            <div className="p-4 sm:p-5">
              <FontAwesomeIcon 
                icon={faArrowUp} 
                className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-lg"
              />
            </div>
          </div>

          {/* Mini texto "Topo" */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-900/90 text-white text-xs sm:text-sm py-1.5 px-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Voltar ao topo
          </div>
        </div>
      </button>
    </>
  );
}