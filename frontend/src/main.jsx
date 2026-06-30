import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Award,
  Building2,
  Camera,
  ChevronRight,
  FileText,
  Factory,
  Gauge,
  HardHat,
  ImagePlus,
  Instagram,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  PlayCircle,
  Settings,
  ShieldCheck,
  Upload,
  UserCircle,
  Wrench,
  X,
  Youtube
} from 'lucide-react';
import heroImage from './assets/imec/hero-welder.jpg';
import footerImage from './assets/imec/footer-industrial.jpg';
import portfolioVasos from './assets/imec/portfolio-vasos.jpg';
import portfolioTubulacoes from './assets/imec/portfolio-tubulacoes.jpg';
import portfolioEstruturas from './assets/imec/portfolio-estruturas.jpg';
import portfolioTanques from './assets/imec/portfolio-tanques.jpg';
import portfolioCaldeiraria from './assets/imec/portfolio-caldeiraria.jpg';
import portfolioCargas from './assets/imec/portfolio-cargas.jpg';
import './styles.css';
import './polish.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';
const UPLOADS = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:3333/uploads';
const SITE_VERSION = 'Site institucional premium';
const DEFAULT_PHONE = '(18) 3786-1272';
const DEFAULT_WHATSAPP = '551837861272';
const DEFAULT_EMAIL = 'comercial@imecmetalurgica.com.br';
const DEFAULT_ADDRESS = 'Rua Júlio Ventura, 655 - Sud Mennucci, SP';

function whatsappUrl(settings = {}, message = 'Olá! Gostaria de solicitar um orçamento com a IMEC Metalúrgica.') {
  const raw = settings.whatsapp || settings.phone || DEFAULT_WHATSAPP;
  const phone = String(raw).replace(/\D/g, '') || DEFAULT_WHATSAPP;
  return `https://wa.me/${phone.startsWith('55') ? phone : `55${phone}`}?text=${encodeURIComponent(message)}`;
}

function assetUrl(url) {
  if (!url) return heroImage;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `${UPLOADS}${url.replace('/uploads', '')}`;
  return url;
}

async function api(path, options = {}) {
  const token = localStorage.getItem('imec_token');
  const headers = options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API}${path}`, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Erro na ação.');
  return data;
}

const iconMap = { Factory, Wrench, Settings, Building2, Gauge, HardHat, Camera };
const fallbackServices = [
  { id: 's1', title: 'Montagem Industrial', short_description: 'Montagem de equipamentos, plantas e conjuntos para usinas de etanol, açúcar e energia.', icon: 'Factory' },
  { id: 's2', title: 'Suporte Técnico', short_description: 'Acompanhamento técnico antes, durante e depois da entrega dos projetos e equipamentos.', icon: 'Wrench' },
  { id: 's3', title: 'Manutenção de Equipamentos', short_description: 'Manutenção e reforma de colunas, pré-evaporadores, tanques e trocadores de calor.', icon: 'Settings' },
  { id: 's4', title: 'Projetos', short_description: 'Soluções completas para fabricação, montagem e melhoria de processos industriais.', icon: 'Building2' },
  { id: 's5', title: 'Locação de Guinchos e Munks', short_description: 'Apoio para movimentação e montagem de equipamentos industriais em campo.', icon: 'Gauge' },
  { id: 's6', title: 'Equipamentos para Usinas', short_description: 'Produtos e serviços para fabricação de etanol, açúcar, energia e indústria alimentícia.', icon: 'HardHat' }
];
const fallbackPortfolio = [
  { title: 'Concentrador de Levedura', category: 'Conder Therm', image_url: portfolioVasos },
  { title: 'Decantador de Fuligem', category: 'Tratamento de fuligem de caldeira', image_url: portfolioTubulacoes },
  { title: 'Colunas de Destilação', category: 'Etanol combustível, neutro e especial', image_url: portfolioEstruturas },
  { title: 'Pré-evaporadores e Tanques', category: 'Fabricação, montagem e manutenção', image_url: portfolioTanques },
  { title: 'Trocadores de Calor', category: 'Equipamentos industriais', image_url: portfolioCaldeiraria },
  { title: 'Plantas para Usinas', category: 'Etanol, açúcar e energia', image_url: portfolioCargas },
].map((item, index) => ({ id: `p${index}`, ...item }));

function officialSettings(settings = {}) {
  const oldPhone = !settings.phone || settings.phone.includes('(47)');
  return oldPhone
    ? { ...settings, phone: DEFAULT_PHONE, whatsapp: DEFAULT_WHATSAPP, email: DEFAULT_EMAIL, address: DEFAULT_ADDRESS, city: 'Sud Mennucci', state: 'São Paulo' }
    : settings;
}

function officialServices(items = []) {
  const hasOldTemplate = items.some((item) => ['Caldeiraria', 'Soldagem Industrial', 'NR-13', 'Rigging'].includes(item.title));
  return items.length && !hasOldTemplate ? items : fallbackServices;
}

function officialPortfolio(items = []) {
  const hasOldTemplate = items.some((item) => ['Vasos de Pressão', 'Tubulações Industriais', 'Estruturas Metálicas'].includes(item.title));
  return items.length && !hasOldTemplate ? items : fallbackPortfolio;
}

function officialPage(page = {}, slug) {
  if (slug === 'home' && (!page.title || page.title.includes('Engenharia, Tecnologia'))) return {};
  if (slug === 'quem-somos' && (!page.title || page.title.includes('Engenharia industrial'))) return {};
  return page;
}

function Logo({ settings = {} }) {
  return <a className="brand" href="/"><span className="mark">I</span><span><b>IMEC</b><small>Metalúrgica</small></span></a>;
}

function Header({ settings, current }) {
  const [open, setOpen] = useState(false);
  const nav = [
    ['/', 'Home'], ['/quem-somos', 'Quem Somos'], ['/servicos', 'Serviços'], ['/galeria', 'Galeria'], ['/videos', 'Vídeos'], ['/portfolio', 'Portfólio'], ['/contato', 'Contato']
  ];
  return <header className="topbar">
    <Logo settings={settings} />
    <button className="menu" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
    <nav className={open ? 'open' : ''}>{nav.map(([href, label]) => <a className={current === href ? 'active' : ''} href={href} key={href}>{label}</a>)}</nav>
    <div className="top-actions">
      <a className="phone" href={`tel:${settings?.phone || DEFAULT_PHONE}`}><Phone size={16} /> {settings?.phone || DEFAULT_PHONE}</a>
      <a className="btn primary" href={whatsappUrl(settings)} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Solicitar Orçamento</a>
    </div>
  </header>;
}

function Footer({ settings }) {
  return <footer className="footer">
    <div><Logo settings={settings} /><p>Soluções industriais com engenharia, tecnologia e confiança.</p><small className="version-tag">{SITE_VERSION}</small></div>
    <div><h4>Navegação</h4><a href="/">Home</a><a href="/quem-somos">Quem Somos</a><a href="/servicos">Serviços</a><a href="/portfolio">Portfólio</a></div>
    <div><h4>Contato</h4><span>{settings?.phone || DEFAULT_PHONE}</span><span>{settings?.email || DEFAULT_EMAIL}</span><span>{settings?.address || DEFAULT_ADDRESS}</span><a href={whatsappUrl(settings)}>Chamar no WhatsApp</a></div>
    <div><h4>Redes sociais</h4><div className="socials"><a href={settings?.linkedin_url || '#'}><Linkedin size={18} /></a><a href={settings?.instagram_url || '#'}><Instagram size={18} /></a><a href={settings?.youtube_url || '#'}><Youtube size={18} /></a></div></div>
    <a className="admin-link" href="/admin"><Lock size={14} /> Painel administrativo</a>
  </footer>;
}

function PageTitle({ eyebrow, title, text }) {
  return <section className="page-title"><span>{eyebrow}</span><h1>{title}</h1>{text && <p>{text}</p>}</section>;
}

function ServiceCard({ item }) {
  const Icon = iconMap[item.icon] || Factory;
  return <article className="service-card"><Icon /><h3>{item.title}</h3><p>{item.short_description}</p></article>;
}

function PortfolioCard({ item }) {
  return <article className="portfolio-card" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.86)), url(${assetUrl(item.cover_image_url || item.image_url)})` }}><strong>{item.title}</strong><span>{item.category || item.short_description || 'Obra industrial'}</span></article>;
}

function Home({ data }) {
  const settings = officialSettings(data.settings || {});
  const home = officialPage(data.pages?.home || {}, 'home');
  const services = officialServices(data.services || []);
  const portfolio = officialPortfolio(data.portfolio || []);
  return <>
    <section className="hero-ref" style={{ backgroundImage: `linear-gradient(90deg, rgba(3,10,18,.98), rgba(3,10,18,.72) 44%, rgba(3,10,18,.26) 70%, rgba(3,10,18,.86)), url(${assetUrl(settings.hero_image_url || home.image_url || heroImage)})` }}>
      <div className="hero-copy"><span>IMEC Metalúrgica</span><h1>{home.title || 'Soluções completas para projetos e equipamentos industriais'}</h1><p>{home.subtitle || 'Equipamentos e serviços para fabricação de etanol, açúcar e energia, com referência nacional em mais de 100 usinas de açúcar e álcool e na indústria alimentícia.'}</p><div className="hero-actions"><a className="btn primary" href={whatsappUrl(settings)} target="_blank" rel="noreferrer">Solicitar Orçamento <ChevronRight size={18} /></a><a className="btn outline" href="/servicos">Ver Serviços <ChevronRight size={18} /></a></div></div>
      <aside className="badges"><article><Award /><b>Acompanhamento de Performance</b><small>Suporte após a entrega para eficiência e qualidade.</small></article><article><ShieldCheck /><b>Comunicação Direta</b><small>Contato acessível com o responsável pelo projeto.</small></article><article><Settings /><b>Fornecedor BNDES</b><small>Empresa cadastrada como fornecedora de produtos e serviços.</small></article></aside>
    </section>
    <section className="home-strip services-strip"><div className="strip-title"><span>Principais Serviços</span><h2>Atuação no setor sucroalcooleiro</h2><a href="/servicos">Ver todos <ChevronRight size={16} /></a></div><div className="service-row">{services.slice(0, 6).map((item) => <ServiceCard item={item} key={item.id} />)}</div></section>
    <section className="home-strip portfolio-strip"><div className="strip-title"><span>Produtos</span><h2>Equipamentos para usinas</h2><a href="/portfolio">Ver produtos <ChevronRight size={16} /></a></div><div className="portfolio-row">{portfolio.slice(0, 6).map((item) => <PortfolioCard item={item} key={item.id} />)}</div></section>
    <section className="quick-links" style={{ backgroundImage: `linear-gradient(90deg,rgba(4,14,24,.94),rgba(8,31,52,.92)),url(${footerImage})` }}><a href="/videos"><PlayCircle /><b>Vídeos</b><small>Projetos, processos e bastidores das operações.</small></a><a href="/galeria"><ImagePlus /><b>Galeria</b><small>Fotos de obras, fabricação e montagem industrial.</small></a><a href={whatsappUrl(settings)} target="_blank" rel="noreferrer"><UserCircle /><b>Orçamento</b><small>Fale com a equipe técnica da IMEC pelo WhatsApp.</small></a></section>
  </>;
}

function About({ data }) {
  const about = officialPage(data.pages?.['quem-somos'] || {}, 'quem-somos');
  return <><PageTitle eyebrow="Quem Somos" title={about.title || 'Desde 1998 atendendo o setor sucroalcooleiro'} text={about.subtitle || 'Sediada em Sud Mennucci-SP, a IMEC atua com fabricação, montagem e manutenção de equipamentos para etanol, açúcar e energia.'} /><section className="content-split"><h2>IMEC Metalúrgica</h2><p>{about.content || 'A IMEC surgiu da união dos diretores Edson Ribeiro e José Della Possa, ambos com extensa experiência no setor sucroalcooleiro. A empresa iniciou suas atividades fabricando, montando e mantendo colunas de destilação, pré-evaporadores, tanques, trocadores de calor e outros equipamentos industriais. Ao longo da sua trajetória, consolidou-se como referência nacional, atendendo mais de 100 usinas de açúcar e álcool e empresas da indústria alimentícia.'}</p><div className="pillars"><article><Award /><b>Missão</b><span>Oferecer a melhor e mais completa solução em produtos e serviços para desenvolver e aprimorar o cenário energético brasileiro.</span></article><article><ShieldCheck /><b>Valores</b><span>Superar expectativas, valorizar colaboradores, respeitar clientes e celebrar vitórias com todos que fizeram parte delas.</span></article><article><FileText /><b>Visão</b><span>Expandir em tamanho e variedade de serviços para ser parte fundamental da transformação energética brasileira.</span></article></div></section></>;
}

function Services({ data }) {
  const services = officialServices(data.services || []);
  return <><PageTitle eyebrow="Serviços" title="Soluções para usinas, energia e indústria alimentícia" text="Montagem industrial, suporte técnico, manutenção de equipamentos, projetos, locação de guinchos e munks, além de produtos para processos sucroalcooleiros." /><section className="page-grid service-grid">{services.map((item) => <ServiceCard item={item} key={item.id} />)}</section></>;
}

function Portfolio({ data }) {
  const portfolio = officialPortfolio(data.portfolio || []);
  return <><PageTitle eyebrow="Produtos" title="Equipamentos e soluções para o setor sucroalcooleiro" text="Concentrador de levedura, decantador de fuligem, colunas de destilação, pré-evaporadores, tanques, trocadores de calor e plantas industriais." /><section className="page-grid portfolio-grid">{portfolio.map((item) => <PortfolioCard item={item} key={item.id} />)}</section></>;
}

function Gallery({ data }) {
  const photos = data.photos?.length ? data.photos : fallbackServices;
  return <><PageTitle eyebrow="Galeria" title="Estrutura, fabricação e montagem industrial" text="Registros de equipamentos, obras e processos ligados às usinas de açúcar, álcool, energia e indústria alimentícia." /><section className="gallery-grid">{photos.map((photo) => <figure key={photo.id}><img src={assetUrl(photo.image_url)} alt={photo.alt_text || photo.title} /><figcaption>{photo.title}</figcaption></figure>)}</section></>;
}

function Videos({ data }) {
  const videos = data.videos?.length ? data.videos : [{ id: 'v1', title: 'Cadastre vídeos pelo painel', description: 'Links do YouTube aparecerão aqui.' }];
  return <><PageTitle eyebrow="Vídeos" title="Projetos e bastidores em vídeo" text="Conteúdos em vídeo dos projetos, processos e operações da IMEC." /><section className="video-grid">{videos.map((video) => <article className="video-card" key={video.id}>{video.youtube_id ? <iframe src={`https://www.youtube.com/embed/${video.youtube_id}`} title={video.title} allowFullScreen /> : <div><PlayCircle size={58} /></div>}<h3>{video.title}</h3><p>{video.description}</p></article>)}</section></>;
}

function Contact({ data }) {
  const settings = officialSettings(data.settings || {});
  const services = officialServices(data.services || []);
  const [sent, setSent] = useState('');
  const [quote, setQuote] = useState({ name: '', company: '', email: '', phone: '', service_interest: '', message: '' });
  const quoteMessage = [
    'Olá! Gostaria de solicitar um orçamento com a IMEC Metalúrgica.',
    quote.name && `Nome: ${quote.name}`,
    quote.company && `Empresa: ${quote.company}`,
    quote.phone && `Telefone: ${quote.phone}`,
    quote.email && `E-mail: ${quote.email}`,
    quote.service_interest && `Serviço: ${quote.service_interest}`,
    quote.message && `Mensagem: ${quote.message}`,
  ].filter(Boolean).join('\n');
  async function submit(event) {
    event.preventDefault();
    try {
      await api('/public/quotes', { method: 'POST', body: JSON.stringify(quote) });
      setSent('Pedido salvo com sucesso. Abrindo WhatsApp para agilizar o atendimento.');
    } catch {
      setSent('Abrindo WhatsApp para enviar seu pedido.');
    }
    window.open(whatsappUrl(settings, quoteMessage), '_blank', 'noopener,noreferrer');
  }
  return <section className="contact-page"><div><span>Solicitar Orçamento</span><h1>Fale com a IMEC sobre sua usina ou projeto industrial</h1><p>Entre em contato para montagem industrial, suporte técnico, manutenção de equipamentos, projetos, locação de guinchos e munks, ou produtos para etanol, açúcar e energia.</p><p><Phone size={17} /> {settings.phone || DEFAULT_PHONE}</p><p><Mail size={17} /> {settings.email || DEFAULT_EMAIL}</p><p><MapPin size={17} /> {settings.address || DEFAULT_ADDRESS}</p><div className="contact-stats"><article><b>100+</b><small>usinas atendidas</small></article><article><b>1998</b><small>início das atividades</small></article><article><b>BNDES</b><small>fornecedor cadastrado</small></article></div></div><form onSubmit={submit}>{['name', 'company', 'email', 'phone'].map((key) => <input key={key} placeholder={{ name: 'Nome', company: 'Empresa', email: 'E-mail', phone: 'Telefone / WhatsApp' }[key]} value={quote[key]} onChange={(e) => setQuote({ ...quote, [key]: e.target.value })} required={key !== 'company'} />)}<select value={quote.service_interest} onChange={(e) => setQuote({ ...quote, service_interest: e.target.value })}><option value="">Serviço de interesse</option>{services.map((item) => <option key={item.id}>{item.title}</option>)}</select><textarea placeholder="Descreva sua necessidade" value={quote.message} onChange={(e) => setQuote({ ...quote, message: e.target.value })} required /><button className="btn primary">Enviar pelo WhatsApp</button>{sent && <p className="ok">{sent}</p>}</form></section>;
}

function PublicSite() {
  const [data, setData] = useState({ settings: {}, pages: {}, services: [], portfolio: [], photos: [], videos: [] });
  useEffect(() => { api('/public/bootstrap').then(setData).catch(() => {}); }, []);
  const current = window.location.pathname.replace(/\/$/, '') || '/';
  const page = useMemo(() => {
    if (current === '/quem-somos') return <About data={data} />;
    if (current === '/servicos') return <Services data={data} />;
    if (current === '/portfolio') return <Portfolio data={data} />;
    if (current === '/galeria') return <Gallery data={data} />;
    if (current === '/videos') return <Videos data={data} />;
    if (current === '/contato') return <Contact data={data} />;
    return <Home data={data} />;
  }, [current, data]);
  return <><Header settings={officialSettings(data.settings || {})} current={current} /><main>{page}</main><Footer settings={officialSettings(data.settings || {})} /></>;
}

function Admin() {
  const [token, setToken] = useState(localStorage.getItem('imec_token') || '');
  const [login, setLogin] = useState({ email: 'admin@imec.com.br', password: 'Admin@123' });
  const [tab, setTab] = useState('settings');
  const [state, setState] = useState({});
  const [msg, setMsg] = useState('');
  const tabs = ['settings', 'pages', 'services', 'portfolio', 'categories', 'photos', 'videos', 'quotes'];
  async function load() { const entries = await Promise.all([api('/admin/settings').then((d) => ['settings', d]), ...tabs.filter((x) => x !== 'settings').map((r) => api('/admin/' + r).then((d) => [r, d]))]); setState(Object.fromEntries(entries)); }
  useEffect(() => { if (token) load().catch((e) => setMsg(e.message)); }, [token]);
  async function enter(e) { e.preventDefault(); const d = await api('/auth/login', { method: 'POST', body: JSON.stringify(login) }); localStorage.setItem('imec_token', d.token); setToken(d.token); }
  if (!token) return <main className="login"><form onSubmit={enter}><Logo /><h1>Painel Administrativo</h1><input value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} /><input type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} /><button className="btn primary">Entrar</button></form></main>;
  async function saveSettings(e) { e.preventDefault(); await api('/admin/settings', { method: 'PUT', body: JSON.stringify(state.settings) }); setMsg('Salvo.'); }
  async function upload(file, cb) { const fd = new FormData(); fd.append('file', file); const d = await api('/admin/upload', { method: 'POST', body: fd }); cb(d.url); }
  async function save(resource, item) { await api(`/admin/${resource}${item.id ? '/' + item.id : ''}`, { method: item.id ? 'PUT' : 'POST', body: JSON.stringify(item) }); await load(); setMsg('Salvo.'); }
  return <main className="admin"><aside><Logo />{tabs.map((x) => <button className={tab === x ? 'active' : ''} onClick={() => setTab(x)} key={x}>{x}</button>)}<button onClick={() => { localStorage.clear(); setToken(''); }}>Sair</button></aside><section><h1>{tab}</h1>{msg && <p className="ok">{msg}</p>}{tab === 'settings' ? <SettingsForm data={state.settings || {}} setData={(d) => setState({ ...state, settings: d })} save={saveSettings} upload={upload} /> : <Crud resource={tab} items={state[tab] || []} save={save} upload={upload} />}</section></main>;
}

function SettingsForm({ data, setData, save, upload }) {
  return <form className="form" onSubmit={save}>{['company_name', 'phone', 'whatsapp', 'email', 'address', 'city', 'state', 'instagram_url', 'linkedin_url', 'youtube_url', 'facebook_url', 'logo_url', 'hero_image_url'].map((field) => <label key={field}>{field}<input value={data[field] || ''} onChange={(e) => setData({ ...data, [field]: e.target.value })} /></label>)}<label className="upload"><Upload /> Enviar banner<input type="file" accept="image/*" onChange={(e) => e.target.files[0] && upload(e.target.files[0], (url) => setData({ ...data, hero_image_url: url }))} /></label><button className="btn primary">Salvar</button></form>;
}

const fields = { pages: ['slug', 'title', 'subtitle', 'content', 'image_url', 'is_active'], services: ['title', 'slug', 'short_description', 'description', 'icon', 'image_url', 'display_order', 'is_active'], portfolio: ['title', 'slug', 'category', 'location', 'year', 'short_description', 'description', 'cover_image_url', 'display_order', 'is_active'], categories: ['name', 'slug', 'display_order', 'is_active'], photos: ['category_id', 'title', 'image_url', 'alt_text', 'display_order', 'is_active'], videos: ['title', 'youtube_url', 'description', 'display_order', 'is_active'], quotes: ['name', 'company', 'email', 'phone', 'service_interest', 'message', 'status'] };
function Crud({ resource, items, save, upload }) {
  const blank = { is_active: 1, display_order: 0 };
  const [cur, setCur] = useState(blank);
  return <div className="crud"><form className="form" onSubmit={(e) => { e.preventDefault(); save(resource, cur); setCur(blank); }}>{fields[resource].filter((f) => !['name', 'company', 'email', 'phone', 'message', 'service_interest'].includes(f) || resource !== 'quotes').map((f) => f.includes('description') || f === 'content' || f === 'message' ? <label key={f}>{f}<textarea value={cur[f] || ''} onChange={(e) => setCur({ ...cur, [f]: e.target.value })} /></label> : <label key={f}>{f}<input value={cur[f] ?? ''} onChange={(e) => setCur({ ...cur, [f]: e.target.value })} /></label>)}{resource !== 'quotes' && <label className="upload"><Upload /> Upload<input type="file" accept="image/*" onChange={(e) => e.target.files[0] && upload(e.target.files[0], (url) => setCur({ ...cur, image_url: url, cover_image_url: url }))} /></label>}<button className="btn primary">Salvar</button></form><div className="list">{items.map((i) => <article key={i.id}><b>{i.title || i.name || i.email}</b><p>{i.short_description || i.youtube_url || i.message}</p><button onClick={() => setCur(i)}>Editar</button></article>)}</div></div>;
}

createRoot(document.getElementById('root')).render(location.pathname.startsWith('/admin') ? <Admin /> : <PublicSite />);
