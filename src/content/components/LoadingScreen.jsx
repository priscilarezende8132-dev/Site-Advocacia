import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScaleBalanced } from '@fortawesome/free-solid-svg-icons';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="text-center w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
        
        {/* Container do spinner - Responsivo */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-5 md:mb-6">
          
          {/* Anel externo */}
          <div className="absolute inset-0 border-2 sm:border-3 md:border-4 border-accent/20 rounded-full"></div>
          
          {/* Spinner animado */}
          <div className="absolute inset-0 border-2 sm:border-3 md:border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          
          {/* Ícone central - FontAwesome oficial */}
          <div className="absolute inset-0 flex items-center justify-center">
            <FontAwesomeIcon 
              icon={faScaleBalanced} 
              className="text-accent text-xl sm:text-2xl md:text-3xl"
            />
          </div>
        </div>

        {/* Texto de carregamento - Responsivo */}
        <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-light tracking-wider animate-pulse">
          Carregando...
        </p>

        {/* Mensagem opcional para melhor UX (pode remover se preferir) */}
        <p className="text-white/40 text-[10px] sm:text-xs mt-2 sm:mt-3 md:mt-4">
          Por favor, aguarde um momento
        </p>
      </div>
    </div>
  );
}