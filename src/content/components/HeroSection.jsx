import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function HeroSection({ title, subtitle, whatsapp, heroImage }) {
  // Mensagem pré-pronta para WhatsApp
  const defaultMessage = encodeURIComponent(
    "Olá! Gostaria de mais informações sobre os serviços de advocacia."
  );

  const whatsappLink = `https://wa.me/${whatsapp}?text=${defaultMessage}`;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80 mix-blend-multiply z-10"></div>
        <img
          src={heroImage || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"}
          alt="Escritório de Advocacia"
          className="w-full h-full object-cover animate-scaleIn"
          style={{ transform: 'scale(1.1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Content */}
      <div className="container-custom px-4 sm:px-6 relative z-20 text-white">
        <div className="max-w-4xl mx-auto text-center lg:text-left">
          
          {/* Título */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6 animate-fadeInUp">
            {title || 'Excelência e Compromisso em Direito'}
          </h1>
          
          {/* Subtítulo */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 lg:mb-12 opacity-90 animate-fadeInUp delay-200 max-w-2xl mx-auto lg:mx-0">
            {subtitle || 'Há mais de 12 anos defendendo seus direitos com ética, dedicação e soluções jurídicas eficientes.'}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 animate-fadeInUp delay-400">
            
            {/* Botão Consulta */}
            <Link
              to="/contato"
              className="group bg-accent text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base lg:text-lg hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2 hover:shadow-xl w-full sm:w-auto"
            >
              <span>Agende uma consulta</span>
              <FontAwesomeIcon 
                icon={faArrowRight} 
                className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" 
              />
            </Link>
            
            {/* Botão WhatsApp com mensagem pré-pronta */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base lg:text-lg hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2 hover:shadow-xl w-full sm:w-auto relative overflow-hidden"
            >
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Fale pelo WhatsApp</span>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 mt-12 sm:mt-16 animate-fadeInUp delay-600">
            
            <div className="text-center">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">12+</p>
              <p className="text-xs sm:text-sm opacity-80 whitespace-nowrap">Anos de experiência</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">350+</p>
              <p className="text-xs sm:text-sm opacity-80 whitespace-nowrap">Casos resolvidos</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">100%</p>
              <p className="text-xs sm:text-sm opacity-80 whitespace-nowrap">Clientes satisfeitos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-1.5 sm:w-1 sm:h-2 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-5 sm:top-20 sm:left-10 w-32 sm:w-64 h-32 sm:h-64 bg-accent/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-5 sm:bottom-20 sm:right-10 w-40 sm:w-80 h-40 sm:h-80 bg-primary/20 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-700"></div>
    </section>
  );
}