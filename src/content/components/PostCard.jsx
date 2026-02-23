// src/components/PostCard.jsx
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {post.data.image && (
        <img 
          src={post.data.image} 
          alt={post.data.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <span className="text-sm text-blue-600 font-semibold">
          {post.data.category}
        </span>
        <h2 className="text-xl font-bold mt-2 mb-3">
          <Link to={`/blog/${post.slug}`} className="hover:text-blue-600">
            {post.data.title}
          </Link>
        </h2>
        <p className="text-gray-600 mb-4">
          {post.data.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {new Date(post.data.date).toLocaleDateString('pt-BR')}
          </span>
          <Link 
            to={`/blog/${post.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Ler mais →
          </Link>
        </div>
      </div>
    </article>
  );
}