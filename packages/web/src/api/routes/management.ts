import { PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ORPCError } from '@orpc/server';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { admin } from '../middleware/admin';
import { db } from '../database';
import { companies, orders, products, storeSettings } from '../database/schema';
import { imageUrl, storage } from '../lib/s3';
import { groups, statuses } from '../../shared/store';

const imgKey = z.string().regex(/^catalog\/[a-f0-9-]{36}\.(jpg|png|webp)$/);
const fileTypes = { 'image/jpeg':'jpg','image/png':'png','image/webp':'webp' };
async function verifiedImage(key:string) {
  const {s3,bucket} = storage();
  const head = await s3.send(new HeadObjectCommand({Bucket:bucket,Key:key})).catch(()=>null);
  if (!head?.ContentLength || head.ContentLength>5*1024*1024 || !head.ContentType || !(head.ContentType in fileTypes)) throw new ORPCError('BAD_REQUEST',{message:'Imagem não encontrada ou fora do limite de 5 MB.'});
  return imageUrl(key);
}
export const management = {
  orders:admin.handler(()=>db.select().from(orders).orderBy(desc(orders.createdAt)).limit(300)),
  setStatus:admin.input(z.object({id:z.uuid(),status:z.enum(statuses)})).handler(async ({input})=>{
    const [row]=await db.update(orders).set({status:input.status}).where(eq(orders.id,input.id)).returning({id:orders.id});
    if(!row) throw new ORPCError('NOT_FOUND'); return row;
  }),
  companies:admin.handler(()=>db.select().from(companies).orderBy(companies.name).limit(1000)),
  saveCompany:admin.input(z.object({id:z.uuid().optional(),name:z.string().trim().min(2).max(140),document:z.string().trim().max(25),contact:z.string().trim().max(100),phone:z.string().trim().max(30),email:z.union([z.email().max(160),z.literal('')]),notes:z.string().trim().max(1000)})).handler(async({input})=>{
    const {id,name,document,contact,phone,email,notes}=input;
    const values={name,document,contact,phone,email,notes};
    if(id){ const [row]=await db.update(companies).set(values).where(eq(companies.id,id)).returning({id:companies.id}); if(!row) throw new ORPCError('NOT_FOUND'); return row; }
    const created=crypto.randomUUID(); await db.insert(companies).values({id:created,...values}); return {id:created};
  }),
  products:admin.handler(()=>db.select().from(products).orderBy(products.position)),
  saveProduct:admin.input(z.object({id:z.string().regex(/^[a-z0-9-]{1,80}$/).optional(),name:z.string().trim().min(2).max(110),group:z.enum(groups),text:z.string().trim().max(350),price:z.number().int().min(1).max(10000000).nullable(),minQty:z.number().int().min(1).max(100000),active:z.boolean(),imageKey:imgKey.optional()})).handler(async({input})=>{
    const {id,name,group,text,price,minQty,active,imageKey}=input;
    const values={name,group,text,price,minQty,active};
    const image=imageKey?await verifiedImage(imageKey):undefined;
    if(id){const [row]=await db.update(products).set({...values,...(image?{image}:{})}).where(eq(products.id,id)).returning({id:products.id});if(!row) throw new ORPCError('NOT_FOUND');return row;}
    if(!image) throw new ORPCError('BAD_REQUEST',{message:'Adicione uma foto ao produto.'});
    const newId=crypto.randomUUID();await db.insert(products).values({id:newId,...values,image,position:1000}); return {id:newId};
  }),
  setCover:admin.input(z.object({imageKey:imgKey.nullable()})).handler(async({input})=>{
    const cover=input.imageKey?await verifiedImage(input.imageKey):'/images/hero.webp';
    await db.insert(storeSettings).values({id:'main',cover}).onConflictDoUpdate({target:storeSettings.id,set:{cover}});return {cover};
  }),
  upload:admin.input(z.object({type:z.enum(['image/jpeg','image/png','image/webp']),size:z.number().int().min(1).max(5*1024*1024)})).handler(async({input})=>{
    const {s3,bucket}=storage();const key=`catalog/${crypto.randomUUID()}.${fileTypes[input.type]}`;
    const url=await getSignedUrl(s3,new PutObjectCommand({Bucket:bucket,Key:key,ContentType:input.type,ACL:'public-read'}),{expiresIn:300,signableHeaders:new Set(['x-amz-acl','content-type'])});return {key,url};
  }),
};
