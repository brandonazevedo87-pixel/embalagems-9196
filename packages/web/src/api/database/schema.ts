import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { groups, statuses, type OrderLine } from '../../shared/store';

export const products = sqliteTable('products', {
  id: text().primaryKey(), name: text().notNull(), group: text({ enum: groups }).notNull(), text: text().notNull(), image: text().notNull(),
  price: integer(), minQty: integer().notNull().default(1), position: integer().notNull().default(0), active: integer({mode:'boolean'}).notNull().default(true),
});
export const storeSettings = sqliteTable('store_settings', { id: text().primaryKey(), cover: text().notNull() });
export const companies = sqliteTable('companies', {
  id: text().primaryKey(), name: text().notNull(), document: text().notNull().default(''), contact: text().notNull().default(''), phone: text().notNull().default(''), email: text().notNull().default(''), notes: text().notNull().default(''),
});
export const orders = sqliteTable('orders', {
  id: text().primaryKey(), createdAt: integer({mode:'timestamp_ms'}).notNull(), status: text({enum:statuses}).notNull(),
  name: text().notNull(), company: text().notNull(), document: text().notNull(), phone: text().notNull(), email: text().notNull(), zip: text().notNull(), address: text().notNull(), notes: text().notNull(),
  items: text({mode:'json'}).$type<OrderLine[]>().notNull(), subtotal: integer().notNull(),
});

export * from "./auth-schema";
