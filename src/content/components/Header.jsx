import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export default function Header({ siteName, oab, whatsapp, logo }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

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
              
              {/* Imagem da logo - por cima do fundo */}
              <img
                src="/images/logo/logo-principal.png"
                alt={siteName}
                className={`relative h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40 w-auto object-contain transition-all duration-500 group-hover:scale-110 ${
                  isScrolled ? '' : 'brightness-0 invert'
                }`}
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

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
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

          {/* WHATSAPP BUTTON */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
            <span>WhatsApp</span>
          </a>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden relative w-10 h-10 flex items-center justify-center z-50 rounded-lg transition-all duration-300 ${
              isScrolled
                ? 'text-primary hover:bg-primary/10'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-current transform transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              ></span>
            </div>
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 bg-primary z-40 transition-all duration-500 md:hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full px-6">
          <div className="mb-12">
            <img
              src="/images/logo/logo-principal.png"
              alt={siteName}
              className="h-24 w-auto object-contain brightness-0 invert"
            />
          </div>

          <nav className="space-y-6 text-center">
            {['Início', 'Artigos', 'Sobre', 'Contato'].map((item) => (
              <Link
                key={item}
                to={getRoute(item)}
                className="group block relative"
                onClick={handleLinkClick}
              >
                <span className="relative z-10 text-2xl font-light text-white group-hover:text-accent transition-colors duration-300">
                  {item}
                </span>
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-accent group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          <div className="mt-12">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl"
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
              <span>WhatsApp</span>
            </a>
          </div>

          <p className="absolute bottom-8 text-white/40 text-sm">{oab || 'OAB/SP 344.956'}</p>
        </div>
      </div>
    </>
  );
}