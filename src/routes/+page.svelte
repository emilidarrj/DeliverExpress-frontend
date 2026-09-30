<script>
  import { onMount } from 'svelte';
  import { sesion, cargarSesion, RUTA_POR_ROL } from '$lib/stores/sesion.js';
  import { goto } from '$app/navigation';

  onMount(() => {
    cargarSesion();
    if ($sesion.rol) {
      goto(RUTA_POR_ROL[$sesion.rol]);
    } else {
      goto('/login');
    }
  });
</script>

<div class="flex items-center justify-center h-screen">
  <p class="text-gray-500">Redirigiendo...</p>
</div>