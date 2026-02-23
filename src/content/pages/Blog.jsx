// src/pages/Blog.jsx
import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        // Importa todos os arquivos .md da pasta content/posts
        const postFiles = import.meta.glob('../content/posts/*.md');
        const postsData = [];

        for (const path in postFiles) {
          const module = await postFiles[path]();
          
          // Extrai o slug do nome do arquivo
          const slug = path.replace('../content/posts/', '').replace('.md', '');
          
          // Processa o frontmatter (metadata) do markdown
          const response = await fetch(path.replace('../', '/src/'));
          const text = await response.text();
          
          // Parse simples do frontmatter (você pode usar gray-matter)
          const matter = parseFrontmatter(text);
          
          postsData.push({
            slug,
            data: matter.data,
            content: matter.content
          });
        }

        // Ordena por data (mais recentes primeiro)
        postsData.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
        setPosts(postsData);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  // Função simples para parsear frontmatter
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

  if (loading) return <div>Carregando artigos...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Artigos Jurídicos</h1>
      <p className="text-xl text-gray-600 mb-12">
        Conteúdo atualizado sobre legislação e direitos
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}