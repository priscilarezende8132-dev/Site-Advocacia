import { useState, useEffect } from 'react';
import { useParams, Link } from '-react-router-dom';
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
          <p className="text-gold-500/80 font-light tracking-wider">CARREGANDO</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <span className="text-7xl block mb-6 opacity-20 text-gold-500">⚖️</span>
          <h1 className="text-3xl text-white font-light mb-3 tracking-wide">ARTIGO NÃO ENCONTRADO</h1>
          <p className="text-white/30 text-sm mb-10 tracking-wider">O conteúdo pode ter sido movido ou removido.</p>
          <Link to="/blog" className="inline-block px-8 py-3 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-900 transition duration-300 text-sm tracking-[0.2em]">
            ← VOLTAR
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />

      {/* HERO SECTION */}
      <div className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent z-10"></div>
        
        {post.data.image ? (
          <img
            src={post.data.image}
            alt={post.data.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-navy-900">
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-20 container-custom pb-20 text-white">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/40 hover:text-gold-500 transition-colors mb-8 text-xs tracking-[0.2em] group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>TODOS OS ARTIGOS</span>
          </Link>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight max-w-5xl mb-8 text-white">
            {post.data.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-8 text-white/60">
            <div className="flex items-center gap-3">
              <span className="text-gold-500 text-sm">—</span>
              <span className="text-xs tracking-[0.2em]">
                {new Date(post.data.date).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }).toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-gold-500 text-sm">—</span>
              <span className="text-xs tracking-[0.2em]">
                {Math.ceil(post.content.split(' ').length / 200)} MIN DE LEITURA
              </span>
            </div>
            
            {post.data.category && (
              <div className="flex items-center gap-3">
                <span className="text-gold-500 text-sm">—</span>
                <span className="text-xs tracking-[0.2em]">{post.data.category.toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTEÚDO */}
      <main className="max-w-4xl mx-auto px-6 py-24">
        {/* BARRA DE AUTOR */}
        <div className="relative mb-20 p-10 bg-navy-50 border-l-4 border-gold-500">
          <div className="absolute -top-3 left-10 bg-gold-500 px-6 py-1">
            <span className="text-navy-900 text-xs tracking-[0.2em] font-medium">SOBRE O AUTOR</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-navy-900 rounded-full flex items-center justify-center text-gold-500 text-3xl">
              ⚖️
            </div>
            <div>
              <p className="text-2xl text-navy-900 font-light mb-1">{post.data.author || content.siteName}</p>
              <p className="text-sm text-gold-500 tracking-wider mb-2">{content.oab}</p>
              <p className="text-sm text-gray-500 max-w-md">
                Especialista em Direito Civil e Empresarial com mais de 15 anos de atuação.
              </p>
            </div>
          </div>
        </div>

        {/* DESCRIÇÃO */}
        {post.data.description && (
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <p className="text-xl text-navy-700/70 italic font-light leading-relaxed">
              "{post.data.description}"
            </p>
            <div className="w-16 h-px bg-gold-500/30 mx-auto mt-6"></div>
          </div>
        )}

        {/* ARTIGO */}
        <article
          className="
            prose prose-lg max-w-none
            prose-headings:text-navy-900 prose-headings:font-light prose-headings:tracking-tight
            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
            prose-p:text-navy-600 prose-p:leading-relaxed prose-p:mb-8 prose-p:text-lg
            prose-a:text-gold-500 prose-a:no-underline hover:prose-a:border-b hover:prose-a:border-gold-500
            prose-strong:text-navy-900 prose-strong:font-medium
            prose-ul:list-disc prose-ol:list-decimal prose-li:text-navy-600
            prose-blockquote:border-l-4 prose-blockquote:border-gold-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-navy-600 prose-blockquote:bg-navy-50 prose-blockquote:py-4 prose-blockquote:px-6
            prose-img:rounded-sm prose-img:shadow-xl prose-img:mx-auto prose-img:border prose-img:border-navy-100
            prose-hr:border-navy-100
          "
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* RODAPÉ */}
        <footer className="mt-24 pt-12 border-t border-navy-100">
          <div className="flex justify-between items-center">
            <Link
              to="/blog"
              className="group flex items-center gap-3 text-navy-400 hover:text-gold-500 transition-colors"
            >
              <span className="p-3 bg-navy-50 rounded-sm group-hover:bg-gold-500/10 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </span>
              <span className="text-sm tracking-[0.2em]">TODOS OS ARTIGOS</span>
            </Link>
            
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-3 text-navy-400 hover:text-gold-500 transition-colors"
            >
              <span className="text-sm tracking-[0.2em]">TOPO</span>
              <span className="p-3 bg-navy-50 rounded-sm group-hover:bg-gold-500/10 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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