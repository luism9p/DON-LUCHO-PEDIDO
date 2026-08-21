-- Estado de pedido como enum controlado
create type order_status as enum ('nuevo', 'preparando', 'listo', 'entregado');

-- Mesas físicas del restaurante
create table public.tables (
  id serial primary key,
  numero integer not null unique,
  activa boolean not null default true
);

-- Ítems del menú
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  precio numeric(10,2) not null check (precio >= 0),
  categoria text not null,
  imagen_url text,
  disponible boolean not null default true,
  created_at timestamptz not null default now()
);

-- Pedidos (uno por mesa/ronda)
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  table_id integer not null references public.tables(id),
  estado order_status not null default 'nuevo',
  total numeric(10,2) not null default 0 check (total >= 0),
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ítems dentro de cada pedido
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id),
  cantidad integer not null check (cantidad > 0),
  nota text
);

create index idx_orders_table_id on public.orders(table_id);
create index idx_orders_estado on public.orders(estado);
create index idx_order_items_order_id on public.order_items(order_id);

-- Mantener updated_at al día en orders
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();
