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
  Menu,
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
import heroImage from './assets/hero-industrial.svg';
import './styles.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';
const UPLOADS = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:3333/uploads';

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
  { id: 's1', title: 'Caldeiraria', short_description: 'Fabricação e montagem de equipamentos e tubulações industriais.', icon: 'Factory' },
  { id: 's2', title: 'Soldagem Industrial', short_description: 'Processos qualificados e soldadores certificados para máxima qualidade.', icon: 'Wrench' },
  { id: 's3', title: 'Manutenção Industrial', short_description: 'Manutenção preventiva, preditiva e corretiva com foco em performance.', icon: 'Settings' },
  { id: 's4', title: 'Estruturas Metálicas', short_description: 'Projetos, fabricação e montagem de estruturas metálicas sob medida.', icon: 'Building2' },
  { id: 's5', title: 'NR-13', short_description: 'Adequação, inspeção, laudos e ART conforme norma NR-13.', icon: 'Gauge' },
  { id: 's6', title: 'Rigging', short_description: 'Içamento e movimentação de cargas com segurança e planejamento.', icon: 'HardHat' }
];
const fallbackPortfolio = ['Vasos de Pressão', 'Tubulações Industriais', 'Estruturas Metálicas', 'Manutenção Industrial', 'Caldeiraria Pesada', 'Movimentação de Cargas'].map((title, index) => ({ id: `p${index}`, title, category: 'Projeto industrial' }));

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
      {settings?.phone && <a className="phone" href={`tel:${settings.phone}`}><Phone size={16} /> {settings.phone}</a>}
      <a className="btn primary" href="/contato">Solicitar Orçamento</a>
    </div>
  </header>;
}

function Footer({ settings }) {
  return <footer className="footer">
    <div><Logo settings={settings} /><p>Soluções industriais com engenharia, tecnologia e confiança.</p></div>
    <div><h4>Navegação</h4><a href="/">Home</a><a href="/quem-somos">Quem Somos</a><a href="/servicos">Serviços</a><a href="/portfolio">Portfólio</a></div>
    <div><h4>Contato</h4><span>{settings?.phone || '(47) 99942-3000'}</span><span>{settings?.email || 'contato@imecmetalurgica.com.br'}</span><span>{settings?.address || 'Joinville - SC, Brasil'}</span></div>
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
  const settings = data.settings || {};
  const home = data.pages?.home || {};
  const services = data.services?.length ? data.services : fallbackServices;
  const portfolio = data.portfolio?.length ? data.portfolio : fallbackPortfolio;
  return <>
    <section className="hero-ref" style={{ backgroundImage: `linear-gradient(90deg, rgba(3,10,18,.97), rgba(3,10,18,.66) 45%, rgba(3,10,18,.34) 68%, rgba(3,10,18,.88)), url(${assetUrl(settings.hero_image_url || home.image_url)})` }}>
      <div className="hero-copy"><span>IMEC Metalúrgica</span><h1>{home.title || 'Soluções Industriais com Engenharia, Tecnologia e Confiança'}</h1><p>{home.subtitle || 'Excelência em caldeiraria, soldagem, manutenção industrial, estruturas metálicas, NR-13, rigging e responsabilidade técnica.'}</p><div className="hero-actions"><a className="btn primary" href="/contato">Solicitar Orçamento <ChevronRight size={18} /></a><a className="btn outline" href="/servicos">Ver Serviços <ChevronRight size={18} /></a></div></div>
      <aside className="badges"><article><Award /><b>Qualidade</b><small>Padrões e processos de alta performance</small></article><article><ShieldCheck /><b>Segurança</b><small>Compromisso com a vida e o meio ambiente</small></article><article><Settings /><b>Responsabilidade Técnica</b><small>ART e documentação em conformidade</small></article></aside>
    </section>
    <section className="home-strip services-strip"><div className="strip-title"><span>Nossos Serviços</span><h2>Soluções completas para a indústria</h2><a href="/servicos">Ver todos <ChevronRight size={16} /></a></div><div className="service-row">{services.slice(0, 6).map((item) => <ServiceCard item={item} key={item.id} />)}</div></section>
    <section className="home-strip portfolio-strip"><div className="strip-title"><span>Portfólio</span><h2>Projetos que geram resultados</h2><a href="/portfolio">Ver portfólio completo <ChevronRight size={16} /></a></div><div className="portfolio-row">{portfolio.slice(0, 6).map((item) => <PortfolioCard item={item} key={item.id} />)}</div></section>
    <section className="quick-links"><a href="/videos"><PlayCircle /><b>Vídeos</b><small>Projetos, processos e bastidores das operações.</small></a><a href="/galeria"><ImagePlus /><b>Galeria</b><small>Fotos de obras, fabricação e montagem industrial.</small></a><a href="/contato"><UserCircle /><b>Orçamento</b><small>Fale com a equipe técnica da IMEC.</small></a></section>
  </>;
}

function About({ data }) {
  const about = data.pages?.['quem-somos'] || {};
  return <><PageTitle eyebrow="Quem Somos" title={about.title || 'Engenharia industrial com responsabilidade técnica'} text={about.subtitle || 'Atuação profissional para projetos, fabricação, montagem e manutenção industrial.'} /><section className="content-split"><h2>IMEC Metalúrgica</h2><p>{about.content || 'A IMEC entrega soluções sob medida para a indústria, unindo experiência técnica, processos seguros e compromisso com desempenho em cada etapa do projeto.'}</p><div className="pillars"><article><Award /><b>Qualidade</b><span>Processos técnicos e acabamento profissional.</span></article><article><ShieldCheck /><b>Segurança</b><span>Planejamento e responsabilidade operacional.</span></article><article><FileText /><b>Responsabilidade Técnica</b><span>Documentação, laudos e conformidade quando aplicável.</span></article></div></section></>;
}

function Services({ data }) {
  const services = data.services?.length ? data.services : fallbackServices;
  return <><PageTitle eyebrow="Serviços" title="Soluções completas para a indústria" text="Caldeiraria, soldagem, manutenção, estruturas metálicas, NR-13, rigging, montagem e tubulações industriais." /><section className="page-grid service-grid">{services.map((item) => <ServiceCard item={item} key={item.id} />)}</section></>;
}

function Portfolio({ data }) {
  const portfolio = data.portfolio?.length ? data.portfolio : fallbackPortfolio;
  return <><PageTitle eyebrow="Portfólio" title="Obras e entregas industriais" text="Projetos executados com planejamento, qualidade e responsabilidade técnica." /><section className="page-grid portfolio-grid">{portfolio.map((item) => <PortfolioCard item={item} key={item.id} />)}</section></>;
}

function Gallery({ data }) {
  const photos = data.photos?.length ? data.photos : fallbackServices;
  return <><PageTitle eyebrow="Galeria" title="Fotos de obras, processos e estrutura" text="Registros de fabricação, montagem, soldagem e operações industriais." /><section className="gallery-grid">{photos.map((photo) => <figure key={photo.id}><img src={assetUrl(photo.image_url)} alt={photo.alt_text || photo.title} /><figcaption>{photo.title}</figcaption></figure>)}</section></>;
}

function Videos({ data }) {
  const videos = data.videos?.length ? data.videos : [{ id: 'v1', title: 'Cadastre vídeos pelo painel', description: 'Links do YouTube aparecerão aqui.' }];
  return <><PageTitle eyebrow="Vídeos" title="Projetos e bastidores em vídeo" text="Conteúdos em vídeo dos projetos, processos e operações da IMEC." /><section className="video-grid">{videos.map((video) => <article className="video-card" key={video.id}>{video.youtube_id ? <iframe src={`https://www.youtube.com/embed/${video.youtube_id}`} title={video.title} allowFullScreen /> : <div><PlayCircle size={58} /></div>}<h3>{video.title}</h3><p>{video.description}</p></article>)}</section></>;
}

function Contact({ data }) {
  const settings = data.settings || {};
  const services = data.services?.length ? data.services : fallbackServices;
  const [sent, setSent] = useState('');
  const [quote, setQuote] = useState({ name: '', company: '', email: '', phone: '', service_interest: '', message: '' });
  async function submit(event) { event.preventDefault(); await api('/public/quotes', { method: 'POST', body: JSON.stringify(quote) }); setSent('Pedido enviado com sucesso.'); setQuote({ name: '', company: '', email: '', phone: '', service_interest: '', message: '' }); }
  return <section className="contact-page"><div><span>Solicitar Orçamento</span><h1>Conte sua demanda industrial para a IMEC</h1><p>Receba atendimento técnico para caldeiraria, soldagem, manutenção, estruturas metálicas, NR-13, rigging, montagem e tubulações.</p><p><Phone size={17} /> {settings.phone || '(47) 99942-3000'}</p><p><Mail size={17} /> {settings.email || 'contato@imecmetalurgica.com.br'}</p></div><form onSubmit={submit}>{['name', 'company', 'email', 'phone'].map((key) => <input key={key} placeholder={{ name: 'Nome', company: 'Empresa', email: 'E-mail', phone: 'Telefone / WhatsApp' }[key]} value={quote[key]} onChange={(e) => setQuote({ ...quote, [key]: e.target.value })} required={key !== 'company'} />)}<select value={quote.service_interest} onChange={(e) => setQuote({ ...quote, service_interest: e.target.value })}><option value="">Serviço de interesse</option>{services.map((item) => <option key={item.id}>{item.title}</option>)}</select><textarea placeholder="Descreva sua necessidade" value={quote.message} onChange={(e) => setQuote({ ...quote, message: e.target.value })} required /><button className="btn primary">Enviar Pedido</button>{sent && <p className="ok">{sent}</p>}</form></section>;
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
  return <><Header settings={data.settings} current={current} /><main>{page}</main><Footer settings={data.settings} /></>;
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
