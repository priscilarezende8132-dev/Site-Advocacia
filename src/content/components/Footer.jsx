import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faPhoneAlt, 
  faEnvelope, 
  faClock 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faInstagram, 
  faTiktok, 
  faFacebookF, 
  faWhatsapp 
} from '@fortawesome/free-brands-svg-icons';

export default function Footer({ siteName, oab, phone, email, address, whatsapp }) {
  const currentYear = new Date().getFullYear();

  // Links das redes sociais (mesmos do Contato.jsx)
  const socialLinks = {
    instagram: "https://www.instagram.com/edsonmaltezadvocacia?igsh=cmVtNjUyZHlmZDZ3&utm_source=qr",
    tiktok: "https://www.tiktok.com/@dr..edson.maltez?_r=1&_t=ZS-94J2UOV6ho8",
    facebook: "https://www.facebook.com/share/18Evchghd7/?mibextid=wwXIfr"
  };

  return (
    <footer className="bg-[#0B1A33] text-white border-t border-white/10">
      {/* Main Footer */}
      <div className="container-custom px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          
          {/* Coluna 1 - Sobre */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-xl sm:text-2xl lg:text-2xl font-serif font-bold text-white tracking-tight">
                {siteName}
              </h3>
              <p className="text-xs sm:text-sm text-white/60 font-light tracking-wide">
                {oab}
              </p>
            </div>
            
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
              Excelência e compromisso com seus direitos há mais de 12 anos. 
              Atuação nas áreas Cível, Trabalhista e Criminal com ética, 
              dedicação e atenção personalizada a cada cliente.
            </p>

            {/* Selo de confiança */}
            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 pt-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 rounded-full flex items-center justify-center">
                <span className="text-accent text-base sm:text-lg">⚖️</span>
              </div>
              <div className="text-left">
                <p className="text-[10px] sm:text-xs text-white/40">Confiança e</p>
                <p className="text-xs sm:text-sm text-white/80">Tradição desde 2014</p>
              </div>
            </div>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <h4 className="text-xs sm:text-sm font-semibold text-accent tracking-[0.2em] uppercase">
              Navegação
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: 'Início', path: '/' },
                { name: 'Artigos', path: '/blog' },
                { name: 'Sobre', path: '/sobre' },
                { name: 'Contato', path: '/contato' }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="group flex items-center justify-center sm:justify-start gap-2 text-white/70 hover:text-accent transition-colors"
                  >
                    <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="text-xs sm:text-sm">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Links institucionais */}
            <div className="pt-2 sm:pt-4 space-y-1 sm:space-y-2">
              <a href="#" className="block text-[10px] sm:text-xs text-white/40 hover:text-white/60 transition">
                Política de Privacidade
              </a>
              <a href="#" className="block text-[10px] sm:text-xs text-white/40 hover:text-white/60 transition">
                Termos de Uso
              </a>
            </div>
          </div>

          {/* Coluna 3 - Contato */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <h4 className="text-xs sm:text-sm font-semibold text-accent tracking-[0.2em] uppercase">
              Contato
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-accent text-base sm:text-lg mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] sm:text-xs text-white/40 mb-0.5 sm:mb-1">Endereço</p>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                    {address}
                  </p>
                </div>
              </li>
              
              <li className="flex items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3">
                <FontAwesomeIcon icon={faPhoneAlt} className="text-accent text-base sm:text-lg mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] sm:text-xs text-white/40 mb-0.5 sm:mb-1">Telefone / WhatsApp</p>
                  <a
                    href={`tel:${phone}`}
                    className="text-white/80 text-xs sm:text-sm hover:text-accent transition block"
                  >
                    {phone}
                  </a>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 text-xs sm:text-sm hover:text-accent transition block mt-1 inline-flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="text-accent text-xs" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </li>
              
              <li className="flex items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-accent text-base sm:text-lg mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] sm:text-xs text-white/40 mb-0.5 sm:mb-1">E-mail</p>
                  <a
                    href={`mailto:${email}`}
                    className="text-white/80 text-xs sm:text-sm hover:text-accent transition break-all"
                  >
                    {email}
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Coluna 4 - Horário e Redes Sociais (CORES OFICIAIS) */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <h4 className="text-xs sm:text-sm font-semibold text-accent tracking-[0.2em] uppercase">
              Atendimento
            </h4>
            <div className="space-y-2 max-w-[200px] mx-auto sm:mx-0">
              <div className="flex justify-between sm:justify-start sm:gap-8 text-xs sm:text-sm text-white/80">
                <span>Seg a Sex</span>
                <span className="text-white/60">9h às 17h</span>
              </div>
              <div className="flex justify-between sm:justify-start sm:gap-8 text-xs sm:text-sm text-white/80">
                <span>Sáb/Dom</span>
                <span className="text-white/60">Fechado</span>
              </div>
            </div>

            {/* Redes Sociais - Cores Oficiais (sem hover para cor principal) */}
            <div className="pt-4 sm:pt-6">
              <h5 className="text-[10px] sm:text-xs text-white/40 mb-2 sm:mb-3 tracking-wider">SIGA-NOS</h5>
              <div className="flex justify-center sm:justify-start gap-2 sm:gap-3">
                {/* Instagram - Gradiente oficial */}
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                  }}
                  aria-label="Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} className="text-sm sm:text-base" />
                </a>

                {/* TikTok - Preto oficial */}
                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg"
                  style={{ backgroundColor: '#000000' }}
                  aria-label="TikTok"
                >
                  <FontAwesomeIcon icon={faTiktok} className="text-sm sm:text-base" />
                </a>

                {/* Facebook - Azul oficial */}
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg"
                  style={{ backgroundColor: '#1877f2' }}
                  aria-label="Facebook"
                >
                  <FontAwesomeIcon icon={faFacebookF} className="text-sm sm:text-base" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Direitos autorais */}
      <div className="border-t border-white/10">
        <div className="container-custom px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
            <p className="text-[10px] sm:text-xs text-white/40 text-center sm:text-left">
              © {currentYear} {siteName}. Todos os direitos reservados.
            </p>
            <p className="text-[8px] sm:text-[10px] text-white/20">
              OAB/SP {oab.replace('OAB/SP ', '')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}