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

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando artigo...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-primary">
        <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />
        
        <div className="flex items-center justify-center px-4 py-20">
          <div className="max-w-2xl text-center text-white">
            <div className="text-6xl mb-6">📜</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Artigo não encontrado
            </h1>
            <p className="text-white/80 text-lg mb-12">
              O artigo que você procura pode ter sido removido ou ainda não foi publicado.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300"
            >
              <span>←</span>
              Voltar para o blog
            </Link>
          </div>
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
      {/* Header Fixo */}
      <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />

      {/* Hero Section do Post - IGUAL ao HeroSection.jsx */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80 mix-blend-multiply z-10"></div>
          <img
            src={post.data.image || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"}
            alt={post.data.title}
            className="w-full h-full object-cover animate-scaleIn"
            style={{ transform: 'scale(1.1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60"></div>
        </div>

        {/* Content */}
        <div className="container-custom relative z-20 text-white">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Voltar para artigos
            </Link>

            {/* Categoria */}
            {post.data.category && (
              <span className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
                {post.data.category}
              </span>
            )}

            {/* Título */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fadeInUp">
              {post.data.title}
            </h1>

            {/* Descrição */}
            {post.data.description && (
              <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fadeInUp delay-200 max-w-2xl">
                {post.data.description}
              </p>
            )}

            {/* Metadados */}
            <div className="flex flex-wrap items-center gap-6 text-white/80 animate-fadeInUp delay-400">
              {post.data.date && (
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <time>
                    {new Date(post.data.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </time>
                </div>
              )}
              
              <span className="w-1 h-1 bg-white/50 rounded-full"></span>
              
              <div className="flex items-center gap-2">
                <span>⚖️</span>
                <span>{post.data.author || `Dr. ${content.siteName}`}</span>
              </div>
              
              <span className="w-1 h-1 bg-white/50 rounded-full"></span>
              
              <div className="flex items-center gap-2">
                <span>📋</span>
                <span>{content.oab}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </section>

      {/* Main Content */}
      <main className="container-custom max-w-4xl py-20">
        {/* Artigo */}
        <article className="prose prose-lg max-w-none
          prose-headings:text-primary prose-headings:font-bold
          prose-h1:text-4xl prose-h1:mt-16 prose-h1:mb-8
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b-2 prose-h2:border-gray-200
          prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
          prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-accent hover:prose-a:text-accent/80 prose-a:no-underline
          prose-strong:text-primary prose-strong:font-semibold
          prose-ul:list-disc prose-ul:pl-8 prose-ul:my-8
          prose-ol:list-decimal prose-ol:pl-8 prose-ol:my-8
          prose-li:text-gray-600 prose-li:marker:text-accent prose-li:mb-2
          prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-gray-50 
          prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
          prose-blockquote:not-italic prose-blockquote:text-gray-700
          prose-img:rounded-lg prose-img:shadow-xl prose-img:my-12
          prose-hr:border-gray-200 prose-hr:my-16"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* Tempo de leitura */}
        <div className="mt-12 text-center">
          <span className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-6 py-3 rounded-full shadow-sm">
            ⏱️ Tempo de leitura: {Math.ceil(post.content.split(' ').length / 200)} minutos
          </span>
        </div>

        {/* Seção do Autor - IGUAL ao AboutSection.jsx */}
        <div className="mt-20 bg-gradient-to-b from-white to-gray-50 p-12 rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-primary rounded-2xl flex items-center justify-center shadow-xl group">
                <span className="text-5xl text-accent group-hover:scale-110 transition-transform">⚖️</span>
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg animate-float">
                <p className="text-sm font-bold text-primary">{content.oab}</p>
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-primary mb-2">{content.siteName}</h3>
              <p className="text-gray-600 mb-4">
                Advogado especialista dedicado a oferecer soluções jurídicas com excelência, 
                ética e compromisso. Artigos elaborados para informar e orientar sobre 
                temas relevantes do direito.
              </p>
              
              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">OAB ativo</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">15+ anos experiência</span>
                </div>
              </div>
            </div>
            
            {/* Data */}
            {post.data.date && (
              <div className="bg-primary text-white p-4 rounded-xl text-center">
                <p className="text-sm text-accent mb-1">Publicado</p>
                <p className="font-bold">
                  {new Date(post.data.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navegação */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Todos os artigos
          </Link>

          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: post.data.title,
                  text: post.data.description,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copiado!');
              }
            }}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary rounded-full font-bold hover:scale-105 transition-all duration-300"
          >
            <span>Compartilhar</span>
            <span className="group-hover:translate-x-1 transition-transform">📤</span>
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