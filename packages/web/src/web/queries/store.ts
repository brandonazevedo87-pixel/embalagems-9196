import { orpc } from '../lib/api';
export const catalogQuery = orpc.shop.catalog.queryOptions({staleTime:15000});
export const placeOrder = orpc.shop.place.mutationOptions();
export const adminOrders = orpc.management.orders.queryOptions({retry:false});
export const adminCompanies = orpc.management.companies.queryOptions({retry:false});
export const adminProducts = orpc.management.products.queryOptions({retry:false});
