-- Permite crear pedidos tanto a clientes anónimos como a un admin logueado
-- probando el flujo en el mismo navegador (antes solo se permitía a anon).
drop policy "orders_public_insert" on public.orders;
create policy "orders_public_insert" on public.orders
  for insert to anon, authenticated with check (true);

drop policy "order_items_public_insert" on public.order_items;
create policy "order_items_public_insert" on public.order_items
  for insert to anon, authenticated with check (true);
