<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { obtenerPedidoPorId } from '$lib/stores/pedidos.js';
	import EstadoBadge from '$lib/componentes/EstadoBadge.svelte';

	const idPedido = Number(page.params.id);
	const pedidoStore = obtenerPedidoPorId(idPedido);
	let pedido = $derived($pedidoStore);
</script>

<div class="min-h-screen bg-surface">
	<div class="max-w-[900px] mx-auto px-4 py-6 flex flex-col gap-4">
		<!-- Breadcrumb -->
		<nav class="flex items-center gap-1.5 text-xs text-on-surface-variant">
			<a href="/cliente/pedidos" class="hover:text-primary-container transition-colors">Mis Pedidos</a>
			<span class="material-symbols-outlined text-[14px]">chevron_right</span>
			<a href="/cliente/pedidos/{idPedido}" class="hover:text-primary-container transition-colors">
				Pedido #{idPedido}
			</a>
			<span class="material-symbols-outlined text-[14px]">chevron_right</span>
			<span class="text-on-surface font-semibold">Seguimiento</span>
		</nav>

		{#if !pedido}
			<div class="bg-white rounded-xl p-8 text-center">
				<span class="material-symbols-outlined text-5xl text-on-surface-variant/40">error</span>
				<p class="text-on-surface mt-3">Pedido no encontrado</p>
			</div>
		{:else}
			<!-- Header -->
			<article class="bg-white rounded-xl p-5 shadow-sm flex items-center justify-between">
				<div class="flex items-center gap-3">
					<h1 class="text-lg font-bold text-on-surface">Pedido #{idPedido}</h1>
					<EstadoBadge codigo={pedido.estado_codigo} />
				</div>
				<button
					onclick={() => goto(`/cliente/pedidos/${idPedido}`)}
					class="text-xs font-semibold text-primary-container hover:underline"
				>
					Ver detalle
				</button>
			</article>

			<!-- Placeholder del mapa (Int.5) -->
			<article class="bg-white rounded-xl shadow-sm overflow-hidden">
				<div class="relative w-full h-[400px] bg-gradient-to-br from-[#EEF2F6] to-[#DCE2F7] flex items-center justify-center">
					<!-- Grid decorativa de fondo -->
					<svg class="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<pattern id="map-grid" width="60" height="60" patternUnits="userSpaceOnUse">
								<path d="M 60 0 L 0 0 0 60" fill="none" stroke="#CBD5E1" stroke-width="1" />
							</pattern>
						</defs>
						<rect fill="url(#map-grid)" width="100%" height="100%" />
					</svg>

					<!-- Contenido central -->
					<div class="relative z-10 text-center px-6">
						<div class="w-16 h-16 mx-auto rounded-full bg-white shadow-md flex items-center justify-center mb-4">
							<span class="material-symbols-outlined text-primary-container text-[32px]">
								location_searching
							</span>
						</div>
						<h2 class="text-lg font-bold text-on-surface">Mapa en vivo</h2>
						<p class="text-sm text-on-surface-variant mt-1 max-w-md">
							Aquí verás en tiempo real la ubicación del repartidor y su ruta hasta tu puerta.
						</p>

						<div class="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-lg mt-4">
							<span class="material-symbols-outlined text-yellow-700 text-[18px]">construction</span>
							<p class="text-xs text-yellow-900">
								Integración con el mapa pendiente (Int.5)
							</p>
						</div>

						{#if pedido.repartidor}
							<div class="mt-6 inline-flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm">
								<div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary-container font-bold text-sm">
									{pedido.repartidor.nombre?.charAt(0) || 'R'}
								</div>
								<div class="text-left">
									<p class="text-xs font-semibold text-on-surface">{pedido.repartidor.nombre}</p>
									<p class="text-[10px] text-on-surface-variant">Aproximándose</p>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</article>

			<!-- Info del pedido -->
			<article class="bg-white rounded-xl p-5 shadow-sm">
				<h2 class="text-sm font-bold text-on-surface mb-3">Información del pedido</h2>
				<div class="flex flex-col gap-2 text-sm">
					<div class="flex justify-between">
						<span class="text-on-surface-variant">Restaurante</span>
						<span class="font-semibold text-on-surface">{pedido.nombre}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-on-surface-variant">Tiempo estimado</span>
						<span class="font-semibold text-on-surface">{pedido.tiempo_estimado_min} min</span>
					</div>
					<div class="flex justify-between">
						<span class="text-on-surface-variant">Distancia</span>
						<span class="font-semibold text-on-surface">{pedido.distancia_km} km</span>
					</div>
				</div>
			</article>
		{/if}
	</div>
</div>