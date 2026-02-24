import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { loadContent } from "/src/utils/contentLoader";
import '../styles/animations.css';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [content, setContent] = useState({
    siteName: "Dr. Carlos Silva",
    oab: "OAB/SP 123.456",
    whatsapp: "5511999999999"
  });

  useEffect(() => {
    async function loadData() {
      try {
        // Carregar configurações
        const settingsData = await loadContent('/src/content/settings/general.md');
        setContent(prev => ({ ...prev, ...settingsData?.data }));

        // PASSO 1: Carregar o index.json com a lista de slugs
        const indexResponse = await fetch('/src/content/posts/index.json');
        let slugs = [];
        
        if (indexResponse.ok) {
          const indexData = await indexResponse.json();
          slugs = indexData.posts || [];
        }

        // PASSO 2: Carregar cada post pelo slug
        const postsData = [];
        
        for (const slug of slugs) {
          try {
            const response = await fetch(`/src/content/posts/${slug}.md`);
            if (response.ok) {
              const text = await response.text();
              const { data, content } = parseFrontmatter(text);
              postsData.push({
                slug,
                data,
                content: content.substring(0, 200) + '...'
              });
            }
          } catch (error) {
            console.log(`Erro ao carregar ${slug}`);
          }
        }
        
        // Ordenar por data
        postsData.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
        setPosts(postsData);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  function parseFrontmatter(text) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { data: {}, content: text };
    
    const data = {};
    match[1].split('\n').forEach(line => {
      if (line.includes(': ')) {
        const [key, ...value] = line.split(': ');
        data[key.trim()] = value.join(': ').trim();
      }
    });
    
    return { data, content: match[2] };
  }

  // Filtros
  const filteredPosts = posts.filter(post => {
    if (!post || !post.data) return false;
    
    const matchesCategory = selectedCategory === 'todos' || 
      (post.data.category && post.data.category === selectedCategory);
    
    const postTitle = post.data.title || '';
    const postDescription = post.data.description || '';
    
    const matchesSearch = 
      postTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      postDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const categories = ['todos', ...new Set(
    posts
      .filter(post => post && post.data && post.data.category)
      .map(p => p.data.category)
  )];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando artigos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans overflow-x-hidden">
      <Header 
        siteName={content.siteName}
        oab={content.oab}
        whatsapp={content.whatsapp}
      />

      <section className="pt-32 pb-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fadeInUp">
            Artigos & Publicações
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto animate-fadeInUp delay-200">
            Análises jurídicas, dicas e informações relevantes para você e seu negócio.
          </p>
        </div>
      </section>

      <section className="py-8 bg-gray-50 border-b">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-accent text-primary font-semibold'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category === 'todos' ? 'Todos' : category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl text-gray-400 mb-4">Nenhum artigo encontrado</p>
              <p className="text-gray-500">Tente buscar com outros termos ou categorias.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.slug}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.data.image || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"}
                      alt={post.data.title || 'Artigo'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    <span className="absolute top-4 left-4 bg-accent text-primary text-sm font-semibold px-3 py-1 rounded-full">
                      {post.data.category || 'Direito'}
                    </span>
                    
                    <span className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                      {post.data.date ? new Date(post.data.date).toLocaleDateString('pt-BR') : 'Data não informada'}
                    </span>
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                      <Link to={`/blog/${post.slug}`}>
                        {post.data.title || 'Sem título'}
                      </Link>
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.data.description || post.content}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          👤
                        </div>
                        <span className="text-sm text-gray-600">{post.data.author || 'Dr. Carlos Silva'}</span>
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-accent hover:text-primary font-medium flex items-center gap-1 group/link"
                      >
                        Ler mais
                        <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
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