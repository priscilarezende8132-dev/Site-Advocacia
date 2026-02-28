export default function Map({ address }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Container do mapa - Responsivo */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl
        h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] lg:aspect-square lg:h-auto">
        
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3677.531378245281!2d-47.275138524692196!3d-22.81982197931646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8bd69d6b1abfd%3A0xed42919a02b2caa2!2sR.%20Francisco%20Biancalana%2C%2031%20-%2002%20-%20Vila%20Santana%2C%20Sumar%C3%A9%20-%20SP%2C%2013170-290!5e0!3m2!1spt-BR!2sbr!4v1772202660301!5m2!1spt-BR!2sbr"
          width="100%"
          height="100%"
          style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização do escritório"
          className="w-full h-full"
        ></iframe>
      </div>

      {/* Endereço abaixo do mapa para melhor UX */}
      <p className="text-center text-gray-600 text-xs sm:text-sm mt-3 sm:mt-4">
        <span className="font-semibold text-primary">📍 {address}</span>
      </p>
    </div>
  );
}