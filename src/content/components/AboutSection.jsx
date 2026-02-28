export default function AboutSection({ lawyerName, lawyerBio, lawyerPhoto, experience, cases, specializations }) {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          
          {/* Image Gallery - Mobile First */}
          <div className="relative max-w-md mx-auto lg:mx-0 w-full">
            {/* Main Image */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl md:shadow-2xl group">
              <img
                src={lawyerPhoto}
                alt={lawyerName}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Floating Cards - Ajustados para mobile */}
            <div className="absolute -bottom-6 sm:-bottom-8 -right-4 sm:-right-6 lg:-right-8 bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow-xl lg:shadow-2xl z-20 animate-float">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">{experience}+</p>
              <p className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Anos de experiência</p>
            </div>
            
            <div className="absolute -top-6 sm:-top-8 -left-4 sm:-left-6 lg:-left-8 bg-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow-xl lg:shadow-2xl z-20 animate-float" style={{ animationDelay: '1s' }}>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">{cases}+</p>
              <p className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Casos bem-sucedidos</p>
            </div>

            {/* Decorative elements - adaptados */}
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl blur-xl lg:blur-2xl transform rotate-2 lg:rotate-3"></div>
          </div>

          {/* Content - Mobile First */}
          <div className="space-y-4 sm:space-y-5 lg:space-y-6 text-center lg:text-left">
            <div>
              <span className="text-accent font-semibold tracking-wider uppercase text-xs sm:text-sm inline-block mb-2">
                Sobre o advogado
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
                {lawyerName}
              </h2>
            </div>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              {lawyerBio}
            </p>

            {/* Specializations Grid - Mobile First */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4">
              {(specializations || [
                { icon: "⚖️", title: "Direito Civil" },
                { icon: "📄", title: "Direito Trabalhista" },
                { icon: "🔒", title: "Direito Criminal" },
                { icon: "🏛️", title: "Direito Empresarial" }
              ]).map((spec, index) => (
                <div
                  key={index}
                  className="bg-white p-3 sm:p-4 lg:p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 group"
                >
                  <span className="text-2xl sm:text-3xl lg:text-3xl mb-1 sm:mb-2 block group-hover:scale-110 transition-transform">
                    {spec.icon}
                  </span>
                  <h3 className="font-semibold text-primary text-xs sm:text-sm lg:text-base whitespace-nowrap">
                    {spec.title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Trust badges - Mobile First */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 pt-4 sm:pt-5 lg:pt-6">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 text-xs sm:text-sm">OAB/SP 344.956</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 text-xs sm:text-sm">Membro da OAB desde 2012</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}