import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadContent } from '../../utils/contentLoader';

export default function Home() {
  const [content, setContent] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Carrega configurações gerais
        const settingsData = await loadContent('/src/content/settings/general.md');
        
        // Carrega conteúdo da home
        const homeData = await loadContent('/src/content/pages/home.md');
        
        setSettings(settingsData?.data || {});
        setContent(homeData?.data || {});
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Dados padrão caso não tenha conteúdo do CMS ainda
  const heroTitle = content?.hero_title || "Excelência e Compromisso com seus direitos";
  const heroSubtitle = content?.hero_subtitle || "Mais de 15 anos defendendo os interesses de nossos clientes com ética, profissionalismo e dedicação.";
  const areas = content?.areas || [
    { icon: "👨‍👩‍👧‍👦", title: "Direito de Família", description: "Divórcio, guarda de filhos, pensão alimentícia e inventários." },
    { icon: "💼", title: "Direito Trabalhista", description: "Defesa dos direitos trabalhistas e acordos." },
    { icon: "🏢", title: "Direito Empresarial", description: "Assessoria completa para empresas." },
  ];
  const differentials = content?.differentials || [
    { icon: "⏱️", title: "Atendimento Rápido", description: "Respostas ágeis e soluções eficientes." },
    { icon: "🤝", title: "Atendimento Personalizado", description: "Cada caso merece atenção especial." },
    { icon: "📈", title: "Experiência Comprovada", description: "Mais de 500 casos bem-sucedidos." },
  ];

  const siteName = settings?.site_name || "Dr. Carlos Silva";
  const phone = settings?.phone || "(11) 1234-5678";
  const email = settings?.email || "contato@drcarlos.adv.br";
  const address = settings?.address || "Av. Paulista, 1000 - São Paulo/SP";
  const hours = settings?.hours || "Segunda a Sexta: 9h às 18h | Sábado: 9h às 13h";
  const oab = settings?.oab || "OAB/SP 123.456";

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-50 shadow-lg">
        <div className="container-custom py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{siteName}</h1>
            <p className="text-sm opacity-80">{oab}</p>
          </div>
          
          <nav className="hidden md:block">
            <Link to="/" className="nav-link ml-8">Início</Link>
            <Link to="/blog" className="nav-link ml-8">Artigos</Link>
            <Link to="/sobre" className="nav-link ml-8">Sobre</Link>
            <Link to="/contato" className="nav-link ml-8">Contato</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="bg-gradient-to-r from-primary to-secondary text-white py-20 md:py-32 relative overflow-hidden"
        style={content?.hero_image ? {
          backgroundImage: `url(${content.hero_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}}
      >
        <div className="container-custom grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              {heroTitle.split('Compromisso').map((part, i, arr) => 
                i === 0 ? part : <><span className="text-accent">Compromisso</span>{part}</>
              )}
            </h2>
            <p className="text-lg opacity-90 mb-8">{heroSubtitle}</p>
            <Link to="/contato" className="btn-primary">
              Consulta Gratuita
            </Link>
          </div>
        </div>
      </section>

      {/* Áreas de Atuação */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h3 className="section-title">Áreas de Atuação</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {areas.map((area, index) => (
              <div key={index} className="card">
                <div className="text-5xl mb-4">{area.icon}</div>
                <h4 className="text-2xl font-bold text-primary mb-3">{area.title}</h4>
                <p className="text-gray-600 leading-relaxed">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h3 className="section-title">Nossos Diferenciais</h3>
          
          <div className="grid md:grid-cols-3 gap-12">
            {differentials.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-primary">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-primary mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-secondary to-primary text-white py-20">
        <div className="container-custom text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Precisa de orientação jurídica?
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Entre em contato para uma consulta inicial gratuita e descubra 
            como podemos ajudar no seu caso.
          </p>
          <Link to="/contato" className="btn-primary">
            Fale com um especialista
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-4">{siteName}</h4>
              <p className="text-gray-400">{oab}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <p className="text-gray-400">
                📞 {phone}<br />
                ✉️ {email}<br />
                📍 {address}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Horário</h4>
              <p className="text-gray-400">{hours}</p>
            </div>
          </div>
          <div className="text-center text-gray-500 mt-12 pt-8 border-t border-gray-800">
            © 2024 {siteName}. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}