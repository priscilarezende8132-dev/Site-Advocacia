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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          {/* Loader minimalista e profissional */}
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-2 border-primary/10 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-400 font-medium tracking-wider">CARREGANDO</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mb-6">
            <span className="text-7xl font-light text-primary/20">404</span>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-3">Artigo não encontrado</h1>
          <p className="text-gray-500 mb-8">
            O artigo que você está procurando pode ter sido removido ou ainda não foi publicado.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para o blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />

      {/* Cabeçalho do artigo - Design clean e profissional */}
      <div className="border-b border-gray-100">
        <div className="container-custom py-12">
          {/* Breadcrumb */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-primary transition-colors mb-6 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Todos os artigos</span>
          </Link>

          {/* Categoria */}
          {post.data.category && (
            <div className="mb-4">
              <span className="text-xs font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-full">
                {post.data.category}
              </span>
            </div>
          )}

          {/* Título */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary leading-tight max-w-4xl mb-6">
            {post.data.title}
          </h1>

          {/* Metadados em linha - estilo jurídico */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            {post.data.date && (
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(post.data.date).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Por {post.data.author || `Dr. ${content.siteName}`}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{Math.ceil(post.content.split(' ').length / 200)} min de leitura</span>
            </div>
          </div>
        </div>
      </div>

      {/* Imagem de destaque (se houver) - Agora com altura reduzida */}
      {post.data.image && (
        <div className="border-b border-gray-100">
          <div className="container-custom py-8">
            <div className="relative h-[400px] rounded-xl overflow-hidden bg-gray-50">
              <img
                src={post.data.image}
                alt={post.data.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Descrição/Resumo em destaque */}
            {post.data.description && (
              <div className="mb-12 p-6 bg-gray-50 rounded-lg border-l-4 border-primary">
                <p className="text-gray-700 leading-relaxed">
                  {post.data.description}
                </p>
              </div>
            )}

            {/* Artigo com tipografia jurídica */}
            <article
              className="prose prose-lg max-w-none
                prose-headings:font-serif prose-headings:text-primary prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-primary hover:prose-a:text-primary-dark prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6
                prose-li:text-gray-600 prose-li:mb-2
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gray-50 
                prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                prose-blockquote:not-italic prose-blockquote:text-gray-700 prose-blockquote:font-serif
                prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
                prose-hr:border-gray-200 prose-hr:my-12"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
            />

            {/* Assinatura/Encerramento */}
            <div className="mt-16 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Artigo escrito por</p>
                  <p className="font-serif font-bold text-primary">{content.siteName}</p>
                  <p className="text-xs text-gray-400 mt-1">{content.oab}</p>
                </div>
                
                {/* Data de publicação atualizada */}
                {post.data.date && (
                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-1">Publicado em</p>
                    <p className="text-sm text-gray-600">
                      {new Date(post.data.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Navegação entre artigos (placeholder) */}
            <div className="mt-12 flex justify-between items-center">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Ver todos os artigos</span>
              </Link>

              {/* Botão de compartilhamento discreto */}
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.data.title,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    // Feedback visual (opcional)
                  }
                }}
                className="text-gray-400 hover:text-primary transition-colors p-2"
                title="Compartilhar artigo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

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