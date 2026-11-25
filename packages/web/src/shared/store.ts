export const groups = ['Kraft e papel', 'Plásticas', 'TNT e ecobags'] as const;
export const statuses = ['novo', 'em atendimento', 'confirmado', 'em produção', 'enviado', 'concluído', 'cancelado'] as const;
export const brl = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
export const initialProducts = [
  { id: 'kraft', name: 'Sacola Kraft', group: groups[0], minQty: 100, text: 'Papel kraft com alça torcida, ideal para lojas e presentes.' },
  { id: 'delivery', name: 'Saco Kraft Delivery', group: groups[0], minQty: 100, text: 'Saco de papel kraft sem alça para pedidos e retiradas.' },
  { id: 'vazada', name: 'Sacola Alça Vazada', group: groups[1], minQty: 1, text: 'Modelo plástico com alça recortada, leve e prático para o varejo.' },
  { id: 'ecobag', name: 'Ecobag Personalizada', group: groups[2], minQty: 1, text: 'Sacola reutilizável para eventos, brindes e ações da sua marca.' },
  { id: 'camiseta', name: 'Sacola Alça Camiseta', group: groups[1], minQty: 1, text: 'Alças integradas para o dia a dia de lojas e comércios.' },
  { id: 'fita', name: 'Sacola Alça Fita', group: groups[0], minQty: 1, text: 'Acabamento com alça de fita para presentes e lojas.' },
  { id: 'tnt', name: 'Sacola de TNT', group: groups[2], minQty: 1, text: 'Opção leve para eventos, kits e ações promocionais.' },
  { id: 'papel', name: 'Sacola de Papel', group: groups[0], minQty: 1, text: 'Modelo de papel para boutiques, presentes e embalagens personalizadas.' },
].map((p, position) => ({ ...p, position, active: true, price: null, image: `/images/${p.id}.webp` }));
export type OrderLine = { id: string; name: string; qty: number; price: number | null };
