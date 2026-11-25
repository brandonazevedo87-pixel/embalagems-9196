import { useState, type FormEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'wouter';
import { brl } from '../../shared/store';
import { readCart, saveCart } from '../lib/cart';
import { catalogQuery, placeOrder } from '../queries/store';

export default function Checkout(){
  const {data,isLoading,isError,refetch}=useQuery(catalogQuery);
  const submit=useMutation(placeOrder);
  const [cart,setCart]=useState(readCart);
  const [requestId,setRequestId]=useState(()=>crypto.randomUUID());
  const [protocol,setProtocol]=useState('');
  const rows=Object.entries(cart).map(([id,qty])=>({id,qty,model:data?.items.find(p=>p.id===id)}));
  const invalid=rows.some(r=>!r.model || !Number.isInteger(r.qty) || r.qty<r.model.minQty || r.qty>100000);
  const subtotal=rows.reduce((sum,r)=>sum+(r.model?.price??0)*r.qty,0);
  const unknown=rows.some(r=>r.model?.price==null);
  function update(id:string,qty:number|null){
    const next={...cart}; if(qty===null)delete next[id];else next[id]=qty;
    setCart(next);saveCart(next);setRequestId(crypto.randomUUID());
  }
  function send(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); if(invalid || !rows.length || submit.isPending)return;
    const f=new FormData(e.currentTarget);const t=(k:string)=>String(f.get(k)??'').trim();
    submit.mutate({requestId,items:rows.map(({id,qty})=>({id,qty})),name:t('name'),company:t('company'),document:t('document'),email:t('email'),phone:t('phone'),zip:t('zip'),address:t('address'),notes:t('notes')},{onSuccess:({id})=>{setProtocol(id);saveCart({});setCart({});window.scrollTo(0,0);}});
  }
  return <div className="commerce"><header className="commerce-header"><div className="shell"><Link href="/" className="brand"><img src="/images/brand.svg" alt="" width="43" height="43"/><span><strong>Bispo</strong><small>EMBALAGENS</small></span></Link><a href="/#catalogo" className="back-link"><ArrowLeft size={16}/> Voltar ao catálogo</a></div></header><main className="shell section-space">
    {protocol ? <section className="commerce-panel order-success"><CheckCircle2 size={42}/><h1>Pedido recebido</h1><p>A Bispo vai usar o seu contato para confirmar disponibilidade, frete, prazo e pagamento. Nenhuma cobrança foi feita.</p><p>Seu protocolo: <strong>{protocol.slice(0,13).toUpperCase()}</strong></p><a className="button button-plum" href="/#catalogo">Voltar ao catálogo</a></section> : <>
    <h1>Seu pedido</h1><p className="commerce-lead">Confira os itens e informe seus dados para receber a confirmação da Bispo.</p>
    {isLoading?<p role="status">Carregando carrinho…</p>:isError?<p role="alert">Não foi possível consultar o catálogo. <button onClick={()=>void refetch()}>Tentar novamente</button></p>:!rows.length?<section className="commerce-panel order-success"><ShoppingBag size={34}/><h2>Seu carrinho está vazio</h2><p>Escolha um modelo no catálogo para começar.</p><a href="/#catalogo" className="button button-plum">Ver catálogo</a></section>:
    <div className="checkout-grid"><section className="commerce-panel cart-panel"><h2>Itens do pedido</h2>{rows.map(({id,qty,model})=><div className="cart-line" key={id}>{model&&<img src={model.image} alt=""/>}<div><strong>{model?.name??'Produto indisponível'}</strong><small>{model ? model.price===null?'Preço sob consulta':`${brl(model.price)} / un.`:'Remova este item para continuar.'}</small>{model&&<label className="qty-label">Quantidade<input aria-label={`Quantidade de ${model.name}`} type="number" value={qty||''} min={model.minQty} max={100000} onChange={e=>update(id,Number(e.target.value))}/></label>}{model&&qty<model.minQty&&<small className="error-text">Mínimo de {model.minQty} un.</small>}</div><button type="button" className="icon-button" aria-label={`Remover ${model?.name??'produto'}`} onClick={()=>update(id,null)}><Trash2 size={17}/></button></div>)}<div className="cart-total"><strong>{unknown?'Subtotal dos itens com preço':'Subtotal dos produtos'}</strong><strong>{unknown&&subtotal===0?'A confirmar':brl(subtotal)}</strong></div><p>Frete, prazo, itens sob consulta e pagamento serão confirmados no atendimento.</p></section>
    <form className="commerce-panel form-card checkout-form" onSubmit={send}><h2>Dados para entrega</h2><div className="form-row"><label>Seu nome<input name="name" autoComplete="name" minLength={2} maxLength={100} required/></label><label>Empresa (opcional)<input name="company" autoComplete="organization" maxLength={140}/></label></div><div className="form-row"><label>Telefone / WhatsApp<input name="phone" type="tel" autoComplete="tel" maxLength={25} required/></label><label>E-mail<input name="email" type="email" autoComplete="email" maxLength={160} required/></label></div><div className="form-row"><label>CEP<input name="zip" autoComplete="postal-code" pattern="[0-9]{5}-?[0-9]{3}" inputMode="numeric" maxLength={9} required/></label><label>CNPJ (opcional)<input name="document" maxLength={25}/></label></div><label>Endereço completo<input name="address" autoComplete="street-address" placeholder="Rua, número, bairro, cidade, UF" minLength={8} maxLength={280} required/></label><label>Observações (opcional)<textarea name="notes" maxLength={1000} rows={3} placeholder="Tamanho, cor, personalização ou complemento"/></label><p className="checkout-note">A Bispo usa esses dados para atender e confirmar seu pedido. Você não paga nesta etapa.</p><button className="button button-plum" type="submit" disabled={invalid||submit.isPending}>{submit.isPending?'Enviando pedido…':'Finalizar pedido'}</button>{submit.isError&&<p role="alert" className="error-text">{submit.error.code==='BAD_REQUEST'?submit.error.message:'Não foi possível enviar o pedido. Tente novamente.'}</p>}</form></div>}
    </>}
  </main></div>;
}
