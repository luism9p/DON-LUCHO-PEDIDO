# Don Lucho · Pedidos por mesa

Sistema de pedidos por mesa (React + Vite + Supabase). Cada mesa tiene un NFC que
apunta a `/mesa/:numero`; el mesero atiende todo desde `/admin`.

## Setup

```bash
npm install
cp .env.example .env.local   # ya viene precargado con el proyecto lsqlhqslgncxradmxtws
npm run dev
```

## Crear el usuario admin

Este proyecto no tiene registro público. Crea el primer usuario del panel desde
el dashboard de Supabase: **Authentication → Users → Add user** (con email +
password), en https://supabase.com/dashboard/project/lsqlhqslgncxradmxtws/auth/users

## Estructura

```
src/
  lib/            cliente de Supabase
  context/        CartContext (carrito) y AuthContext (sesión admin)
  hooks/          data fetching + suscripciones realtime
  components/
    menu/         tarjetas y tabs del menú (cliente)
    cart/         carrito deslizable (cliente)
    admin/        tarjetas de mesa, detalle de pedido, badges de estado
    common/       spinner, ProtectedRoute
  pages/
    mesa/         MesaPage (menú + carrito) y OrderTrackingView (seguimiento en vivo)
    admin/        AdminLoginPage y AdminDashboardPage
supabase/
  migrations/     SQL versionado (schema, RLS, realtime, seeds)
```

## Base de datos

Las migraciones viven en `supabase/migrations/` y ya están aplicadas al
proyecto de Supabase `don-lucho`. El menú actual es un seed de ejemplo
(`seed_menu_placeholder.sql`) — reemplázalo por los platos reales de Don Lucho
insertando/editando filas en `menu_items` desde el SQL Editor o el Table Editor
de Supabase.
