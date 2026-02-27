import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { loadContent } from '/src/utils/contentLoader';
import '../styles/animations.css';

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

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const articleRef = useRef(null);
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
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    }

    loadData();
  }, [slug]);

  function renderMarkdown(content) {
    if (!content) return '';
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: true,
      mangle: false
    });
    return marked.parse(content);
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const articleContent = articleRef.current?.innerHTML || '';
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${post?.data?.title || 'Artigo'} - ${content.siteName}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Merriweather', Georgia, serif;
              background-color: #F9F7F4;
              color: #2C3E50;
              line-height: 1.8;
              padding: 40px 20px;
            }
            
            .print-container {
              max-width: 800px;
              margin: 0 auto;
              background-color: white;
              padding: 60px;
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            }
            
            h1 {
              font-size: 2.5rem;
              font-weight: 700;
              color: #1A2C3E;
              margin-bottom: 1rem;
              font-family: 'Merriweather', serif;
              line-height: 1.3;
            }
            
            .metadata {
              color: #666;
              font-size: 0.9rem;
              margin-bottom: 2rem;
              padding-bottom: 1rem;
              border-bottom: 2px solid #D4AF37;
              font-family: 'Inter', sans-serif;
            }
            
            h2 {
              font-size: 1.8rem;
              font-weight: 600;
              color: #1A2C3E;
              margin-top: 2rem;
              margin-bottom: 1rem;
              font-family: 'Merriweather', serif;
            }
            
            h2:before {
              content: '';
              display: inline-block;
              width: 30px;
              height: 2px;
              background: #D4AF37;
              margin-right: 15px;
              vertical-align: middle;
            }
            
            h3 {
              font-size: 1.4rem;
              font-weight: 600;
              color: #2C3E50;
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
            }
            
            p {
              margin-bottom: 1.5rem;
              font-size: 1.1rem;
              line-height: 1.9;
              color: #2C3E50;
              word-wrap: break-word;
              overflow-wrap: break-word;
              white-space: normal;
            }
            
            blockquote {
              border-left: 4px solid #D4AF37;
              background-color: #F8F4F0;
              padding: 1.5rem 2rem;
              margin: 2rem 0;
              font-style: italic;
              border-radius: 0 8px 8px 0;
            }
            
            ul, ol {
              margin: 1.5rem 0 1.5rem 2rem;
            }
            
            li {
              margin-bottom: 0.5rem;
            }
            
            .footer-note {
              margin-top: 3rem;
              padding-top: 1.5rem;
              border-top: 1px solid #ddd;
              font-size: 0.9rem;
              color: #666;
              text-align: center;
              font-family: 'Inter', sans-serif;
            }
            
            @media print {
              body {
                background-color: white;
                padding: 0;
              }
              .print-container {
                box-shadow: none;
                padding: 40px;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <h1>${post?.data?.title || ''}</h1>
            <div class="metadata">
              ${post?.data?.date ? new Date(post.data.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''} | 
              ${post?.data?.author || `Dr. ${content.siteName}`} | 
              ${content.oab}
            </div>
            ${articleContent}
            <div class="footer-note">
              Publicado por ${content.siteName} • ${content.oab}<br>
              Fonte: ${window.location.href}
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: post?.data?.title || 'Artigo Jurídico',
      text: post?.data?.description || 'Confira este artigo jurídico',
      url: window.location.href
    };

    try {
      if (navigator.share && window.innerWidth <= 768) {
        await navigator.share(shareData);
      } else {
        setShowShareMenu(!showShareMenu);
      }
    } catch (error) {
      console.log('Erro ao compartilhar:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiado para a área de transferência!');
    setShowShareMenu(false);
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Confira este artigo: ${post?.data?.title} - ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShareMenu(false);
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.data?.title || '');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    setShowShareMenu(false);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(post?.data?.title || '');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-2 border-gold-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl text-gold-500">⚖️</span>
            </div>
          </div>
          <p className="text-gold-500/80 font-serif italic text-lg tracking-wide">
            Carregando documento jurídico...
          </p>
          <p className="text-navy-300 text-sm mt-4 font-light">
            {content.siteName} • {content.oab}
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-navy-900">
        <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />
        
        <div className="h-20"></div>
        
        <div className="flex items-center justify-center px-4 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-center text-white"
          >
            <div className="w-40 h-40 mx-auto mb-8 bg-navy-800 rounded-full flex items-center justify-center border-2 border-gold-500/30">
              <span className="text-6xl text-gold-500">📜</span>
            </div>
            
            <h1 className="text-5xl font-serif font-bold text-gold-500 mb-4">
              Artigo não encontrado
            </h1>
            
            <p className="text-xl text-navy-300 mb-12 font-light">
              O artigo que você procura pode ter sido removido ou ainda não foi publicado.
            </p>

            <Link
              to="/blog"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gold-500 text-navy-900 font-serif text-lg hover:bg-gold-600 transition-all shadow-2xl hover:shadow-gold-500/20 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Voltar para o blog
            </Link>
          </motion.div>
        </div>
        
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

  return (
    <div className="min-h-screen bg-[#F9F7F4]">
      {/* Header transparente original */}
      <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />
      
      {/* Espaçamento para compensar o header fixo */}
      <div className="h-20"></div>

      {/* HERO AZUL - DESTAQUE PARA O ARTIGO */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 text-white py-20 px-4">
        <div className="container-custom max-w-4xl mx-auto text-center">
          {/* Link de voltar (sutil) */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-gold-500 mb-8 transition-colors group text-sm uppercase tracking-wider"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            TODOS OS ARTIGOS
          </Link>

          {/* Categoria (se houver) */}
          {post.data.category && (
            <div className="mb-4">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-gold-500">
                {post.data.category}
              </span>
            </div>
          )}

          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
            {post.data.title}
          </h1>

          {/* Descrição (se houver) */}
          {post.data.description && (
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto font-light italic">
              "{post.data.description}"
            </p>
          )}

          {/* Metadados do artigo */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70 pt-4 border-t border-white/10 max-w-2xl mx-auto">
            {post.data.date && (
              <time className="flex items-center gap-2">
                <span className="text-gold-500">📅</span>
                {new Date(post.data.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
            )}
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span className="flex items-center gap-2">
              <span className="text-gold-500">⚖️</span>
              {post.data.author || `Dr. ${content.siteName}`}
            </span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span className="flex items-center gap-2">
              <span className="text-gold-500">📋</span>
              {content.oab}
            </span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span className="flex items-center gap-2">
              <span className="text-gold-500">⏱️</span>
              {Math.ceil(post.content.split(' ').length / 200)} min
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="container-custom max-w-3xl py-16">
        {/* Imagem de destaque (se houver) */}
        {post.data.image && (
          <div className="mb-16">
            <img
              src={post.data.image}
              alt={post.data.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* ARTIGO */}
        <article 
          ref={articleRef}
          className="
          prose prose-lg max-w-none
          break-words
          whitespace-pre-wrap
          prose-headings:font-serif prose-headings:text-navy-900 prose-headings:font-bold
          prose-h1:text-3xl prose-h1:mt-16 prose-h1:mb-8 prose-h1:pb-4 prose-h1:border-b-2 prose-h1:border-gold-500/20
          prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-6 prose-h2:font-serif prose-h2:text-navy-900/90
          prose-h2:before:content-[''] prose-h2:before:inline-block prose-h2:before:w-8 prose-h2:before:h-[2px] prose-h2:before:bg-gold-500/50 prose-h2:before:mr-4 prose-h2:before:align-middle
          prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-navy-900/80
          prose-p:text-gray-700 prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-lg prose-p:font-light
          prose-h2 + p prose-p:first-line:font-semibold prose-p:first-line:text-navy-900
          prose-a:text-gold-600 hover:prose-a:text-gold-500 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-navy-900 prose-strong:font-semibold
          prose-ul:list-disc prose-ul:pl-8 prose-ul:my-8 prose-ul:space-y-2
          prose-ol:list-decimal prose-ol:pl-8 prose-ol:my-8 prose-ol:space-y-2
          prose-li:text-gray-700 prose-li:marker:text-gold-500
          prose-blockquote:border-l-4 prose-blockquote:border-gold-500 prose-blockquote:bg-gray-50
          prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:my-10
          prose-code:text-gold-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-img:rounded-lg prose-img:shadow-md prose-img:my-12 prose-img:mx-auto
          prose-hr:border-t-2 prose-hr:border-gray-200 prose-hr:my-16 prose-hr:w-24 prose-hr:mx-auto
          "
        >
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
        </article>

        {/* Notas e referências */}
        <div className="mt-20 pt-8 border-t border-gray-200">
          <div className="text-sm text-gray-500 space-y-4">
            <p className="flex items-start gap-2">
              <span className="text-gold-600 font-bold">[1]</span>
              <span>Tribunal de Justiça do Estado do Piauí. IRDR n. 0759842-91.2020.8.18.0000, Rel. Des. Haroldo Oliveira Rehem, j. 19.06.2024.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-gold-600 font-bold">[2]</span>
              <span>TJPI. Súmulas 33 e 34, aprovadas na 141ª Sessão Ordinária Administrativa de 15.07.2024.</span>
            </p>
          </div>
        </div>

        {/* Bio do autor */}
        <div className="mt-16 p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-navy-900 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-3xl text-gold-500">⚖️</span>
            </div>
            <div>
              <h4 className="font-serif font-bold text-navy-900 mb-1">{content.siteName}</h4>
              <p className="text-sm text-gray-500 mb-2">{content.oab}</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Advogado especialista em Direito do Consumidor e Direito Bancário. 
                Membro da Comissão de Direito Bancário da OAB/SP. Autor de artigos 
                jurídicos publicados em revistas especializadas.
              </p>
            </div>
          </div>
        </div>

        {/* Navegação entre artigos */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gold-600 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Todos os artigos
          </Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gold-600 transition-colors"
          >
            <span>Voltar ao topo</span>
            <span>↑</span>
          </button>
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