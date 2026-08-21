insert into public.tables (numero, activa)
select numero, true
from generate_series(1, 12) as numero
on conflict (numero) do nothing;
