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
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Função para processar o campo de vídeo de destaque
function processFeaturedVideo(videoData) {
  if (!videoData) return null;
  
  try {
    // Se for string, tenta parsear JSON
    let data = videoData;
    if (typeof videoData === 'string') {
      // Remove aspas extras se houver
      const cleanStr = videoData.replace(/^"|"$/g, '');
      data = JSON.parse(cleanStr);
    }
    
    if (data.type === 'youtube' && data.url) {
      const videoId = extractYouTubeId(data.url);
      if (videoId) {
        return (
          <div className="mb-8">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                style={{ border: 0 }}
                allowFullScreen
                title="Vídeo do artigo"
              />
            </div>
            {data.caption && (
              <p className="text-center text-sm text-gray-500 mt-2">{data.caption}</p>
            )}
          </div>
        );
      }
    } else if (data.type === 'upload' && data.file) {
      return (
        <div className="mb-8">
          <video
            controls
            className="w-full rounded-lg shadow-lg"
            style={{ maxHeight: '500px' }}
          >
            <source src={data.file} type="video/mp4" />
            Seu navegador não suporta vídeos.
          </video>
          {data.caption && (
            <p className="text-center text-sm text-gray-500 mt-2">{data.caption}</p>
          )}
        </div>
      );
    }
  } catch (e) {
    console.error('Erro ao processar vídeo:', e);
    // Se não conseguir parsear, tenta como string direta (caso seja URL)
    if (typeof videoData === 'string' && videoData.match(/^https?:\/\//)) {
      const videoId = extractYouTubeId(videoData);
      if (videoId) {
        return (
          <div className="mb-8">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                style={{ border: 0 }}
                allowFullScreen
                title="Vídeo do artigo"
              />
            </div>
          </div>
        );
      }
    }
  }
  
  return null;
}

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: text };

  const data = {};
  const lines = match[1].split('\n');
  
  lines.forEach((line) => {
    if (line.trim() === '') return;
    
    const colonIndex = line.indexOf(': ');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 2).trim();
      
      // Tenta parsear JSON se o valor começar com { ou [
      if (value.startsWith('{') && value.endsWith('}')) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      } else {
        data[key] = value;
      }
    }
  });

  return { data, content: match[2] };
}

const renderer = new marked.Renderer();

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
  if (href.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
    return `
      <video controls style="width: 100%; max-height: 500px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <source src="${href}" type="video/mp4">
        Seu navegador não suporta vídeos.
      </video>
    `;
  }
  return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text}</a>`;
};

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
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Merriweather', Georgia, serif; background-color: #F9F7F4; color: #2C3E50; line-height: 1.8; padding: 40px 20px; }
            .print-container { max-width: 800px; margin: 0 auto; background-color: white; padding: 60px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
            h1 { font-size: 2.5rem; font-weight: 700; color: #1A2C3E; margin-bottom: 1rem; font-family: 'Merriweather', serif; }
            .metadata { color: #666; font-size: 0.9rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #D4AF37; font-family: 'Inter', sans-serif; }
            img { max-width: 100%; height: auto; display: block; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            video { width: 100%; max-height: 500px; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            iframe { border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            @media print { body { background-color: white; padding: 0; } .print-container { box-shadow: none; padding: 40px; } }
          </style>
        </head>
        <body>
          <div class="print-container">
            <h1>${post?.data?.title || ''}</h1>
            <div class="metadata">
              ${post?.data?.date ? new Date(post.data.date).toLocaleDateString('pt-BR') : ''} | 
              ${post?.data?.author || `Dr. ${content.siteName}`} | 
              ${content.oab}
            </div>
            ${articleHTML}
            <div class="footer-note" style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #ddd; font-size: 0.9rem; color: #666; text-align: center;">
              Publicado por ${content.siteName} • ${content.oab}
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Aguarda carregamento antes de imprimir
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
    alert('Link copiado!');
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
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-4">
            <div className="absolute inset-0 border-2 border-accent/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl sm:text-4xl text-accent">⚖️</span>
            </div>
          </div>
          <p className="text-white/80 text-sm sm:text-base">Carregando artigo...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-primary">
        <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />
        <div className="h-24 sm:h-28 md:h-32"></div>
        <div className="flex items-center justify-center px-4 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-center text-white px-4"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-6 bg-primary/80 rounded-full flex items-center justify-center border-2 border-accent/30">
              <span className="text-4xl sm:text-5xl md:text-6xl text-accent">📜</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent mb-4">Artigo não encontrado</h1>
            <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 font-light">
              O artigo que você procura pode ter sido removido ou ainda não foi publicado.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary font-bold rounded-full hover:scale-105 transition-all"
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
      <section className="bg-gradient-to-r from-primary to-secondary text-white pt-32 pb-16">
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

      <main className="container-custom max-w-4xl px-4 py-8">
        
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-accent mb-6">
          <i className="fas fa-arrow-left"></i> Todos os artigos
        </Link>

        {/* VÍDEO DE DESTAQUE */}
        {post.data.featured_video && processFeaturedVideo(post.data.featured_video)}

        {/* Imagem de destaque (se não tiver vídeo) */}
        {!post.data.featured_video && post.data.image && (
          <div className="mb-8">
            <img
              src={post.data.image}
              alt={post.data.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Artigo */}
        <article 
          ref={articleRef}
          className="prose prose-sm sm:prose-base lg:prose-lg max-w-none"
        >
          <div dangerouslySetInnerHTML={{ __html: marked.parse(post.content) }} />
        </article>

        {/* Ações - COM BOTÃO IMPRIMIR */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
          <Link to="/blog" className="text-gray-500 hover:text-accent">
            <i className="fas fa-arrow-left"></i> Todos os artigos
          </Link>
          
          <div className="flex items-center gap-2">
            {/* Botão Compartilhar */}
            <div className="relative">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:border-accent hover:text-accent transition-all text-sm"
              >
                <i className="fas fa-share-alt"></i>
                <span className="hidden sm:inline">Compartilhar</span>
              </button>
              
              {/* Menu de compartilhamento */}
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                  <button
                    onClick={copyToClipboard}
                    className="w-full px-3 py-1.5 text-left text-gray-700 hover:bg-gray-50 hover:text-accent flex items-center gap-2 text-xs"
                  >
                    <i className="fas fa-link text-accent w-4"></i>
                    <span>Copiar link</span>
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="w-full px-3 py-1.5 text-left text-gray-700 hover:bg-gray-50 hover:text-accent flex items-center gap-2 text-xs"
                  >
                    <i className="fab fa-whatsapp text-accent w-4"></i>
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={shareOnLinkedIn}
                    className="w-full px-3 py-1.5 text-left text-gray-700 hover:bg-gray-50 hover:text-accent flex items-center gap-2 text-xs"
                  >
                    <i className="fab fa-linkedin-in text-accent w-4"></i>
                    <span>LinkedIn</span>
                  </button>
                  <button
                    onClick={shareOnTwitter}
                    className="w-full px-3 py-1.5 text-left text-gray-700 hover:bg-gray-50 hover:text-accent flex items-center gap-2 text-xs"
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
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:border-accent hover:text-accent transition-all text-sm"
            >
              <i className="fas fa-print"></i>
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>
        </div>

        {/* Bio do autor */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-user-tie text-xl text-accent"></i>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-1 text-sm">{content.siteName}</h4>
              <p className="text-xs text-gray-500 mb-1">{content.oab}</p>
              <p className="text-gray-600 text-xs">
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