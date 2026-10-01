<script>
  import { sesion } from '$lib/stores/sesion.js';
  import { ZONAS } from '$lib/mock/zonas.js';
  import { CATEGORIAS } from '$lib/mock/categorias.js';
  import { TARIFAS_ENVIO, PARAMETROS_SISTEMA } from '$lib/mock/admin.js';
  import { usd } from '$lib/formato.js';

  // Pestaña activa
  let pestana = $state('zonas');

  // Datos locales (copia reactiva de los mocks)
  let zonas = $state([...ZONAS]);
  let categorias = $state([...CATEGORIAS]);
  let tarifas = $state([...TARIFAS_ENVIO]);
  let parametros = $state([...PARAMETROS_SISTEMA]);

  // Modal de crear
  let modalAbierto = $state(false);
  let modalTipo = $state('zona'); // 'zona' | 'categoria'
  let formNuevo = $state({ nombre: '', latitud: '', longitud: '', emoji: '' });

  // Confirmación de eliminar
  let confirmarAbierto = $state(false);
  let confirmarTipo = $state('zona');
  let confirmarId = $state(null);
  let confirmarNombre = $state('');

  // Contadores para IDs nuevos
  let nextZonaId = $state(ZONAS.length + 1);
  let nextCategoriaId = $state(CATEGORIAS.length + 1);

  function abrirModal(tipo) {
    modalTipo = tipo;
    formNuevo = { nombre: '', latitud: '', longitud: '', emoji: '' };
    modalAbierto = true;
  }

  function guardarNuevo() {
    if (modalTipo === 'zona') {
      if (!formNuevo.nombre.trim()) return;
      zonas = [...zonas, {
        id_zona: nextZonaId,
        nombre: formNuevo.nombre,
        latitud_centro: parseFloat(formNuevo.latitud) || 0,
        longitud_centro: parseFloat(formNuevo.longitud) || 0
      }];
      nextZonaId += 1;
    } else {
      if (!formNuevo.nombre.trim()) return;
      categorias = [...categorias, {
        id_categoria: nextCategoriaId,
        nombre: formNuevo.nombre,
        emoji: formNuevo.emoji || '🍽️'
      }];
      nextCategoriaId += 1;
    }
    modalAbierto = false;
  }

  function pedirConfirmacion(tipo, id, nombre) {
    confirmarTipo = tipo;
    confirmarId = id;
    confirmarNombre = nombre;
    confirmarAbierto = true;
  }

  function confirmarEliminar() {
    if (confirmarTipo === 'zona') {
      zonas = zonas.filter(z => z.id_zona !== confirmarId);
    } else if (confirmarTipo === 'categoria') {
      categorias = categorias.filter(c => c.id_categoria !== confirmarId);
    }
    confirmarAbierto = false;
  }
</script>

<div class="min-h-screen bg-surface">
  <main class="max-w-[1200px] mx-auto px-4 py-6 flex flex-col gap-6">

    <!-- ENCABEZADO -->
    <section class="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-on-surface">Panel de Administración</h1>
        <p class="text-sm text-on-surface-variant mt-0.5">
          Configuración del sistema · Bienvenido, {$sesion.nombre || 'Admin'}
        </p>
      </div>
      <div class="flex items-center gap-2 bg-primary-fixed/30 px-3 py-2 rounded-xl">
        <span class="material-symbols-outlined text-primary-container">shield_person</span>
        <div class="text-xs">
          <div class="font-bold text-on-surface">Administrador</div>
          <div class="text-on-surface-variant">Acceso completo</div>
        </div>
      </div>
    </section>

    <!-- PESTAÑAS -->
    <div class="flex gap-2 border-b border-gray-200 overflow-x-auto scrollbar-none">
      <button
        onclick={() => (pestana = 'zonas')}
        class="px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap
          {pestana === 'zonas'
            ? 'border-primary-container text-primary-container'
            : 'border-transparent text-on-surface-variant hover:text-on-surface'}"
      >
        Zonas ({zonas.length})
      </button>
      <button
        onclick={() => (pestana = 'categorias')}
        class="px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap
          {pestana === 'categorias'
            ? 'border-primary-container text-primary-container'
            : 'border-transparent text-on-surface-variant hover:text-on-surface'}"
      >
        Categorías ({categorias.length})
      </button>
      <button
        onclick={() => (pestana = 'tarifas')}
        class="px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap
          {pestana === 'tarifas'
            ? 'border-primary-container text-primary-container'
            : 'border-transparent text-on-surface-variant hover:text-on-surface'}"
      >
        Tarifas de envío ({tarifas.length})
      </button>
      <button
        onclick={() => (pestana = 'parametros')}
        class="px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap
          {pestana === 'parametros'
            ? 'border-primary-container text-primary-container'
            : 'border-transparent text-on-surface-variant hover:text-on-surface'}"
      >
        Parámetros ({parametros.length})
      </button>
    </div>

    <!-- ZONAS -->
    {#if pestana === 'zonas'}
      <section class="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-on-surface">Zonas de cobertura</h2>
            <p class="text-xs text-on-surface-variant mt-0.5">{zonas.length} zonas registradas</p>
          </div>
          <button
            onclick={() => abrirModal('zona')}
            class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-white text-sm font-semibold transition-colors"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
            Nueva zona
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-on-surface-variant uppercase tracking-wide border-b border-gray-200">
                <th class="py-2 px-3 w-16">ID</th>
                <th class="py-2 px-3">Nombre</th>
                <th class="py-2 px-3">Coordenadas</th>
                <th class="py-2 px-3 w-24 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {#each zonas as z, i (z.id_zona)}
                <tr class="border-b border-gray-100 {i % 2 === 1 ? 'bg-surface-container-low/50' : ''}">
                  <td class="py-3 px-3 text-on-surface-variant">{z.id_zona}</td>
                  <td class="py-3 px-3 font-semibold text-on-surface">{z.nombre}</td>
                  <td class="py-3 px-3 text-on-surface-variant text-xs">
                    {z.latitud_centro?.toFixed(4)}, {z.longitud_centro?.toFixed(4)}
                  </td>
                  <td class="py-3 px-3 text-right">
                    <button
                      onclick={() => pedirConfirmacion('zona', z.id_zona, z.nombre)}
                      class="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 transition-colors inline-flex items-center justify-center"
                      title="Eliminar"
                    >
                      <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    {/if}

    <!-- CATEGORÍAS -->
    {#if pestana === 'categorias'}
      <section class="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-on-surface">Categorías de restaurantes</h2>
            <p class="text-xs text-on-surface-variant mt-0.5">{categorias.length} categorías registradas</p>
          </div>
          <button
            onclick={() => abrirModal('categoria')}
            class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-white text-sm font-semibold transition-colors"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
            Nueva categoría
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-on-surface-variant uppercase tracking-wide border-b border-gray-200">
                <th class="py-2 px-3 w-16">ID</th>
              
                <th class="py-2 px-3">Nombre</th>
                <th class="py-2 px-3 w-24 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {#each categorias as c, i (c.id_categoria)}
                <tr class="border-b border-gray-100 {i % 2 === 1 ? 'bg-surface-container-low/50' : ''}">
                  <td class="py-3 px-3 text-on-surface-variant">{c.id_categoria}</td>
                  
                  <td class="py-3 px-3 font-semibold text-on-surface">{c.nombre}</td>
                  <td class="py-3 px-3 text-right">
                    <button
                      onclick={() => pedirConfirmacion('categoria', c.id_categoria, c.nombre)}
                      class="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 transition-colors inline-flex items-center justify-center"
                      title="Eliminar"
                    >
                      <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    {/if}

    <!-- TARIFAS -->
    {#if pestana === 'tarifas'}
      <section class="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
        <div>
          <h2 class="text-lg font-bold text-on-surface">Tarifas de envío por distancia</h2>
          <p class="text-xs text-on-surface-variant mt-0.5">Los rangos se definen en kilómetros</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-on-surface-variant uppercase tracking-wide border-b border-gray-200">
                <th class="py-2 px-3 w-16">ID</th>
                <th class="py-2 px-3">Rango</th>
                <th class="py-2 px-3 text-right">Precio</th>
              </tr>
            </thead>
            <tbody>
              {#each tarifas as t, i (t.id_tarifa)}
                <tr class="border-b border-gray-100 {i % 2 === 1 ? 'bg-surface-container-low/50' : ''}">
                  <td class="py-3 px-3 text-on-surface-variant">{t.id_tarifa}</td>
                  <td class="py-3 px-3 text-on-surface">
                    {t.km_desde} km — {t.km_hasta >= 999 ? 'más' : t.km_hasta + ' km'}
                  </td>
                  <td class="py-3 px-3 text-right font-bold text-on-surface">{usd(t.precio)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    {/if}

    <!-- PARÁMETROS -->
    {#if pestana === 'parametros'}
      <section class="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
        <div>
          <h2 class="text-lg font-bold text-on-surface">Parámetros del sistema</h2>
          <p class="text-xs text-on-surface-variant mt-0.5">Valores configurables del negocio</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-on-surface-variant uppercase tracking-wide border-b border-gray-200">
                <th class="py-2 px-3">Clave</th>
                <th class="py-2 px-3 w-32">Valor</th>
                <th class="py-2 px-3">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {#each parametros as p, i (p.clave)}
                <tr class="border-b border-gray-100 {i % 2 === 1 ? 'bg-surface-container-low/50' : ''}">
                  <td class="py-3 px-3 font-mono text-xs text-on-surface">{p.clave}</td>
                  <td class="py-3 px-3">
                    <span class="inline-block bg-primary-fixed/40 text-primary-container text-xs font-bold px-2 py-1 rounded">
                      {p.valor}
                    </span>
                  </td>
                  <td class="py-3 px-3 text-on-surface-variant text-xs">{p.descripcion}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    {/if}

  </main>

  <!-- MODAL CREAR -->
  {#if modalAbierto}
    <div
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      role="presentation"
      onclick={(e) => e.target === e.currentTarget && (modalAbierto = false)}
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-on-surface">
            {modalTipo === 'zona' ? 'Nueva zona' : 'Nueva categoría'}
          </h3>
          <button
            onclick={() => (modalAbierto = false)}
            class="w-8 h-8 rounded-lg hover:bg-surface-container-low flex items-center justify-center transition-colors"
          >
            <span class="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <div class="flex flex-col gap-3">
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Nombre</span>
            <input
              type="text"
              bind:value={formNuevo.nombre}
              placeholder={modalTipo === 'zona' ? 'Ej: Lechería Centro' : 'Ej: Italiana & Pizza'}
              class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-container"
            />
          </label>

          {#if modalTipo === 'zona'}
            <div class="grid grid-cols-2 gap-3">
              <label class="flex flex-col gap-1">
                <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Latitud</span>
                <input
                  type="number"
                  step="0.0001"
                  bind:value={formNuevo.latitud}
                  placeholder="8.2950"
                  class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-container"
                />
              </label>
              <label class="flex flex-col gap-1">
                <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Longitud</span>
                <input
                  type="number"
                  step="0.0001"
                  bind:value={formNuevo.longitud}
                  placeholder="-62.7350"
                  class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-container"
                />
              </label>
            </div>
          {:else}
            <label class="flex flex-col gap-1">
              <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Emoji</span>
              <input
                type="text"
                bind:value={formNuevo.emoji}
                placeholder="🍕"
                maxlength="4"
                class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-container"
              />
            </label>
          {/if}
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            onclick={() => (modalAbierto = false)}
            class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            Cancelar
          </button>
          <button
            onclick={guardarNuevo}
            class="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-white text-sm font-semibold transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- MODAL CONFIRMAR ELIMINAR -->
  {#if confirmarAbierto}
    <div
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      role="presentation"
      onclick={(e) => e.target === e.currentTarget && (confirmarAbierto = false)}
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-red-600">warning</span>
          </div>
          <div>
            <h3 class="text-base font-bold text-on-surface">¿Eliminar?</h3>
            <p class="text-xs text-on-surface-variant mt-0.5">
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        <p class="text-sm text-on-surface">
          Vas a eliminar: <span class="font-bold">{confirmarNombre}</span>
        </p>

        <div class="flex justify-end gap-2">
          <button
            onclick={() => (confirmarAbierto = false)}
            class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            Cancelar
          </button>
          <button
            onclick={confirmarEliminar}
            class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  {/if}

</div>