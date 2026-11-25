- Visual plan approved: website only, public catalog, services, quote, no checkout.
- Static product data; images illustrative. General minimum/pricing only claimed for Kraft per supplied copy.
- No WhatsApp number or e-mail supplied; use known Instagram profile, with quote details copied on request.
- Verify desktop/mobile and front-end flows, run build, deliver website.

- Build succeeded. Browser checks passed for responsive layouts, filters, product selection, quote validation and copy, and mobile navigation.

## Revisão da vitrine
- Remover RunableBadge do layout, manter feedback/analytics.
- Melhorar texto, catálogo e condições kraft; incluir empresa, mapa, orientações de compra e perguntas frequentes.
- Usar apenas o contato confirmado e explicar envio manual do orçamento.

## Pedidos e painel (aprovado)
- Rotas /pedido, /admin. Catálogo público, gravação pública de pedido validado; listagem e edição somente administrador.
- Drizzle: produtos, configurações da loja, pedidos, empresas e tabelas Better Auth.
- Cadastrar admin solicitado via script privado e senha segura já coletada. Subir imagens em Tigris.
- Validar pedido, persistência, login e proteção, alterações e uploads; entregar link /admin.
- Confirmado no preview: checkout com protocolo, login por senha, pedido no painel, atualização de status, cadastro de empresa, preço e upload, alteração e restauração de capa, logout. Registros de teste removidos; senha inicial removida do env após provisionamento.
- OAuth Google opcional não testado; login por senha validado. Todas as rotas administrativas testadas sem sessão retornam 401.
