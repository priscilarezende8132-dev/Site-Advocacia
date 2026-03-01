import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { loadContent } from '/src/utils/contentLoader';
import '../styles/animations.css';

// Função para extrair ID do YouTube
function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Processar conteúdo para substituir os placeholders dos widgets
function processCustomWidgets(content) {
  if (!content) return content;
  
  // Substituir {{youtube URL}}
  let processed = content.replace(/\{\{youtube (.*?)\}\}/g, (match, url) => {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      return `
<div style="position: relative; padding-bottom: 56.25%; height: 0; margin: 30px 0; overflow: hidden; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  <iframe src="https://www.youtube.com/embed/${videoId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe>
</div>
      `;
    }
    return `<p style="color: red;">Vídeo inválido: ${url}</p>`;
  });

  // Substituir {{video URL}}
  processed = processed.replace(/\{\{video (.*?)\}\}/g, (match, url) => {
    return `
<video controls style="width: 100%; max-height: 500px; border-radius: 12px; margin: 30px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  <source src="${url}" type="video/mp4">
  Seu navegador não suporta vídeos.
</video>
    `;
  });

  // Substituir {{upload-video URL}}
  processed = processed.replace(/\{\{upload-video (.*?)\}\}/g, (match, url) => {
    return `
<video controls style="width: 100%; max-height: 500px; border-radius: 12px; margin: 30px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  <source src="${url}" type="video/mp4">
  Seu navegador não suporta vídeos.
</video>
    `;
  });

  return processed;
}

// Renderizador personalizado para o marked
const renderer = new marked.Renderer();

// Links do YouTube
renderer.link = (href, title, text) => {
  const youtubeId = extractYouTubeId(href);
  if (youtubeId) {
    return `
      <div style="position: relative; padding-bottom: 56.25%; height: 0; margin: 20px 0; overflow: hidden; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <iframe 
          src="https://www.youtube.com/embed/${youtubeId}" 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
          allowfullscreen
          title="YouTube video"
        ></iframe>
      </div>
    `;
  }
  // Verificar se é um link de vídeo MP4
  if (href.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
    return `
      <video controls style="width: 100%; max-height: 500px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <source src="${href}" type="video/mp4">
        Seu navegador não suporta vídeos.
      </video>
    `;
  }
  // Link normal
  return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text}</a>`;
};

// Renderizar imagens com lazy loading e classes
renderer.image = (href, title, text) => {
  return `
    <img 
      src="${href}" 
      alt="${text || ''}" 
      title="${title || ''}" 
      loading="lazy"
      style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px auto; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
    />
  `;
};

marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false,
  renderer: renderer
});

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
    siteName: 'Edson Silva Maltez',
    oab: 'OAB/SP 344.956',
    whatsapp: '5519996319810',
    phone: '(19) 99631-9810',
    email: 'dredsonmaltez@gmail.com',
    address: 'Rua Francisco Biancalana, 31 - sala 02 - Vila Santana, Sumaré - SP'
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
          
          // Processar os widgets personalizados
          const processedContent = processCustomWidgets(content);
          
          setPost({ slug, data, content: processedContent });
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
    return marked.parse(content);
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    // Clona o artigo para não modificar o original
    const articleClone = articleRef.current.cloneNode(true);
    
    // Converte caminhos relativos de imagens para absolutos
    const images = articleClone.querySelectorAll('img');
    images.forEach(img => {
      if (img.src && !img.src.startsWith('http')) {
        img.src = window.location.origin + (img.src.startsWith('/') ? img.src : '/' + img.src);
      }
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.margin = '20px auto';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    });

    // Converte vídeos para funcionarem na impressão
    const videos = articleClone.querySelectorAll('video');
    videos.forEach(video => {
      video.setAttribute('controls', 'true');
      video.setAttribute('preload', 'auto');
      video.style.width = '100%';
      video.style.maxHeight = '500px';
      video.style.borderRadius = '12px';
      video.style.margin = '20px 0';
      video.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    });

    // Converte links do YouTube para embeds funcionais
    const links = articleClone.querySelectorAll('a');
    links.forEach(link => {
      const youtubeId = extractYouTubeId(link.href);
      if (youtubeId) {
        const embed = document.createElement('div');
        embed.innerHTML = `
          <div style="position: relative; padding-bottom: 56.25%; height: 0; margin: 20px 0; overflow: hidden; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <iframe 
              src="https://www.youtube.com/embed/${youtubeId}" 
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
              allowfullscreen
            ></iframe>
          </div>
        `;
        link.parentNode.replaceChild(embed.firstChild, link);
      } else if (link.href.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
        const video = document.createElement('video');
        video.setAttribute('controls', 'true');
        video.style.width = '100%';
        video.style.maxHeight = '500px';
        video.style.borderRadius = '12px';
        video.style.margin = '20px 0';
        video.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        const source = document.createElement('source');
        source.src = link.href;
        source.type = 'video/mp4';
        video.appendChild(source);
        link.parentNode.replaceChild(video, link);
      }
    });

    const articleHTML = articleClone.outerHTML;

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
            
            img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 20px auto;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            video {
              width: 100%;
              max-height: 500px;
              border-radius: 12px;
              margin: 20px 0;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            iframe {
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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
              img, video, iframe {
                box-shadow: none;
                border: 1px solid #eee;
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
            ${articleHTML}
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
    
    // Aguarda imagens e vídeos carregarem antes de imprimir
    setTimeout(() => {
      printWindow.print();
    }, 500);
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
      <div className="min-h-screen bg-primary flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-4 sm:mb-6">
            <div className="absolute inset-0 border-2 border-accent/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl sm:text-4xl text-accent">⚖️</span>
            </div>
          </div>
          <p className="text-white/80 text-sm sm:text-base font-light tracking-wide">
            Carregando artigo...
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-primary">
        <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />
        
        <div className="h-24 sm:h-28 md:h-32"></div>
        
        <div className="flex items-center justify-center px-4 py-16 sm:py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-center text-white px-4"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-6 sm:mb-8 bg-primary/80 rounded-full flex items-center justify-center border-2 border-accent/30">
              <span className="text-4xl sm:text-5xl md:text-6xl text-accent">📜</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent mb-3 sm:mb-4">
              Artigo não encontrado
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 sm:mb-10 md:mb-12 font-light">
              O artigo que você procura pode ter sido removido ou ainda não foi publicado.
            </p>

            <Link
              to="/blog"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-accent text-primary font-bold text-sm sm:text-base md:text-lg rounded-full hover:bg-accent/90 transition-all shadow-2xl hover:shadow-accent/20 group"
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
    <div className="min-h-screen bg-gray-50">
      <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />

      {/* Faixa Azul */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white pt-32 pb-16 md:pb-20 lg:pb-24">
        <div className="container-custom text-center">
          <span className="text-accent font-semibold tracking-wider uppercase text-sm mb-3 inline-block">
            DOUTRINA & JURISPRUDÊNCIA
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {post.data.title}
          </h1>
          {post.data.description && (
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              {post.data.description}
            </p>
          )}
          <div className="w-20 h-1 bg-accent mx-auto mt-6"></div>
        </div>
      </section>

      {/* Conteúdo principal */}
      <main className="container-custom max-w-4xl px-4 py-8 sm:py-10 md:py-12 lg:py-16">
        
        {/* Navegação */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-accent mb-4 sm:mb-5 md:mb-6 transition-colors group text-sm sm:text-base"
        >
          <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          <span>Todos os artigos</span>
        </Link>

        {/* Metadados */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 pb-4 border-b border-gray-200">
          {post.data.date && (
            <time className="flex items-center gap-1">
              <i className="far fa-calendar-alt text-accent"></i>
              <span>{new Date(post.data.date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}</span>
            </time>
          )}
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <i className="fas fa-gavel text-accent"></i>
            <span>{post.data.author || `Dr. ${content.siteName}`}</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <i className="fas fa-scroll text-accent"></i>
            <span>{content.oab}</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <i className="far fa-clock text-accent"></i>
            <span>{Math.ceil(post.content.split(' ').length / 200)} min</span>
          </span>
        </div>

        {/* Imagem de destaque */}
        {post.data.image && (
          <div className="mb-6 sm:mb-8">
            <img
              src={post.data.image}
              alt={post.data.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Artigo com suporte a vídeos */}
        <article 
          ref={articleRef}
          className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
            prose-headings:text-primary prose-headings:font-bold
            prose-h1:text-xl sm:prose-h1:text-2xl md:prose-h1:text-3xl prose-h1:mt-6 sm:prose-h1:mt-8 md:prose-h1:mt-10 lg:prose-h1:mt-12 prose-h1:mb-3 sm:prose-h1:mb-4 md:prose-h1:mb-5 lg:prose-h1:mb-6
            prose-h2:text-lg sm:prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-5 sm:prose-h2:mt-6 md:prose-h2:mt-8 lg:prose-h2:mt-10 prose-h2:mb-2 sm:prose-h2:mb-3 md:prose-h2:mb-4
            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-3 sm:prose-p:mb-4 md:prose-p:mb-5 lg:prose-p:mb-6 prose-p:text-sm sm:prose-p:text-base
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-strong:text-primary
            prose-ul:list-disc prose-ol:list-decimal prose-li:text-sm sm:prose-li:text-base
            prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-3 sm:prose-blockquote:px-4 md:prose-blockquote:px-5 lg:prose-blockquote:px-6 prose-blockquote:rounded-r-lg
            prose-img:rounded-lg prose-img:shadow-md prose-img:my-4 sm:prose-img:my-5 md:prose-img:my-6
            break-words whitespace-pre-wrap"
        >
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
        </article>

        {/* Ações */}
        <div className="mt-8 sm:mt-10 md:mt-12 pt-4 sm:pt-5 md:pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-accent transition-colors group text-sm sm:text-base"
          >
            <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            <span>Todos os artigos</span>
          </Link>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            
            {/* Botão Compartilhar */}
            <div className="relative">
              <button
                onClick={handleShare}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg hover:border-accent hover:text-accent transition-all shadow-sm text-xs sm:text-sm"
              >
                <i className="fas fa-share-alt"></i>
                <span className="hidden xs:inline">Compartilhar</span>
              </button>
              
              {/* Menu de compartilhamento */}
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-36 sm:w-40 md:w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 sm:py-2 z-50">
                  <button
                    onClick={copyToClipboard}
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-accent flex items-center gap-2 sm:gap-3 transition-colors text-xs sm:text-sm"
                  >
                    <i className="fas fa-link text-accent w-4"></i>
                    <span>Copiar link</span>
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-accent flex items-center gap-2 sm:gap-3 transition-colors text-xs sm:text-sm"
                  >
                    <i className="fab fa-whatsapp text-accent w-4"></i>
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={shareOnLinkedIn}
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-accent flex items-center gap-2 sm:gap-3 transition-colors text-xs sm:text-sm"
                  >
                    <i className="fab fa-linkedin-in text-accent w-4"></i>
                    <span>LinkedIn</span>
                  </button>
                  <button
                    onClick={shareOnTwitter}
                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-accent flex items-center gap-2 sm:gap-3 transition-colors text-xs sm:text-sm"
                  >
                    <i className="fab fa-twitter text-accent w-4"></i>
                    <span>Twitter</span>
                  </button>
                </div>
              )}
            </div>

            {/* Botão Imprimir */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg hover:border-accent hover:text-accent transition-all shadow-sm text-xs sm:text-sm"
            >
              <i className="fas fa-print"></i>
              <span className="hidden xs:inline">Imprimir</span>
            </button>
          </div>
        </div>

        {/* Bio do autor */}
        <div className="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-5 md:p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-user-tie text-xl sm:text-2xl text-accent"></i>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-1 text-sm sm:text-base">{content.siteName}</h4>
              <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">{content.oab}</p>
              <p className="text-gray-600 text-xs sm:text-sm">
                Advogado especialista em Direito Civil, Trabalhista e Criminal. 
                Membro da OAB/SP desde 2012, com atuação dedicada e atenção personalizada a cada cliente.
              </p>
            </div>
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