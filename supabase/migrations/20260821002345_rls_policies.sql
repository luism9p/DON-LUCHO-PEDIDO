alter table public.tables enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- tables: lectura pública (cliente valida que la mesa exista/esté activa), escritura solo admin
create policy "tables_public_select" on public.tables
  for select to anon, authenticated using (true);

create policy "tables_authenticated_write" on public.tables
  for all to authenticated using (true) with check (true);

-- menu_items: lectura pública, escritura solo admin
create policy "menu_items_public_select" on public.menu_items
  for select to anon, authenticated using (true);

create policy "menu_items_authenticated_write" on public.menu_items
  for all to authenticated using (true) with check (true);

-- orders: cliente crea y lee (para seguir el estado en vivo), solo admin actualiza/borra
create policy "orders_public_insert" on public.orders
  for insert to anon with check (true);

create policy "orders_public_select" on public.orders
  for select to anon, authenticated using (true);

create policy "orders_authenticated_update" on public.orders
  for update to authenticated using (true) with check (true);

create policy "orders_authenticated_delete" on public.orders
  for delete to authenticated using (true);

-- order_items: cliente crea y lee, admin control total
create policy "order_items_public_insert" on public.order_items
  for insert to anon with check (true);

create policy "order_items_public_select" on public.order_items
  for select to anon, authenticated using (true);

create policy "order_items_authenticated_all" on public.order_items
  for all to authenticated using (true) with check (true);
