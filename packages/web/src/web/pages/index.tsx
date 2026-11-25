import { BusinessInfo } from '../components/business-info';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { brl } from '../../shared/store';
import { catalogQuery } from '../queries/store';
import { readCart, saveCart } from '../lib/cart';
import { ArrowDown, ArrowRight, ArrowUpRight, Box, ChevronRight, Instagram, MapPin, Menu, Package, PenTool, ShoppingBag, Truck, X } from 'lucide-react';

const instagram = 'https://www.instagram.com/bispo_embalagens/';
const filters = ['Todos', 'Kraft e papel', 'Plásticas', 'TNT e ecobags'];
const benefits = [
  { icon: Truck, title: 'Envio para todo o Brasil', text: 'Do Rio de Janeiro até você' },
  { icon: Package, title: 'Atacado e varejo', text: 'Condições para lojistas e revendedores' },
  { icon: PenTool, title: 'Personalização', text: 'Sacolas com a identidade da sua marca' },
];
const services = [
  { icon: PenTool, title: 'Personalização para marcas', text: 'Escolha o modelo de sacola e conte como quer aplicar sua identidade visual. Consulte as opções de impressão para cada material.' },
  { icon: Box, title: 'Kraft para delivery', text: 'Sacolas e sacos kraft para restaurantes, lanchonetes e delivery. A partir de R$ 0,50 a unidade, com pedidos a partir de 100 unidades.' },
  { icon: ShoppingBag, title: 'Atacado e varejo', text: 'Consulte as condições para comprar para sua loja ou revender. Informe a quantidade para receber um orçamento.' },
];

function Brand() {
  return <a className="brand" href="#inicio" aria-label="Bispo Embalagens — início"><img src="/images/brand.svg" alt="" width="43" height="43"/><span><strong>Bispo</strong><small>EMBALAGENS</small></span></a>;
}

export default function Index() {
  const [filter, setFilter] = useState(filters[0]);
  const [menu, setMenu] = useState(false);
  const [cart, setCart] = useState(readCart);
  const [lastAdded, setLastAdded] = useState('');
  const {data,isLoading,isError,refetch}=useQuery(catalogQuery);
  const shown=(data?.items??[]).filter(p => filter === filters[0] || p.group === filter);
  const count=Object.keys(cart).length;
  function addItem(id:string,minQty:number,name:string){
    if(!cart[id] && count>=30){setLastAdded('O carrinho comporta até 30 modelos.');return;}
    const updated={...cart,[id]: Math.min(100000, (cart[id]??0)+minQty)};
    saveCart(updated);setCart(updated);setLastAdded(`${name} adicionada ao carrinho.`);
  }
  return <div id="inicio" className="site">
    <a href="#conteudo" className="skip-link">Ir para o conteúdo</a>
    <div className="topbar"><div className="shell top-inner"><span><Truck size={15} aria-hidden="true"/> Envios para todo o Brasil</span><a href={instagram} target="_blank" rel="noreferrer"><Instagram size={14} aria-hidden="true"/> @bispo_embalagens</a></div></div>
    <header className="site-header">
      <div className="shell nav">
        <Brand/>
        <button type="button" className="menu-toggle" aria-label={menu ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menu} aria-controls="site-nav" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
        <nav id="site-nav" className={menu ? 'navlinks open' : 'navlinks'} aria-label="Menu principal">
          <a className="home-link" href="#inicio" onClick={() => setMenu(false)}>Início</a><a href="#catalogo" onClick={() => setMenu(false)}>Catálogo</a><a href="#servicos" onClick={() => setMenu(false)}>Serviços</a><a href="#empresa" onClick={() => setMenu(false)}>A empresa</a><a href="#contato" onClick={() => setMenu(false)}>Contato</a>
        </nav>
        <Link className="button button-plum nav-quote" href="/pedido"><ShoppingBag size={17}/> Carrinho{count>0?` (${count})`:""}</Link>
      </div>
    </header>
    <main id="conteudo" tabIndex={-1}>
      <section className="hero" aria-labelledby="hero-title">
        <picture><img className="hero-image" src={data?.cover ?? "/images/hero.webp"} alt="" fetchPriority="high"/></picture>
        <div className="shell hero-inner">
          <div className="hero-copy">
            <p className="hero-label">ATACADO E VAREJO</p>
            <h1 id="hero-title">Sacolas personalizadas<br/> <em>e embalagens kraft.</em></h1>
            <p className="hero-intro">Para lojas, revendedores, restaurantes e delivery. Enviamos do Rio de Janeiro para todo o Brasil.</p>
            <div className="hero-actions"><a className="button button-orange" href="#catalogo">Ver catálogo <ArrowDown size={17}/></a><Link className="button button-ghost" href="/pedido">Ver carrinho <ArrowUpRight size={17}/></Link></div>
          </div>
        </div>
      </section>
      <section className="benefits" aria-label="Diferenciais"><div className="shell benefits-grid">
        {benefits.map(({icon: Icon, title, text}) => <div className="benefit" key={title}><span className="icon-tile"><Icon size={23} strokeWidth={1.65}/></span><div><strong>{title}</strong><small>{text}</small></div></div>)}
      </div></section>
      <section id="catalogo" className="catalog section-space">
        <div className="shell">
          <div className="catalog-head"><div><h2>Catálogo de embalagens</h2><p className="section-intro">Escolha os modelos e monte seu pedido.</p></div>
          <div className="filters" aria-label="Filtrar catálogo">{filters.map(f => <button type="button" key={f} aria-pressed={f === filter} onClick={() => setFilter(f)}>{f}</button>)}</div></div>
          <div className="kraft-offer"><Package size={24} strokeWidth={1.7}/><div><strong>Linha kraft a partir de R$ 0,50 por unidade</strong><span>Pedidos a partir de 100 unidades. Consulte o preço do modelo escolhido.</span></div><button type="button" onClick={() => setFilter("Kraft e papel")}>Ver kraft e papel <ArrowRight size={16}/></button></div>
          {isLoading&&<p role="status">Carregando catálogo…</p>}{isError&&<p role="alert">Não foi possível carregar o catálogo. <button onClick={()=>void refetch()}>Tentar novamente</button></p>}{data&&!shown.length&&<p>Nenhum produto nesta categoria.</p>}
          <div className="product-grid">
            {shown.map(p => <article className="product" key={p.id}><div className="product-photo"><img src={p.image} alt={p.name} loading="lazy" width="512" height="384"/></div><div className="product-body"><p className="product-type">{p.group}</p><h3>{p.name}</h3><p className="product-text">{p.text}</p><p className="store-price">{p.price===null?'Preço sob consulta':`${brl(p.price)} / un.`}{p.minQty>1&&<small>Mínimo: {p.minQty} un.</small>}</p><button type="button" className="product-link" onClick={()=>addItem(p.id,p.minQty,p.name)} aria-label={`Adicionar ${p.name}`}><span>{cart[p.id]?'Adicionar mais':'Adicionar ao carrinho'}</span><ShoppingBag size={16}/></button></div></article>)}
          </div>
          <div className="cart-feedback" role="status">{lastAdded && <><span>{lastAdded}</span> <Link href="/pedido">Ver carrinho <ArrowRight size={15}/></Link></>}</div>
          <p className="catalog-note">Imagens ilustrativas. Consulte tamanhos, cores e opções de personalização.</p>
        </div>
      </section>
      <section id="servicos" className="services section-space"><div className="shell"><h2>Nossos serviços</h2><div className="service-grid">{services.map(({icon: Icon, title, text}) => <article key={title}><Icon size={25} strokeWidth={1.65}/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>
      <BusinessInfo instagram={instagram}/>
    </main>
    <footer id="contato" className="footer"><div className="shell"><div className="footer-main"><div><Brand/><p>Sacolas e embalagens personalizadas.<br/> Do Rio de Janeiro para todo o Brasil.</p></div><div><h3>Navegação</h3><a href="#catalogo">Catálogo <ChevronRight size={14}/></a><a href="#servicos">Serviços <ChevronRight size={14}/></a><Link href="/pedido">Meu carrinho <ChevronRight size={14}/></Link><a href="#como-comprar">Como comprar <ChevronRight size={14}/></a><a href="#duvidas">Perguntas frequentes <ChevronRight size={14}/></a></div><div><h3>Contato</h3><a href={instagram} target="_blank" rel="noreferrer"><Instagram size={17}/> @bispo_embalagens <ArrowUpRight size={14}/></a><p className="address"><MapPin size={17}/> <span>Alvarenga Peixoto, 469<br/>Rio de Janeiro – RJ, 21240-698</span></p></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Bispo Embalagens</span><a href="#inicio">Voltar ao topo ↑</a></div></div></footer>
  </div>;
}
