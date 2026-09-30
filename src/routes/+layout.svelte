<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { sesion, cargarSesion, cerrarSesion } from '$lib/stores/sesion.js';
	import Toast from '$lib/componentes/Toast.svelte';
	import './layout.css';

	let { children } = $props();

	onMount(cargarSesion);

	// Rutas donde NO se debe mostrar el header
	const RUTAS_SIN_HEADER = ['/login', '/registro', '/'];

	function mostrarHeader() {
		if (!sesion) return false;
		if (!page.url.pathname) return false;
		if (RUTAS_SIN_HEADER.includes(page.url.pathname)) return false;
		return true;
	}

	function salir() {
		cerrarSesion();
		goto('/login');
	}
</script>

{#if $sesion.token && mostrarHeader()}
	<header class="bg-white shadow p-3 flex justify-between items-center print:hidden">
		<span class="font-semibold">DeliverExpress</span>
		<div class="flex items-center gap-3">
			<span class="text-sm text-gray-600">{$sesion.nombre} · {$sesion.rol}</span>
			<button onclick={salir} class="text-sm text-red-600 hover:underline">
				Cerrar sesión
			</button>
		</div>
	</header>
{/if}

<main>
	{@render children?.()}
</main>

<Toast />