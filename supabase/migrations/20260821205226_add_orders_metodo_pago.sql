alter table public.orders
  add column metodo_pago text check (metodo_pago in ('efectivo', 'yape', 'plin', 'tarjeta'));
