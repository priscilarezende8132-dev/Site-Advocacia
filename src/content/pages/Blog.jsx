import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        // Lista de arquivos markdown (você precisará listar manualmente ou usar uma API)
        const postFiles = [
          'primeiro-artigo'
          // Adicione mais arquivos aqui quando criar
        ];
        
        const postsData = [];
        
        for (const slug of postFiles) {
          const response = await fetch(`/src/content/posts/${slug}.md`);
          if (response.ok) {
            const text = await response.text();
            const { data, content } = parseFrontmatter(text);
            postsData.push({
              slug,
              data,
              content: content.substring(0, 200) + '...' // Resumo
            });
          }
        }
        
        setPosts(postsData);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadPosts();
  }, []);

  function parseFrontmatter(text) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { data: {}, content: text };
    
    const data = {};
    match[1].split('\n').forEach(line => {
      const [key, ...value] = line.split(': ');
      if (key && value.length) {
        data[key.trim()] = value.join(': ').trim();
      }
    });
    
    return { data, content: match[2] };
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Carregando artigos...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary mb-4">Artigos Jurídicos</h1>
      <p className="text-xl text-gray-600 mb-12">
        Acompanhe as últimas publicações do Dr. Carlos Silva
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum artigo publicado ainda.</p>
        </div>
      )}
    </div>
  );
}