export type Cart = Record<string,number>;
const key='bispo-cart-v1';
export function readCart():Cart {
  try {
    const value:unknown=JSON.parse(localStorage.getItem(key)??'{}');
    if (!value || typeof value!=='object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([id,qty])=>/^[a-z0-9-]{1,80}$/.test(id)&&Number.isInteger(qty)&&qty>=1&&qty<=100000).slice(0,30));
  } catch { return {}; }
}
export function saveCart(cart:Cart) { localStorage.setItem(key,JSON.stringify(cart)); }
