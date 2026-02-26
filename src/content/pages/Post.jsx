import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { loadContent } from '/src/utils/contentLoader';
import '../styles/animations.css';

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({
    siteName: 'Dr. Carlos Silva',
    oab: 'OAB/SP 123.456',
    whatsapp: '5511999999999'
  });

  useEffect(() => {
    async function loadData() {
      try {
        const settingsData = await loadContent('/src/content/settings/general.md');
        setContent((prev) => ({ ...prev, ...settingsData?.data }));

        const response = await fetch(`/content/posts/${slug}.md`);

        if (response.ok) {
          const text = await response.text();
          const { data, content } = parseFrontmatter(text);
          setPost({ slug, data, content });
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error('Erro ao carregar post:', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  function parseFrontmatter(text) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { data: {}, content: text };

    const data = {};
    match[1].split('\n').forEach((line) => {
      if (line.includes(': ')) {
        const [key, ...value] = line.split(': ');
        data[key.trim()] = value.join(': ').trim();
      }
    });

    return { data, content: match[2] };
  }

  function renderMarkdown(content) {
    if (!content) return '';
    marked.setOptions({
      breaks: true,
      gfm: true
    });
    return marked.parse(content);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-accent text-2xl">⚖️</span>
            </div>
          </div>
          <p className="text-white/70 mt-6 font-light tracking-wide">Carregando artigo...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center text-white max-w-md px-6">
          <span className="text-7xl mb-6 block opacity-50">📄</span>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-white bg-clip-text text-transparent">
            Artigo não encontrado
          </h1>
          <p className="text-white/60 mb-8">O artigo que você procura pode ter sido removido ou ainda não foi publicado.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-accent/25"
          >
            <span>←</span> Explorar artigos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />

      {/* Hero Section com overlay moderno */}
      <div className="relative h-[70vh] min-h-[600px] overflow-hidden">
        {post.data.image ? (
          <>
            <img
              src={post.data.image}
              alt={post.data.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary" />
        )}
        
        <div className="absolute bottom-0 left-0 right-0 container-custom pb-20 text-white">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/70 hover:text-accent mb-8 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Ver todos os artigos</span>
          </Link>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl mb-6">
            {post.data.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80">
            <span className="flex items-center gap-2">
              <span className="text-accent">📅</span>
              {new Date(post.data.date).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <span className="flex items-center gap-2">
              <span className="text-accent">⏱️</span>
              {Math.ceil(post.content.split(' ').length / 200)} min de leitura
            </span>
            {post.data.category && (
              <>
                <span className="w-1 h-1 bg-white/40 rounded-full" />
                <span className="px-4 py-1 bg-accent/20 rounded-full text-accent text-sm font-medium">
                  {post.data.category}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo principal com design clean e espaçoso */}
      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* Autor e metadados em destaque */}
        <div className="flex items-center gap-6 mb-16 p-8 bg-slate-50 rounded-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
            {post.data.author?.[0] || '👤'}
          </div>
          <div className="flex-1">
            <p className="text-sm text-accent font-medium tracking-wider mb-1">AUTOR</p>
            <p className="text-xl font-semibold text-slate-800">{post.data.author || content.siteName}</p>
          </div>
          {post.data.description && (
            <div className="hidden md:block text-right">
              <p className="text-sm text-slate-500">Resumo</p>
              <p className="text-slate-600 max-w-xs">{post.data.description.substring(0, 80)}...</p>
            </div>
          )}
        </div>

        {/* Descrição completa (se houver) */}
        {post.data.description && (
          <div className="mb-16 p-8 bg-gradient-to-r from-accent/5 to-transparent border-l-4 border-accent rounded-r-2xl">
            <p className="text-xl text-slate-700 leading-relaxed font-light italic">
              {post.data.description}
            </p>
          </div>
        )}

        {/* Artigo com tipografia refinada */}
        <article
          className="
            prose prose-lg max-w-none
            prose-headings:text-slate-800 prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-8
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-a:transition-all
            prose-strong:text-slate-800 prose-strong:font-semibold
            prose-ul:list-disc prose-ol:list-decimal prose-li:text-slate-600
            prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-600 prose-blockquote:bg-slate-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl
            prose-img:rounded-2xl prose-img:shadow-xl prose-img:mx-auto
            prose-hr:border-slate-200
          "
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* Navegação elegante entre artigos */}
        <div className="mt-20 pt-12 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <Link
              to="/blog"
              className="group flex items-center gap-3 text-slate-600 hover:text-accent transition-colors"
            >
              <span className="p-3 bg-slate-100 rounded-full group-hover:bg-accent/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </span>
              <span className="font-medium">Todos os artigos</span>
            </Link>
            
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-3 text-slate-400 hover:text-accent transition-colors"
            >
              <span className="font-medium">Voltar ao topo</span>
              <span className="p-3 bg-slate-100 rounded-full group-hover:bg-accent/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </main>

      <WhatsAppButton whatsapp={content.whatsapp} />
      <Footer
        siteName={content.siteName}
        oab={content.oab}
        phone={content.phone}
        email={content.email}
        address={content.address}
        whatsapp={content.whatsapp}
      />
    </div>
  );
}