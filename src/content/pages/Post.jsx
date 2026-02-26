import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { loadContent } from '/src/utils/contentLoader';
import '../styles/animations.css';

// ----------------------------------------------------------------------
// Helper: parseFrontmatter (mantido igual)
// ----------------------------------------------------------------------
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

// ----------------------------------------------------------------------
// Componente principal
// ----------------------------------------------------------------------
export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({
    siteName: 'Dr. Carlos Silva',
    oab: 'OAB/SP 123.456',
    whatsapp: '5511999999999',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const settingsData = await loadContent('/src/content/settings/general.md');
        setContent((prev) => ({ ...prev, ...settingsData?.data }));

        const response = await fetch(`/content/posts/${slug}.md`);

        if (response.ok) {
          const text = await response.text();
          const { data, content: markdownContent } = parseFrontmatter(text);
          setPost({ slug, data, content: markdownContent });
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

  // --------------------------------------------------------------------
  // Renderização condicional
  // --------------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-navy-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-navy-800 font-medium">Carregando artigo...</p>
          <p className="text-navy-500 text-sm mt-2">{content.siteName}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header fixo */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-navy-100">
          <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />
        </div>

        <main className="container mx-auto px-4 py-20 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-navy-50 rounded-full flex items-center justify-center">
              <span className="text-4xl text-navy-400">📄</span>
            </div>
            <h1 className="text-4xl font-bold text-navy-900 mb-4">Artigo não encontrado</h1>
            <p className="text-navy-600 mb-8">
              O artigo que você procura pode ter sido removido ou ainda não foi publicado.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white rounded-lg hover:bg-navy-800 transition-colors"
            >
              <span>←</span> Voltar para o blog
            </Link>
          </motion.div>
        </main>

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

  // --------------------------------------------------------------------
  // Post encontrado
  // --------------------------------------------------------------------
  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      {/* HEADER FIXO COM EFEITO DE VIDRO */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-navy-100">
        <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 text-sm"
        >
          <Link to="/blog" className="text-navy-500 hover:text-gold-600 transition-colors">
            Blog
          </Link>
          <span className="mx-2 text-navy-300">/</span>
          <span className="text-navy-900 font-medium">{post.data.title}</span>
        </motion.nav>

        {/* Card do artigo */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-navy-100 overflow-hidden"
        >
          {/* Cabeçalho */}
          <header className="p-8 md:p-12 border-b border-navy-100">
            {post.data.category && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-navy-50 text-navy-700 text-xs font-semibold uppercase tracking-wider rounded-full">
                  {post.data.category}
                </span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6 leading-tight">
              {post.data.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-navy-600">
              {post.data.date && (
                <time className="flex items-center gap-1">
                  <span className="text-gold-500">📅</span>
                  {new Date(post.data.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              )}
              <span className="w-1 h-1 bg-navy-300 rounded-full" />
              <span className="flex items-center gap-1">
                <span className="text-gold-500">⚖️</span>
                {post.data.author || `Dr. ${content.siteName}`}
              </span>
              <span className="w-1 h-1 bg-navy-300 rounded-full" />
              <span className="flex items-center gap-1">
                <span className="text-gold-500">📋</span>
                {content.oab}
              </span>
            </div>
          </header>

          {/* Imagem de destaque */}
          {post.data.image && (
            <figure className="relative h-[400px] md:h-[500px] overflow-hidden">
              <img
                src={post.data.image}
                alt={post.data.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </figure>
          )}

          {/* Descrição */}
          {post.data.description && (
            <div className="px-8 md:px-12 pt-8 md:pt-12">
              <blockquote className="text-xl text-navy-700 italic border-l-4 border-gold-500 pl-6 py-2 bg-navy-50/50 rounded-r-lg">
                "{post.data.description}"
              </blockquote>
            </div>
          )}

          {/* Conteúdo do artigo */}
          <div className="p-8 md:p-12 prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-navy-900
            prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-navy-200
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-navy-700 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-gold-600 hover:prose-a:text-gold-500 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-navy-900
            prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6
            prose-li:text-navy-700 prose-li:marker:text-gold-500
            prose-blockquote:border-l-4 prose-blockquote:border-gold-500 prose-blockquote:bg-navy-50/50
            prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
            prose-blockquote:not-italic prose-blockquote:text-navy-700
            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
            prose-hr:border-navy-200 prose-hr:my-12"
            dangerouslySetInnerHTML={{
              __html: marked.parse(post.content, { breaks: true, gfm: true }),
            }}
          />

          {/* Rodapé do artigo */}
          <footer className="px-8 md:px-12 pb-8 md:pb-12 border-t border-navy-100 pt-8 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-navy-50 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-navy-600">⚖️</span>
                </div>
                <div>
                  <p className="font-bold text-navy-900">{content.siteName}</p>
                  <p className="text-sm text-navy-500">{content.oab}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="text-sm text-navy-500 bg-navy-50 px-4 py-2 rounded-full">
                  ⏱️ {readingTime} min de leitura
                </span>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.data.title,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copiado!');
                    }
                  }}
                  className="px-4 py-2 bg-navy-50 text-navy-700 rounded-full hover:bg-navy-100 transition-colors"
                >
                  Compartilhar
                </button>
              </div>
            </div>

            {/* Link de volta */}
            <div className="mt-8 text-center">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-navy-600 hover:text-gold-600 transition-colors"
              >
                <span>←</span> Ver todos os artigos
              </Link>
            </div>
          </footer>
        </motion.article>
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
    </motion.div>
  );
}