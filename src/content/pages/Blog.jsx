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
  const [searchTerm, setSearchTerm] = useState('');
  const [content, setContent] = useState({
    siteName: "Dr. Carlos Silva",
    oab: "OAB/SP 123.456",
    whatsapp: "5511999999999"
  });

  useEffect(() => {
    async function loadData() {
      try {
        const settingsData = await loadContent('/src/content/settings/general.md');
        setContent(prev => ({ ...prev, ...settingsData?.data }));

        // 1️⃣ Carrega a lista de slugs do posts.json
        const indexRes = await fetch('/posts.json');
        const indexData = await indexRes.json();
        const slugs = indexData.posts || [];

        // 2️⃣ Carrega cada post individualmente
        const postsData = [];
        for (const slug of slugs) {
          const res = await fetch(`/src/content/posts/${slug}.md`);
          if (res.ok) {
            const text = await res.text();
            const { data, content } = parseFrontmatter(text);
            postsData.push({
              slug,
              data,
              content: content.substring(0, 150) + '...'
            });
          }
        }

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

  const filteredPosts = posts.filter(p =>
    p.data.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.data.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />

      <section className="pt-32 pb-16 bg-gradient-to-r from-primary to-secondary text-white text-center">
        <div className="container-custom">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fadeInUp">Artigos & Publicações</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto animate-fadeInUp delay-200">
            Análises jurídicas, dicas e informações relevantes para você e seu negócio.
          </p>
        </div>
      </section>

      <section className="py-8 bg-gray-50 border-b">
        <div className="container-custom flex justify-center">
          <input
            type="text"
            placeholder="Buscar artigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          {filteredPosts.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum artigo encontrado.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.slug} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition hover:-translate-y-2">
                  {post.data.image && (
                    <img src={post.data.image} alt={post.data.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <span className="text-sm text-accent font-semibold">{post.data.category || 'Direito'}</span>
                    <h2 className="text-2xl font-bold text-primary mt-2">
                      <Link to={`/blog/${post.slug}`}>{post.data.title || 'Sem título'}</Link>
                    </h2>
                    <p className="text-gray-600 mt-2">{post.data.description || post.content}</p>
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                      <span>{post.data.date ? new Date(post.data.date).toLocaleDateString('pt-BR') : 'Data não informada'}</span>
                      <Link to={`/blog/${post.slug}`} className="text-accent font-medium hover:underline">Ler mais →</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <WhatsAppButton whatsapp={content.whatsapp} />
      <Footer siteName={content.siteName} oab={content.oab} phone={content.phone} email={content.email} address={content.address} whatsapp={content.whatsapp} />
    </div>
  );
}