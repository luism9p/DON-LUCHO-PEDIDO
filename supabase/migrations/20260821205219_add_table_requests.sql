create table public.table_requests (
  id uuid primary key default gen_random_uuid(),
  table_id integer not null references public.tables(id),
  tipo text not null check (tipo in ('mesero', 'cuenta')),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'atendido')),
  created_at timestamptz not null default now()
);

create index idx_table_requests_table_id on public.table_requests(table_id);

alter table public.table_requests enable row level security;

create policy "table_requests_public_insert" on public.table_requests
  for insert to anon, authenticated with check (true);

create policy "table_requests_authenticated_select" on public.table_requests
  for select to authenticated using (true);

create policy "table_requests_authenticated_update" on public.table_requests
  for update to authenticated using (true) with check (true);

alter publication supabase_realtime add table public.table_requests;
