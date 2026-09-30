<script>
  import { onMount } from 'svelte';
  import { sesion, cargarSesion, cerrarSesion } from '$lib/stores/sesion.js';
  import { goto } from '$app/navigation';
  import Toast from '$lib/componentes/Toast.svelte';
  import './layout.css';

  onMount(cargarSesion);

  function salir() {
    cerrarSesion();
    goto('/login');
  }
</script>

{#if $sesion.token}
  <header class="bg-white shadow p-3 flex justify-between items-center print:hidden">
    <span class="font-semibold">DeliverExpress</span>
    <div class="flex items-center gap-3">
      <span class="text-sm text-gray-600">{$sesion.nombre} · {$sesion.rol}</span>
      <button onclick={salir} class="text-sm text-red-600 hover:underline">Cerrar sesión</button>
    </div>
  </header>
{/if}

<main>
  <slot />
</main>

<Toast />