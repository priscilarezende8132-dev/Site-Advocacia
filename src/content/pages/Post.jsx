import { useState, useEffect } from 'react';
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

  function renderMarkdown(content) {
    if (!content) return '';
    marked.setOptions({
      breaks: true,
      gfm: true
    });
    return marked.parse(content);
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
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
        
        <div className="h-1 bg-gradient-to-r from-gold-500/0 via-gold-500 to-gold-500/0"></div>
        
        <div className="flex items-center justify-center px-4 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-center"
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-navy-50"
    >
      {/* HEADER FIXO - Agora com sticky */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-navy-200 shadow-lg">
        <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />
      </div>
      
      {/* Faixa dourada decorativa abaixo do header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/20 to-gold-500/0 h-px"></div>
        <div className="h-12 bg-gradient-to-b from-navy-900/5 to-transparent"></div>
      </div>

      {/* Main content */}
      <main className="container-custom max-w-5xl py-16">
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-3 text-navy-600 hover:text-gold-600 transition-colors group text-sm uppercase tracking-wider font-medium"
          >
            <span className="w-8 h-px bg-gold-500/50 group-hover:w-12 transition-all"></span>
            <span className="group-hover:translate-x-1 transition-transform">Voltar para artigos</span>
          </Link>
        </motion.div>

        {/* Card principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-sm shadow-2xl border border-navy-200 relative overflow-hidden"
        >
          {/* Textura de pergaminho */}
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            }}
          ></div>

          {/* Cantos dourados decorativos */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-gold-500/20 rounded-tl-sm"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-gold-500/20 rounded-tr-sm"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-gold-500/20 rounded-bl-sm"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-gold-500/20 rounded-br-sm"></div>

          {/* Conteúdo */}
          <div className="relative px-8 md:px-20 py-16 md:py-20">
            {/* Cabeçalho do artigo */}
            <motion.div variants={fadeInUp} className="mb-16 text-center">
              {/* Selo dourado superior */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-20 h-20 mx-auto mb-8 bg-navy-50 rounded-full flex items-center justify-center border-2 border-gold-500"
              >
                <span className="text-3xl text-gold-600">⚖️</span>
              </motion.div>

              {/* Categoria */}
              {post.data.category && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center mb-6"
                >
                  <span className="px-6 py-2 bg-navy-900 text-gold-500 text-xs font-bold tracking-[0.3em] uppercase rounded-none">
                    {post.data.category}
                  </span>
                </motion.div>
              )}

              {/* Título */}
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-navy-900 mb-8 leading-tight"
              >
                {post.data.title}
              </motion.h1>

              {/* Linha decorativa */}
              <div className="w-32 h-px bg-gold-500/50 mx-auto mb-8"></div>

              {/* Metadados */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-wrap items-center justify-center gap-8 text-navy-700"
              >
                {post.data.date && (
                  <div className="flex items-center gap-3">
                    <span className="text-gold-600 text-xl">📅</span>
                    <time className="font-serif text-lg">
                      {new Date(post.data.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </time>
                  </div>
                )}
                
                <div className="w-px h-8 bg-navy-300"></div>
                
                <div className="flex items-center gap-3">
                  <span className="text-gold-600 text-xl">⚖️</span>
                  <span className="font-serif text-lg">{post.data.author || `Dr. ${content.siteName}`}</span>
                </div>
                
                <div className="w-px h-8 bg-navy-300"></div>
                
                <div className="flex items-center gap-3">
                  <span className="text-gold-600 text-xl">📋</span>
                  <span className="font-serif text-lg">{content.oab}</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Imagem de destaque */}
            {post.data.image && (
              <motion.div 
                variants={fadeInUp}
                className="mb-16 -mx-4 md:-mx-10"
              >
                <div className="relative h-[500px] overflow-hidden border-8 border-white shadow-2xl">
                  <img
                    src={post.data.image}
                    alt={post.data.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/20 to-transparent"></div>
                  <div className="absolute inset-0 border border-gold-500/30 pointer-events-none"></div>
                </div>
              </motion.div>
            )}

            {/* Descrição */}
            {post.data.description && (
              <motion.div 
                variants={fadeInUp}
                className="mb-16 p-10 bg-navy-50 border-l-8 border-gold-500 italic text-navy-800 text-xl leading-relaxed"
              >
                "{post.data.description}"
              </motion.div>
            )}

            {/* Artigo com tipografia - CORRIGIDO */}
            <motion.article
              variants={fadeInUp}
              className="prose prose-lg max-w-none
                prose-headings:font-serif prose-headings:text-navy-900 prose-headings:font-bold
                prose-h1:text-4xl prose-h1:mt-20 prose-h1:mb-10 prose-h1:text-center
                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:pb-4 prose-h2:border-b-2 prose-h2:border-navy-200
                prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
                prose-p:text-navy-800 prose-p:leading-relaxed prose-p:mb-10 prose-p:text-justify prose-p:text-lg
                prose-a:text-gold-600 hover:prose-a:text-gold-500 prose-a:no-underline hover:prose-a:underline prose-a:transition-all
                prose-strong:text-navy-900 prose-strong:font-bold
                prose-ul:list-disc prose-ul:pl-8 prose-ul:my-10
                prose-ol:list-decimal prose-ol:pl-8 prose-ol:my-10
                prose-li:text-navy-800 prose-li:marker:text-gold-600 prose-li:text-lg prose-li:mb-3
                prose-blockquote:border-l-8 prose-blockquote:border-gold-500 prose-blockquote:bg-navy-50/50 
                prose-blockquote:py-8 prose-blockquote:px-10 prose-blockquote:rounded-none
                prose-blockquote:not-italic prose-blockquote:text-navy-700 prose-blockquote:font-serif prose-blockquote:text-xl
                prose-img:rounded-none prose-img:shadow-2xl prose-img:my-16 prose-img:border-4 prose-img:border-white
                prose-hr:border-navy-200 prose-hr:my-20"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
            />

            {/* Tempo de leitura */}
            <motion.div 
              variants={fadeInUp}
              className="mt-16 text-center"
            >
              <span className="text-sm text-navy-500 font-mono tracking-wider bg-navy-50 px-6 py-3">
                ⏱️ TEMPO DE LEITURA: {Math.ceil(post.content.split(' ').length / 200)} MINUTOS
              </span>
            </motion.div>

            {/* Selo de autenticidade */}
            <motion.div 
              variants={fadeInUp}
              className="mt-20 pt-12 border-t-2 border-navy-200 text-center"
            >
              <div className="inline-block p-8 bg-navy-50 border border-gold-500/30">
                <div className="flex flex-col items-center gap-4">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className="w-24 h-24 bg-navy-900 rounded-full flex items-center justify-center border-4 border-gold-500"
                  >
                    <span className="text-4xl text-gold-500">⚖️</span>
                  </motion.div>
                  
                  <div>
                    <p className="font-serif text-2xl text-navy-900 mb-2">{content.siteName}</p>
                    <p className="text-navy-600 mb-1 font-mono text-sm">{content.oab}</p>
                    <p className="text-xs text-navy-400 tracking-wider">ADVOGADO • OAB/SP</p>
                  </div>
                  
                  {post.data.date && (
                    <div className="mt-4 pt-4 border-t border-navy-200 w-full">
                      <p className="text-sm text-navy-500 font-serif">
                        Publicado em {new Date(post.data.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Navegação */}
            <motion.div 
              variants={fadeInUp}
              className="mt-16 pt-8 border-t-2 border-navy-200 flex justify-between items-center"
            >
              <Link
                to="/blog"
                className="group inline-flex items-center gap-3 text-navy-600 hover:text-gold-600 transition-colors"
              >
                <span className="w-8 h-px bg-gold-500/50 group-hover:w-12 transition-all"></span>
                <span className="font-serif text-lg group-hover:translate-x-1 transition-transform">Todos os artigos</span>
              </Link>

              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.data.title,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="group inline-flex items-center gap-3 text-navy-600 hover:text-gold-600 transition-colors"
              >
                <span className="font-serif text-lg group-hover:-translate-x-1 transition-transform">Compartilhar</span>
                <span className="w-8 h-px bg-gold-500/50 group-hover:w-12 transition-all"></span>
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Espaçamento */}
        <div className="h-20"></div>
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