<script>
  import { sesion } from '$lib/stores/sesion.js';
  import { PEDIDOS_ACTIVOS_COORDINADOR_DEMO } from '$lib/mock/pedidos.js';
  import {
    REPARTIDORES_DISPONIBLES_DEMO,
    RESTAURANTES_MAPA_DEMO
  } from '$lib/mock/repartidores.js';
  import { usd } from '$lib/formato.js';
  import EstadoBadge from '$lib/componentes/EstadoBadge.svelte';
  import MapaCoordinador from '$lib/componentes/MapaCoordinador.svelte';

  let pedidos = $state([...PEDIDOS_ACTIVOS_COORDINADOR_DEMO]);
  let repartidores = $state([...REPARTIDORES_DISPONIBLES_DEMO]);

  let pedidosActivos = $derived(pedidos.filter(p => p.estado !== 'entregado' && p.estado !== 'cancelado'));
  let repartidoresLibres = $derived(repartidores.filter(r => r.disponibilidad === 'libre'));
  let restaurantesCount = $derived(RESTAURANTES_MAPA_DEMO.length);
  let tiempoPromedio = $derived(
    Math.round(pedidosActivos.reduce((s, p) => s + (p.tiempo_estimado_min || 0), 0) / (pedidosActivos.length || 1))
  );

  let reasignarAbierto = $state(false);
  let pedidoAReasignar = $state(null);
  let repartidorSeleccionado = $state(null);

  let cancelarAbierto = $state(false);
  let pedidoACancelar = $state(null);

  function abrirReasignar(p) {
    pedidoAReasignar = p;
    repartidorSeleccionado = null;
    reasignarAbierto = true;
  }

  function confirmarReasignar() {
    if (!repartidorSeleccionado || !pedidoAReasignar) return;
    pedidos = pedidos.map(p =>
      p.id_pedido === pedidoAReasignar.id_pedido
        ? { ...p, repartidor: repartidorSeleccionado }
        : p
    );
    reasignarAbierto = false;
  }

  function abrirCancelar(p) {
    pedidoACancelar = p;
    cancelarAbierto = true;
  }

  function confirmarCancelar() {
    if (!pedidoACancelar) return;
    pedidos = pedidos.filter(p => p.id_pedido !== pedidoACancelar.id_pedido);
    cancelarAbierto = false;
  }
</script>

<div class="min-h-screen bg-surface">
  <main class="max-w-[1400px] mx-auto px-4 py-5 flex flex-col gap-5">

    <!-- ENCABEZADO -->
    <section class="bg-white rounded-2xl shadow-sm px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-lg font-bold text-on-surface leading-tight">Panel de Coordinadores</h1>
        <p class="text-xs text-on-surface-variant mt-0.5">Centro de control en tiempo real</p>
      </div>
      <div class="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span class="text-xs font-semibold text-green-700">En vivo</span>
      </div>
    </section>

    <!-- KPIs -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="bg-white rounded-2xl shadow-sm p-4 flex items-start justify-between gap-3">
        <div class="flex flex-col gap-1">
          <span class="text-[11px] text-on-surface-variant uppercase tracking-wide font-semibold">Pedidos activos</span>
          <span class="text-3xl font-bold text-on-surface leading-none">{pedidosActivos.length}</span>
          <span class="text-[11px] text-on-surface-variant">en curso</span>
        </div>
        <div class="w-11 h-11 rounded-xl bg-primary-fixed/40 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-primary-container text-[24px]">receipt_long</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-4 flex items-start justify-between gap-3">
        <div class="flex flex-col gap-1">
          <span class="text-[11px] text-on-surface-variant uppercase tracking-wide font-semibold">Repartidores</span>
          <span class="text-3xl font-bold text-on-surface leading-none">{repartidores.length}</span>
          <span class="text-[11px] text-green-600 font-semibold">{repartidoresLibres.length} libres</span>
        </div>
        <div class="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-blue-600 text-[24px]">two_wheeler</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-4 flex items-start justify-between gap-3">
        <div class="flex flex-col gap-1">
          <span class="text-[11px] text-on-surface-variant uppercase tracking-wide font-semibold">Restaurantes</span>
          <span class="text-3xl font-bold text-on-surface leading-none">{restaurantesCount}</span>
          <span class="text-[11px] text-on-surface-variant">conectados</span>
        </div>
        <div class="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-amber-600 text-[24px]">storefront</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-4 flex items-start justify-between gap-3">
        <div class="flex flex-col gap-1">
          <span class="text-[11px] text-on-surface-variant uppercase tracking-wide font-semibold">Tiempo promedio</span>
          <span class="text-3xl font-bold text-on-surface leading-none">{tiempoPromedio}<span class="text-base font-semibold text-on-surface-variant ml-1">min</span></span>
          <span class="text-[11px] text-on-surface-variant">por entrega</span>
        </div>
        <div class="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-purple-600 text-[24px]">schedule</span>
        </div>
      </div>
    </section>

    <!-- MAPA + PANEL -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

      <div class="lg:col-span-2">
        <MapaCoordinador
          restaurantes={RESTAURANTES_MAPA_DEMO}
          repartidores={repartidores}
          pedidos={pedidosActivos}
        />
      </div>

      <aside class="flex flex-col gap-5">

        <!-- PEDIDOS ACTIVOS -->
        <div class="bg-white rounded-2xl shadow-sm flex flex-col">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 class="text-sm font-bold text-on-surface">Pedidos activos</h2>
            <span class="text-xs font-bold text-primary-container">{pedidosActivos.length}</span>
          </div>

          {#if pedidosActivos.length === 0}
            <p class="text-xs text-on-surface-variant py-6 text-center">No hay pedidos activos.</p>
          {:else}
            <div class="flex flex-col max-h-[460px] overflow-y-auto divide-y divide-gray-100">
              {#each pedidosActivos as p (p.id_pedido)}
                <article class="p-4 flex flex-col gap-2 hover:bg-surface-container-low/40 transition-colors">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-on-surface">#{p.id_pedido} · {p.restaurante?.nombre}</span>
                    <EstadoBadge codigo={p.estado} />
                  </div>
                  <div class="text-xs text-on-surface-variant">
                    Cliente: <span class="text-on-surface font-medium">{p.cliente?.nombre}</span>
                  </div>
                  {#if p.repartidor}
                    <div class="text-xs text-on-surface-variant flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px] text-primary-container">two_wheeler</span>
                      <span class="text-on-surface">{p.repartidor.nombre || p.repartidor}</span>
                    </div>
                  {/if}
                  <div class="flex items-center justify-between mt-1">
                    <span class="text-[11px] text-on-surface-variant flex items-center gap-1">
                      <span class="material-symbols-outlined text-[13px]">schedule</span>
                      {p.tiempo_estimado_min} min
                    </span>
                    <div class="flex gap-1.5">
                      <button
                        onclick={() => abrirReasignar(p)}
                        class="text-[11px] font-semibold text-primary-container border border-primary-container/40 rounded-md px-2.5 py-1 hover:bg-primary-fixed/30 transition-colors"
                      >
                        Reasignar
                      </button>
                      <button
                        onclick={() => abrirCancelar(p)}
                        class="text-[11px] font-semibold text-red-600 border border-red-200 rounded-md px-2.5 py-1 hover:bg-red-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </article>
              {/each}
            </div>
          {/if}
        </div>

        <!-- REPARTIDORES -->
        <div class="bg-white rounded-2xl shadow-sm flex flex-col">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 class="text-sm font-bold text-on-surface">Repartidores disponibles</h2>
            <span class="text-xs text-on-surface-variant">{repartidoresLibres.length} libres / {repartidores.length - repartidoresLibres.length} ocupados</span>
          </div>

          <div class="flex flex-col max-h-[420px] overflow-y-auto divide-y divide-gray-100">
            {#each repartidores as r (r.id_repartidor)}
              <article class="flex items-center gap-3 px-4 py-2.5">
                <div class="w-9 h-9 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {r.iniciales}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-semibold text-on-surface truncate">{r.nombre}</div>
                  <div class="text-[11px] text-on-surface-variant capitalize truncate">
                    {r.vehiculo} · {r.zona}
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1 shrink-0">
                  <span class="text-xs font-bold text-on-surface flex items-center gap-0.5">
                    <span class="material-symbols-outlined text-[13px] text-amber-400" style="font-variation-settings:'FILL' 1;">star</span>
                    {r.calificacion_promedio}
                  </span>
                  <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full
                    {r.disponibilidad === 'libre' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}">
                    {r.disponibilidad === 'libre' ? 'Libre' : 'Ocupado'}
                  </span>
                </div>
              </article>
            {/each}
          </div>
        </div>

      </aside>
    </section>

  </main>

  <!-- MODAL REASIGNAR -->
  {#if reasignarAbierto}
    <div
      class="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
      style="z-index: 9999;"
      role="presentation"
      onclick={(e) => e.target === e.currentTarget && (reasignarAbierto = false)}
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-on-surface">Reasignar pedido #{pedidoAReasignar?.id_pedido}</h3>
          <button
            onclick={() => (reasignarAbierto = false)}
            class="w-8 h-8 rounded-lg hover:bg-surface-container-low flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <p class="text-xs text-on-surface-variant">
          Elige un repartidor disponible para reasignar este pedido.
        </p>

        <div class="flex flex-col gap-2">
          {#each repartidoresLibres as r (r.id_repartidor)}
            <button
              type="button"
              onclick={() => (repartidorSeleccionado = r)}
              class="flex items-center gap-3 p-3 rounded-xl border transition-colors text-left
                {repartidorSeleccionado?.id_repartidor === r.id_repartidor
                  ? 'border-primary-container bg-primary-fixed/20'
                  : 'border-gray-200 hover:border-primary-container/50'}"
            >
              <div class="w-9 h-9 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs">
                {r.iniciales}
              </div>
              <div class="flex-1">
                <div class="text-sm font-semibold text-on-surface">{r.nombre}</div>
                <div class="text-[11px] text-on-surface-variant capitalize">{r.vehiculo} · {r.zona}</div>
              </div>
              <span class="text-xs font-bold text-on-surface">★ {r.calificacion_promedio}</span>
            </button>
          {/each}
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            onclick={() => (reasignarAbierto = false)}
            class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low"
          >
            Cancelar
          </button>
          <button
            onclick={confirmarReasignar}
            disabled={!repartidorSeleccionado}
            class="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- MODAL CANCELAR -->
  {#if cancelarAbierto}
    <div
      class="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
      style="z-index: 9999;"
      role="presentation"
      onclick={(e) => e.target === e.currentTarget && (cancelarAbierto = false)}
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-red-600">warning</span>
          </div>
          <div>
            <h3 class="text-base font-bold text-on-surface">¿Cancelar pedido?</h3>
            <p class="text-xs text-on-surface-variant mt-0.5">Esta acción notificará al cliente.</p>
          </div>
        </div>

        <p class="text-sm text-on-surface">
          Vas a cancelar el pedido <span class="font-bold">#{pedidoACancelar?.id_pedido}</span> de <span class="font-bold">{pedidoACancelar?.restaurante?.nombre}</span>.
        </p>

        <div class="flex justify-end gap-2">
          <button
            onclick={() => (cancelarAbierto = false)}
            class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low"
          >
            Volver
          </button>
          <button
            onclick={confirmarCancelar}
            class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
          >
            Cancelar pedido
          </button>
        </div>
      </div>
    </div>
  {/if}

</div>