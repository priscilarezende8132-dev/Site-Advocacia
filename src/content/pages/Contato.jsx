import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import Map from '../components/Maps';
import LoadingScreen from '../components/LoadingScreen';
import { loadContent } from '/src/utils/contentLoader';
import '../styles/animations.css';

export default function Contato() {
  const [content, setContent] = useState({
    siteName: "Edson Silva Maltez",
    oab: "OAB/SP 344.956",
    phone: "(19) 99631-9810",
    whatsapp: "5519996319810",
    email: "dredsonmaltez@gmail.com",
    address: "Rua Francisco Biancalana, 31 - sala 02 - Vila Santana, Sumaré - SP",
    mapsLink: "https://goo.gl/maps/...",
    wazeLink: "https://waze.com/ul/...",
    instagram: "#",
    linkedin: "#",
    facebook: "#"
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const settingsData = await loadContent('/src/content/settings/general.md');
        setContent(prev => ({ ...prev, ...settingsData?.data }));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    }
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Criar mensagem formatada para WhatsApp
    const whatsappMessage = `*Nova mensagem do site - Contato*\n\n` +
      `*Nome:* ${formData.name}\n` +
      `*E-mail:* ${formData.email}\n` +
      `*Telefone:* ${formData.phone}\n` +
      `${formData.subject ? `*Assunto:* ${formData.subject}\n` : ''}` +
      `*Mensagem:*\n${formData.message}`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappLink = `https://wa.me/${content.whatsapp}?text=${encodedMessage}`;

    // Abrir WhatsApp com a mensagem
    window.open(whatsappLink, '_blank');

    // Mostrar feedback de sucesso
    setSubmitted(true);
    
    // Limpar formulário após 3 segundos
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-white">
      <Header siteName={content.siteName} oab={content.oab} whatsapp={content.whatsapp} />
      
      <section className="pt-40 pb-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container-custom">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeInUp">Entre em Contato</h1>
          <p className="text-xl text-white/80 max-w-3xl animate-fadeInUp delay-200">
            Estamos prontos para atender você. Tire suas dúvidas ou agende uma consulta.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <span className="text-accent font-semibold tracking-wider uppercase">Fale conosco</span>
                <h2 className="text-4xl font-bold text-primary mt-2 mb-6">Informações de Contato</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:shadow-lg transition animate-slideInLeft">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-map-marker-alt text-accent text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Endereço</h3>
                    <p className="text-gray-600">{content.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:shadow-lg transition animate-slideInLeft delay-200">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-phone-alt text-accent text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Telefone / WhatsApp</h3>
                    <p className="text-gray-600">{content.phone}</p>
                    <a
                      href={`https://wa.me/${content.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline text-sm inline-flex items-center gap-1 mt-1"
                    >
                      <span>Iniciar conversa</span>
                      <i className="fas fa-external-link-alt text-xs"></i>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:shadow-lg transition animate-slideInLeft delay-400">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-envelope text-accent text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">E-mail</h3>
                    <a href={`mailto:${content.email}`} className="text-gray-600 hover:text-accent transition">
                      {content.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:shadow-lg transition animate-slideInLeft delay-600">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-clock text-accent text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Horário de atendimento</h3>
                    <p className="text-gray-600">Segunda a Sexta: 9h às 18h</p>
                    <p className="text-gray-600">Sábado: 9h às 13h</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 animate-fadeInUp">
                <h3 className="font-semibold text-primary mb-4">Redes Sociais</h3>
                <div className="flex gap-3">
                  <a
                    href={content.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl hover:bg-gradient-to-r from-purple-500 to-pink-500 hover:text-white transition-all"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href={content.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a
                    href={content.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl hover:bg-blue-500 hover:text-white transition-all"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slideInRight">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-check text-green-600 text-4xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">Mensagem enviada com sucesso!</h3>
                  <p className="text-gray-600">
                    Você será redirecionado para o WhatsApp para finalizar o envio.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-primary mb-6">Envie uma mensagem</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Nome completo*</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">E-mail*</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Telefone*</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Assunto</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Mensagem*</label>
                      <textarea
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                        required
                        placeholder="Descreva brevemente sua situação ou dúvida..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all hover:scale-105 shadow-lg group flex items-center justify-center gap-2"
                    >
                      <i className="fab fa-whatsapp text-xl"></i>
                      <span>Enviar via WhatsApp</span>
                      <i className="fas fa-external-link-alt text-sm group-hover:translate-x-1 transition-transform"></i>
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      Ao enviar, você será redirecionado para o WhatsApp para finalizar o envio da mensagem.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-custom">
          <Map address={content.address} />
          
          {/* Botões de navegação - Maps e Waze */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a
              href={content.mapsLink || "https://goo.gl/maps/..."}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg group"
            >
              <i className="fab fa-google text-xl"></i>
              <span>Abrir no Google Maps</span>
              <i className="fas fa-external-link-alt text-sm group-hover:translate-x-1 transition-transform"></i>
            </a>
            <a
              href={content.wazeLink || "https://waze.com/ul/..."}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#33CCFF] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#2ab8e6] transition-all hover:scale-105 shadow-lg group"
            >
              <i className="fab fa-waze text-xl"></i>
              <span>Abrir no Waze</span>
              <i className="fas fa-external-link-alt text-sm group-hover:translate-x-1 transition-transform"></i>
            </a>
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