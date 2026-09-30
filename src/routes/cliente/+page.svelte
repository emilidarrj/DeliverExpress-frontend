<script>
	import { sesion } from '$lib/stores/sesion.js';
</script>

<div class="min-h-screen bg-surface flex items-center justify-center">
	<div class="text-center">
		<h1 class="text-3xl font-bold text-on-surface mb-4">
			¡Hola, {$sesion.nombre}!
		</h1>
		<p class="text-on-surface-variant">Pantalla de inicio del cliente — próximamente</p>
	</div>
</div>