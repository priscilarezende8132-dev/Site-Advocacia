import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faBriefcase, 
  faBuilding, 
  faHouse, 
  faScaleBalanced, 
  faFileLines,
  faArrowRight 
} from '@fortawesome/free-solid-svg-icons';

export default function PracticeAreas() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const areas = [
    {
      icon: faUsers,
      title: "Direito de Família",
      description: "Divórcio, guarda de filhos, pensão alimentícia, inventários e planejamento familiar com sensibilidade e agilidade.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: faBriefcase,
      title: "Direito Trabalhista",
      description: "Defesa dos direitos trabalhistas, ações de indenização, acordos e consultoria preventiva para empresas.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: faBuilding,
      title: "Direito Empresarial",
      description: "Assessoria completa para empresas, contratos, planejamento societário e recuperação judicial.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: faHouse,
      title: "Direito Imobiliário",
      description: "Compra e venda de imóveis, contratos de locação, regularização de propriedades e usucapião.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: faScaleBalanced,
      title: "Direito Civil",
      description: "Ações de indenização, contratos em geral, responsabilidade civil e obrigações.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: faFileLines,
      title: "Direito do Consumidor",
      description: "Defesa contra abusos de empresas, revisão de contratos, indenizações e danos morais.",
      color: "from-teal-500 to-teal-600"
    }
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gray-50">
      <div className="container-custom px-4 sm:px-6">
        
        {/* Cabeçalho da seção - Responsivo */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16">
          <span className="text-accent font-semibold tracking-wider uppercase text-xs sm:text-sm inline-block mb-2">
            Especialidades
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mt-2 mb-3 sm:mb-4">
            Áreas de Atuação
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg px-4">
            Atendimento especializado nas principais áreas do direito, 
            sempre com foco na melhor solução para cada caso.
          </p>
        </div>

        {/* Grid de áreas - Responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {areas.map((area, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Hover Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Conteúdo do card - Responsivo */}
              <div className="p-5 sm:p-6 md:p-8">
                
                {/* Ícone - Responsivo */}
                <div className="mb-3 sm:mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <FontAwesomeIcon 
                    icon={area.icon} 
                    className="text-3xl sm:text-4xl md:text-5xl text-accent"
                  />
                </div>
                
                {/* Título */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-2 sm:mb-3 group-hover:text-accent transition-colors">
                  {area.title}
                </h3>
                
                {/* Descrição - com limite de linhas */}
                <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 line-clamp-4">
                  {area.description}
                </p>
                
                {/* Link "Saiba mais" */}
                <Link 
                  to="/contato"
                  className="inline-flex items-center text-accent font-medium text-xs sm:text-sm group/link hover:text-primary transition-colors"
                >
                  <span>Saiba mais</span>
                  <FontAwesomeIcon 
                    icon={faArrowRight} 
                    className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover/link:translate-x-1 transition-transform" 
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}