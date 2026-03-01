import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWhatsapp, 
  faInstagram, 
  faTiktok, 
  faFacebookF 
} from '@fortawesome/free-brands-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Header({ siteName, oab, whatsapp, logo }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const menuRef = useRef(null);

  // Links das redes sociais
  const socialLinks = {
    instagram: "https://www.instagram.com/edsonmaltezadvocacia?igsh=cmVtNjUyZHlmZDZ3&utm_source=qr",
    tiktok: "https://www.tiktok.com/@dr..edson.maltez?_r=1&_t=ZS-94J2UOV6ho8",
    facebook: "https://www.facebook.com/share/18Evchghd7/?mibextid=wwXIfr"
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      setDragOffset(0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const defaultMessage = encodeURIComponent(
    'Olá! Gostaria de mais informações sobre os serviços de advocacia.'
  );

  const whatsappLink = `https://wa.me/${whatsapp || ''}?text=${defaultMessage}`;

  const getRoute = (item) => {
    switch (item) {
      case 'Início':
        return '/';
      case 'Artigos':
        return '/blog';
      case 'Sobre':
        return '/sobre';
      case 'Contato':
        return '/contato';
      default:
        return '/';
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Funções de drag
  const handleDragStart = (e) => {
    setDragStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - dragStartY;
    
    // Só permite arrastar para baixo (valores positivos)
    if (deltaY > 0) {
      setDragOffset(deltaY);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Se arrastou mais de 100px, fecha o menu
    if (dragOffset > 100) {
      setIsMenuOpen(false);
    } else {
      // Se não, volta à posição original
      setDragOffset(0);
    }
  };

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container-custom px-4 flex justify-between items-center">
          {/* LOGO + NOME + OAB */}
          <Link
            to="/"
            className="relative z-50 flex items-center gap-3 sm:gap-4 group"
            onMouseEnter={() => setHoveredLink('logo')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {/* CONTAINER DA LOGO COM FUNDO AZUL MENOR */}
            <div className="relative flex items-center justify-center">
              {/* Fundo azul - retangular e MENOR que a imagem */}
              {isScrolled && (
                <div className="absolute bg-primary rounded-md" style={{
                  width: '80%',
                  height: '70%',
                  left: '10%',
                  top: '15%'
                }}></div>
              )}
              
              {/* LOGO - GIGANTE NO MOBILE (160px) */}
              <img
                src="/images/logo/logo-principal.png"
                alt={siteName}
                className={`relative w-auto object-contain transition-all duration-500 group-hover:scale-110 ${
                  isScrolled ? '' : 'brightness-0 invert'
                }`}
                style={{
                  height: '160px' // 160px no mobile
                }}
              />
            </div>

            {/* Nome e OAB */}
            <div className="flex flex-col">
              <h1
                className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight transition-all duration-300 ${
                  isScrolled ? 'text-primary' : 'text-white'
                } group-hover:translate-x-1`}
              >
                {siteName || 'Edson Silva Maltez'}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-500 group-hover:w-full"></span>
              </h1>
              <p
                className={`text-sm sm:text-base transition-all duration-300 delay-100 ${
                  isScrolled ? 'text-gray-600' : 'text-white/80'
                } group-hover:translate-x-2`}
              >
                {oab || 'OAB/SP 344.956'}
              </p>
            </div>
          </Link>

          {/* DESKTOP MENU E REDES SOCIAIS */}
          <div className="hidden md:flex items-center gap-6">
            {/* Menu */}
            <nav className="flex items-center space-x-6 lg:space-x-8">
              {['Início', 'Artigos', 'Sobre', 'Contato'].map((item) => (
                <Link
                  key={item}
                  to={getRoute(item)}
                  className="relative group px-2 py-1 overflow-hidden"
                  onMouseEnter={() => setHoveredLink(item)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <span
                    className={`relative z-10 font-medium transition-all duration-300 text-sm lg:text-base ${
                      isScrolled ? 'text-gray-700' : 'text-white'
                    } group-hover:text-accent`}
                  >
                    {item}
                  </span>
                  <span className="absolute inset-0 bg-accent/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></span>
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-accent group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* Redes Sociais - Ícones com cores oficiais */}
            <div className="flex items-center gap-2 border-l border-white/20 pl-6">
              {/* Instagram */}
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                }}
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-base" />
              </a>

              {/* TikTok */}
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg"
                style={{ backgroundColor: '#000000' }}
                aria-label="TikTok"
              >
                <FontAwesomeIcon icon={faTiktok} className="text-base" />
              </a>

              {/* Facebook */}
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg"
                style={{ backgroundColor: '#1877f2' }}
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} className="text-base" />
              </a>
            </div>

            {/* WhatsApp Button */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`md:hidden relative w-10 h-10 flex items-center justify-center z-50 rounded-lg transition-all duration-300 ${
              isScrolled
                ? 'text-primary hover:bg-primary/10'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className="w-full h-0.5 bg-current transform transition-all duration-300"></span>
              <span className="w-full h-0.5 bg-current transition-all duration-300"></span>
              <span className="w-full h-0.5 bg-current transform transition-all duration-300"></span>
            </div>
          </button>
        </div>
      </header>

      {/* MENU BOTTOM SHEET COM DRAG TO CLOSE */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ${
        isMenuOpen ? 'visible' : 'invisible'
      }`}>
        {/* Overlay escuro */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu que sobe de baixo - COM DRAG TO CLOSE */}
        <div 
          ref={menuRef}
          className={`absolute bottom-0 left-0 right-0 bg-primary rounded-t-3xl shadow-2xl transition-transform duration-300 ${
            isMenuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{
            transform: isMenuOpen ? `translateY(${dragOffset}px)` : 'translateY(100%)',
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          
          {/* Handle (indicador) - Área de drag */}
          <div className="w-full py-2 flex justify-center cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1 bg-white/40 rounded-full hover:bg-white/60 transition-colors"></div>
          </div>
          
          <div className="px-6 py-4 pb-8">
            {/* Logo no menu */}
            <div className="flex items-center justify-between mb-6">
              <img 
                src="/images/logo/logo-principal.png" 
                alt={siteName} 
                className="w-auto brightness-0 invert"
                style={{
                  height: '140px'
                }}
              />
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"
              >
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
              </button>
            </div>

            {/* Links do menu */}
            <nav className="space-y-1 mb-6">
              {['Início', 'Artigos', 'Sobre', 'Contato'].map((item) => (
                <Link
                  key={item}
                  to={getRoute(item)}
                  className="block py-4 px-4 text-xl text-white hover:bg-white/10 rounded-xl transition-all"
                  onClick={handleLinkClick}
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Redes sociais em linha */}
            <div className="flex gap-3 mb-6">
              {/* Instagram */}
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-white hover:scale-105 transition-all"
                style={{
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                }}
                onClick={handleLinkClick}
              >
                <FontAwesomeIcon icon={faInstagram} className="text-lg" />
                <span className="text-sm font-medium">Instagram</span>
              </a>

              {/* TikTok */}
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-white hover:scale-105 transition-all"
                style={{ backgroundColor: '#000000' }}
                onClick={handleLinkClick}
              >
                <FontAwesomeIcon icon={faTiktok} className="text-lg" />
                <span className="text-sm font-medium">TikTok</span>
              </a>

              {/* Facebook */}
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-white hover:scale-105 transition-all"
                style={{ backgroundColor: '#1877f2' }}
                onClick={handleLinkClick}
              >
                <FontAwesomeIcon icon={faFacebookF} className="text-lg" />
                <span className="text-sm font-medium">Facebook</span>
              </a>
            </div>

            {/* WhatsApp Button */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-lg font-medium transition-all hover:scale-105"
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
              <span>WhatsApp</span>
            </a>

            {/* OAB */}
            <p className="text-white/30 text-xs text-center mt-4">{oab || 'OAB/SP 344.956'}</p>
          </div>
        </div>
      </div>
    </>
  );
}