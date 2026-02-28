import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

export default function PostCard({ post }) {
  return (
    <article className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      
      {/* Imagem do post - Responsiva */}
      {post.data.image && (
        <div className="relative w-full overflow-hidden">
          <img 
            src={post.data.image} 
            alt={post.data.title}
            className="w-full h-40 sm:h-48 md:h-56 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}

      {/* Conteúdo do card */}
      <div className="p-4 sm:p-5 md:p-6">
        
        {/* Categoria */}
        <span className="inline-block text-xs sm:text-sm text-accent font-semibold mb-2">
          {post.data.category || 'Direito'}
        </span>

        {/* Título */}
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-primary mb-2 line-clamp-2">
          <Link to={`/blog/${post.slug}`} className="hover:text-accent transition-colors">
            {post.data.title || 'Sem título'}
          </Link>
        </h2>

        {/* Descrição/Resumo */}
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
          {post.data.description || post.content}
        </p>

        {/* Footer do card */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          
          {/* Data */}
          <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-accent text-xs" />
            {post.data.date 
              ? new Date(post.data.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short'
                })
              : 'Data não informada'}
          </span>

          {/* Link Ler mais */}
          <Link 
            to={`/blog/${post.slug}`}
            className="flex items-center gap-1 sm:gap-2 text-accent hover:text-primary font-medium text-xs sm:text-sm transition-colors group/link"
          >
            <span>Ler mais</span>
            <FontAwesomeIcon 
              icon={faArrowRight} 
              className="text-xs group-hover/link:translate-x-1 transition-transform" 
            />
          </Link>
        </div>
      </div>
    </article>
  );
}