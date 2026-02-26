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
    whatsapp: '5511999999999',
    phone: '(11) 1234-5678',
    email: 'contato@drcarlos.adv.br',
    address: 'Av. Paulista, 1000 - São Paulo/SP'
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
    marked.setOptions({ breaks: true, gfm: true });
    return marked.parse(content);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gold-500/80 font-light tracking-wider">CARREGANDO ARTIGO</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <span className="text-8xl block mb-6 opacity-30">⚖️</span>
          <h1 className="text-3xl text-white font-light mb-3">ARTIGO NÃO ENCONTRADO</h1>
          <p className="text-white/40 text-sm mb-8">O conteúdo que você procura pode ter sido movido ou removido.</p>
          <Link to="/blog" className="inline-block px-8 py-3 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-900 transition duration-300 text-sm tracking-wider">
            ← VOLTAR AO BLOG
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />

      {/* HERO SECTION - IMPONENTE */}
      <div className="relative h-[70vh] min-h-[600px] overflow-hidden">
        {/* Overlay gradiente sofisticado */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/50 to-navy-900/30 z-10"></div>
        
        {/* Imagem de fundo (se houver) */}
        {post.data.image ? (
          <img
            src={post.data.image}
            alt={post.data.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-navy-900">
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>
        )}

        {/* Conteúdo do hero */}
        <div className="absolute bottom-0 left-0 right-0 z-20 container-custom pb-20 text-white">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-gold-500 transition-colors mb-8 text-sm tracking-wider group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>TODOS OS ARTIGOS</span>
          </Link>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight max-w-5xl mb-8">
            {post.data.title}
          </h1>
          
          {/* Metadados elegantes */}
          <div className="flex flex-wrap items-center gap-6 text-white/70">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gold-500">
                📅
              </span>
              <span className="text-sm tracking-wide">
                {new Date(post.data.date).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }).toUpperCase()}
              </span>
            </div>
            
            <div className="w-px h-8 bg-white/20"></div>
            
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gold-500">
                ⏱️
              </span>
              <span className="text-sm tracking-wide">
                {Math.ceil(post.content.split(' ').length / 200)} MIN DE LEITURA
              </span>
            </div>
            
            {post.data.category && (
              <>
                <div className="w-px h-8 bg-white/20"></div>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gold-500">
                    🏷️
                  </span>
                  <span className="text-sm tracking-wide">{post.data.category.toUpperCase()}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* Barra de autor e metadados */}
        <div className="flex items-center justify-between mb-16 p-8 bg-navy-50 rounded-sm">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-navy-900 rounded-full flex items-center justify-center text-white text-2xl">
              ⚖️
            </div>
            <div>
              <p className="text-xs text-gold-600 tracking-widest mb-1">AUTOR</p>
              <p className="text-xl font-light text-navy-900">{post.data.author || content.siteName}</p>
              <p className="text-sm text-navy-400">{content.oab}</p>
            </div>
          </div>
          
          {post.data.description && (
            <div className="hidden lg:block text-right max-w-xs">
              <p className="text-xs text-gold-600 tracking-widest mb-1">RESUMO</p>
              <p className="text-sm text-navy-600 italic">"{post.data.description.substring(0, 80)}..."</p>
            </div>
          )}
        </div>

        {/* Descrição completa (se houver) */}
        {post.data.description && (
          <div className="mb-16 p-8 bg-navy-50 border-l-4 border-gold-500">
            <p className="text-xl text-navy-700 leading-relaxed font-light">
              {post.data.description}
            </p>
          </div>
        )}

        {/* ARTIGO COM TIPOGRAFIA SOFISTICADA */}
        <article
          className="
            prose prose-lg max-w-none
            prose-headings:font-light prose-headings:text-navy-900 prose-headings:tracking-tight
            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
            prose-p:text-navy-600 prose-p:leading-relaxed prose-p:mb-8 prose-p:text-lg
            prose-a:text-gold-600 prose-a:no-underline hover:prose-a:border-b hover:prose-a:border-gold-600 prose-a:transition-all
            prose-strong:text-navy-900 prose-strong:font-medium
            prose-ul:list-disc prose-ol:list-decimal prose-li:text-navy-600
            prose-blockquote:border-l-4 prose-blockquote:border-gold-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-navy-500 prose-blockquote:bg-navy-50 prose-blockquote:py-4 prose-blockquote:px-6
            prose-img:rounded-sm prose-img:shadow-xl prose-img:mx-auto prose-img:border prose-img:border-navy-100
            prose-hr:border-navy-100
          "
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* RODAPÉ DO ARTIGO */}
        <footer className="mt-20 pt-12 border-t border-navy-100">
          <div className="flex justify-between items-center">
            <Link
              to="/blog"
              className="group flex items-center gap-3 text-navy-400 hover:text-gold-500 transition-colors"
            >
              <span className="p-3 bg-navy-50 rounded-sm group-hover:bg-gold-500/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </span>
              <span className="text-sm tracking-wider">TODOS OS ARTIGOS</span>
            </Link>
            
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-3 text-navy-300 hover:text-gold-500 transition-colors"
            >
              <span className="text-sm tracking-wider">VOLTAR AO TOPO</span>
              <span className="p-3 bg-navy-50 rounded-sm group-hover:bg-gold-500/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </span>
            </button>
          </div>
        </footer>
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