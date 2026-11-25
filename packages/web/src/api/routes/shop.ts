import { ORPCError } from '@orpc/server';
import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { base } from '../__core/app';
import { db } from '../database';
import { orders, products, storeSettings } from '../database/schema';

const id = z.string().regex(/^[a-z0-9-]{1,80}$/);
const publicProduct = { id: products.id, name: products.name, group: products.group, text: products.text, image: products.image, price: products.price, minQty: products.minQty };
export const shop = {
  catalog: base.handler(async () => {
    const [items, [settings]] = await Promise.all([
      db.select(publicProduct).from(products).where(eq(products.active,true)).orderBy(products.position),
      db.select({cover:storeSettings.cover}).from(storeSettings).where(eq(storeSettings.id,'main')),
    ]);
    return { items, cover: settings?.cover ?? '/images/hero.webp' };
  }),
  place: base.input(z.object({
    requestId: z.uuid(), name: z.string().trim().min(2).max(100), company: z.string().trim().max(140), document: z.string().trim().max(25),
    email: z.email().max(160), phone: z.string().trim().max(25).refine(s => [10,11,12,13].includes(s.replace(/\D/g,'').length)),
    zip: z.string().regex(/^\d{5}-?\d{3}$/), address: z.string().trim().min(8).max(280), notes: z.string().trim().max(1000),
    items: z.array(z.object({ id, qty: z.number().int().min(1).max(100000) })).min(1).max(30),
  })).handler(async ({ input }) => {
    const ids = input.items.map(i => i.id);
    if (new Set(ids).size !== ids.length) throw new ORPCError('BAD_REQUEST', {message:'Itens repetidos no pedido.'});
    const current = await db.select(publicProduct).from(products).where(and(eq(products.active,true),inArray(products.id,ids)));
    const lines = input.items.map(i => {
      const p = current.find(p => p.id===i.id);
      if (!p) throw new ORPCError('BAD_REQUEST', {message:'Um produto do carrinho não está mais disponível.'});
      if (i.qty < p.minQty) throw new ORPCError('BAD_REQUEST', {message:`O mínimo para ${p.name} é ${p.minQty} unidades.`});
      return { id: p.id, name: p.name, qty: i.qty, price: p.price };
    });
    const subtotal = lines.reduce((sum,i)=>sum+i.qty*(i.price??0),0);
    await db.insert(orders).values({ id:input.requestId, createdAt:new Date(), status:'novo', name:input.name, company:input.company, document:input.document, email:input.email, phone:input.phone, zip:input.zip, address:input.address, notes:input.notes, items:lines, subtotal }).onConflictDoNothing();
    return { id: input.requestId };
  }),
};
