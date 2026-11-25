import { ArrowRight, ArrowUpRight, ChevronDown, Instagram, MapPin } from 'lucide-react';

const maps = 'https://www.google.com/maps/search/?api=1&query=Alvarenga+Peixoto+469%2C+Rio+de+Janeiro%2C+RJ%2C+21240-698';
const questions = [
  ['Qual é o pedido mínimo?', 'A linha kraft tem pedido mínimo de 100 unidades. Nos outros modelos, confira o mínimo indicado no catálogo.'],
  ['Quais produtos custam a partir de R$ 0,50?', 'Esse valor inicial é da linha kraft. Confira o preço de cada modelo no catálogo ou aguarde a cotação dos itens sob consulta.'],
  ['Posso personalizar com minha marca?', 'Sim. Descreva nas observações o que quer imprimir. Se já tiver a arte, mencione isso no pedido.'],
  ['Vocês vendem para revendedores?', 'Sim. Vendemos no atacado e no varejo. Informe que a compra é para revenda e indique a quantidade.'],
  ['Como consulto frete e prazo?', 'Preencha o CEP no pedido. A Bispo confirma o frete e o prazo no atendimento. Enviamos para todo o Brasil.'],
  ['Preciso pagar ao enviar o pedido?', 'Não. O pedido é registrado no site, sem cobrança. A Bispo entra em contato para combinar o pagamento.'],
];
const steps = [
  ['Monte seu carrinho', 'Escolha os modelos e ajuste as quantidades.'],
  ['Preencha os dados de entrega', 'Informe seu CEP e, se quiser personalizar, descreva o que precisa.'],
  ['Envie o pedido', 'Guarde o protocolo. A Bispo confirma frete, prazo e pagamento com você.'],
];

export function BusinessInfo({ instagram }: { instagram: string }) {
  return <>
    <section id="empresa" className="bispo-about" aria-labelledby="about-title">
      <div className="shell bispo-about-grid">
        <div>
          <h2 id="about-title">Sobre a Bispo Embalagens</h2>
          <p>Somos do Rio de Janeiro e atendemos lojistas, revendedores e restaurantes em todo o Brasil. Trabalhamos com sacolas personalizadas, ecobags, TNT e kraft para delivery, no atacado e no varejo.</p>
        </div>
        <div className="bispo-location">
          <span className="bispo-pin"><MapPin size={21} aria-hidden="true"/></span>
          <div>
            <h3>Onde estamos</h3>
            <address>Alvarenga Peixoto, 469<br/>Rio de Janeiro – RJ · CEP 21240-698</address>
            <a href={maps} target="_blank" rel="noreferrer">Ver no Google Maps <ArrowUpRight size={15}/></a>
          </div>
        </div>
      </div>
    </section>
    <div className="bispo-help section-space"><div className="shell bispo-help-grid">
      <section id="como-comprar" className="bispo-steps" aria-labelledby="steps-title">
        <h2 id="steps-title">Como comprar</h2>
        <ol>{steps.map(([title, text], i) => <li key={title}><span aria-hidden="true">{String(i+1).padStart(2,'0')}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
        <a className="button button-plum" href="#catalogo">Ver catálogo <ArrowRight size={16}/></a>
      </section>
      <section id="duvidas" className="bispo-questions" aria-labelledby="faq-title">
        <h2 id="faq-title">Perguntas frequentes</h2>
        <div className="bispo-accordion">{questions.map(([q, a]) => <details name="bispo-faq" key={q}><summary>{q}<ChevronDown size={17} aria-hidden="true"/></summary><p>{a}</p></details>)}</div>
        <a className="bispo-help-contact" href={instagram} target="_blank" rel="noreferrer"><Instagram size={16} aria-hidden="true"/> Fale com a Bispo no Instagram <ArrowUpRight size={15}/></a>
      </section>
    </div></div>
  </>;
}
