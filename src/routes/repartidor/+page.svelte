<script>
  import { sesion } from '$lib/stores/sesion.js';
  import { PEDIDOS_REPARTIDOR_DEMO } from '$lib/mock/pedidos.js';
  import { usd } from '$lib/formato.js';
  import EstadoBadge from '$lib/componentes/EstadoBadge.svelte';

  // Copia local reactiva del mock
  let pedidos = $state([...PEDIDOS_REPARTIDOR_DEMO]);

  // Filtro activo: "activos" | "historial"
  let vista = $state('activos');

  // Pedidos activos = no entregados y no cancelados
  let pedidosActivos = $derived(
    pedidos.filter(p => p.estado !== 'entregado' && p.estado !== 'cancelado')
  );

  let pedidosHistorial = $derived(
    pedidos.filter(p => p.estado === 'entregado' || p.estado === 'cancelado')
  );

  let listaMostrada = $derived(vista === 'activos' ? pedidosActivos : pedidosHistorial);

  // Cambiar estado de un pedido (mock local)
  function cambiarEstado(id, nuevoEstado) {
    pedidos = pedidos.map(p =>
      p.id_pedido === id ? { ...p, estado: nuevoEstado } : p
    );
  }

  // Acciones según estado actual
  function accionPrincipal(p) {
    if (p.estado === 'listo_para_retirar') {
      cambiarEstado(p.id_pedido, 'en_camino');
    } else if (p.estado === 'en_camino') {
      cambiarEstado(p.id_pedido, 'entregado');
    }
  }

  function textoAccion(p) {
    if (p.estado === 'listo_para_retirar') return 'Iniciar viaje';
    if (p.estado === 'en_camino') return 'Marcar entregado';
    return 'Ver detalle';
  }

  function iconoAccion(p) {
    if (p.estado === 'listo_para_retirar') return 'two_wheeler';
    if (p.estado === 'en_camino') return 'check_circle';
    return 'visibility';
  }

  function aceptarPedido(id) {
    cambiarEstado(id, 'listo_para_retirar');
  }

  function rechazarPedido(id) {
    pedidos = pedidos.filter(p => p.id_pedido !== id);
  }
</script>

<div class="min-h-screen bg-surface">
  <main class="max-w-[1200px] mx-auto px-4 py-6 flex flex-col gap-6">

    <!-- ENCABEZADO -->
    <section class="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-on-surface">
          Hola, {$sesion.nombre || 'Repartidor'}
        </h1>
        <p class="text-sm text-on-surface-variant mt-0.5">
          {pedidosActivos.length} {pedidosActivos.length === 1 ? 'pedido activo' : 'pedidos activos'}
        </p>
      </div>
      <div class="flex items-center gap-2 bg-primary-fixed/30 px-3 py-2 rounded-xl">
        <span class="material-symbols-outlined text-primary-container">two_wheeler</span>
        <div class="text-xs">
          <div class="font-bold text-on-surface">Disponible</div>
          <div class="text-on-surface-variant">Zona asignada</div>
        </div>
      </div>
    </section>

    <!-- PESTANAS -->
    <div class="flex gap-2 border-b border-gray-200">
      <button
        onclick={() => (vista = 'activos')}
        class="px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px
          {vista === 'activos'
            ? 'border-primary-container text-primary-container'
            : 'border-transparent text-on-surface-variant hover:text-on-surface'}"
      >
        Pedidos activos ({pedidosActivos.length})
      </button>
      <button
        onclick={() => (vista = 'historial')}
        class="px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px
          {vista === 'historial'
            ? 'border-primary-container text-primary-container'
            : 'border-transparent text-on-surface-variant hover:text-on-surface'}"
      >
        Historial ({pedidosHistorial.length})
      </button>
    </div>

    <!-- LISTA -->
    {#if listaMostrada.length === 0}
      <div class="text-center py-16 bg-white rounded-2xl">
        <span class="material-symbols-outlined text-5xl text-on-surface-variant/40">inbox</span>
        <p class="mt-3 text-on-surface-variant">
          {vista === 'activos' ? 'No tienes pedidos activos.' : 'Aun no hay historial.'}
        </p>
      </div>
    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {#each listaMostrada as p (p.id_pedido)}
          <article class="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">

            <!-- Cabecera: ID + Estado -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                  #{p.id_pedido}
                </span>
                <EstadoBadge codigo={p.estado} />
              </div>
              <span class="text-xs text-on-surface-variant flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">schedule</span>
                {p.tiempo_estimado_min} min
              </span>
            </div>

            <!-- Ruta: recogida y entrega -->
            <div class="flex flex-col gap-2 text-sm">
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[18px] text-primary-container mt-0.5">storefront</span>
                <div>
                  <div class="font-semibold text-on-surface">{p.restaurante.nombre}</div>
                  <div class="text-xs text-on-surface-variant">{p.restaurante.direccion}</div>
                </div>
              </div>
              <div class="ml-2 border-l-2 border-dashed border-gray-300 h-3"></div>
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[18px] text-primary mt-0.5">location_on</span>
                <div>
                  <div class="font-semibold text-on-surface">{p.cliente.nombre}</div>
                  <div class="text-xs text-on-surface-variant">{p.cliente.direccion}</div>
                  {#if p.cliente.referencia}
                    <div class="text-[11px] text-on-surface-variant/70 italic">{p.cliente.referencia}</div>
                  {/if}
                </div>
              </div>
            </div>

            <!-- Productos y montos -->
            <div class="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2">
              <div class="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                {p.productos.length} {p.productos.length === 1 ? 'producto' : 'productos'}
              </div>
              {#each p.productos as prod}
                <div class="flex items-center justify-between text-sm">
                  <span class="text-on-surface">{prod.cantidad}x {prod.nombre}</span>
                </div>
              {/each}
              <div class="flex items-center justify-between border-t border-gray-200 pt-2 mt-1">
                <span class="text-xs text-on-surface-variant">
                  Envio {usd(p.costo_envio)} + Propina {usd(p.propina)}
                </span>
                <span class="text-base font-bold text-on-surface">{usd(p.total)}</span>
              </div>
            </div>

            <!-- Acciones -->
            {#if p.estado === 'listo_para_retirar' || p.estado === 'en_camino'}
              <button
                onclick={() => accionPrincipal(p)}
                class="w-full h-10 rounded-lg bg-primary-container hover:bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span class="material-symbols-outlined text-[18px]">{iconoAccion(p)}</span>
                {textoAccion(p)}
              </button>
            {:else if p.estado === 'recibido'}
              <div class="flex gap-2">
                <button
                  onclick={() => rechazarPedido(p.id_pedido)}
                  class="flex-1 h-10 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors"
                >
                  Rechazar
                </button>
                <button
                  onclick={() => aceptarPedido(p.id_pedido)}
                  class="flex-1 h-10 rounded-lg bg-primary-container hover:bg-primary text-white font-semibold text-sm transition-colors"
                >
                  Aceptar
                </button>
              </div>
            {:else}
              <div class="text-center text-xs text-on-surface-variant py-2">
                Sin acciones disponibles
              </div>
            {/if}

          </article>
        {/each}
      </div>
    {/if}

  </main>
</div>
