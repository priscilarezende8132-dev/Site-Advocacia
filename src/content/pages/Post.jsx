import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        // Buscar o arquivo markdown via fetch
        const response = await fetch(`/src/content/posts/${slug}.md`);
        
        if (!response.ok) {
          setLoading(false);
          return;
        }

        const text = await response.text();
        
        // Parse simples do frontmatter
        const matter = parseFrontmatter(text);
        
        setPost({
          slug,
          data: matter.data,
          content: matter.content
        });
      } catch (error) {
        console.error('Erro ao carregar post:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [slug]);

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
    <div style={{ textAlign: 'center', padding: '50px' }}>
      Carregando artigo...
    </div>
  );
  
  if (!post) return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Artigo não encontrado</h2>
      <Link to="/blog">Voltar para o blog</Link>
    </div>
  );

  return (
    <article style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial'
    }}>
      <Link to="/blog" style={{ 
        color: '#1e3a8a',
        textDecoration: 'none',
        display: 'inline-block',
        marginBottom: '20px'
      }}>
        ← Voltar para artigos
      </Link>
      
      {post.data.image && (
        <img 
          src={post.data.image} 
          alt={post.data.title}
          style={{
            width: '100%',
            height: '400px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '20px'
          }}
        />
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <span style={{ 
          color: '#1e3a8a',
          fontWeight: 'bold'
        }}>
          {post.data.category}
        </span>
        <h1 style={{ 
          fontSize: '36px',
          margin: '10px 0'
        }}>
          {post.data.title}
        </h1>
        <div style={{ color: '#666' }}>
          <span>
            {new Date(post.data.date).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
      
      <div style={{ 
        lineHeight: '1.8',
        fontSize: '18px'
      }}>
        {post.content.split('\n').map((paragraph, i) => (
          <p key={i} style={{ marginBottom: '20px' }}>
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}