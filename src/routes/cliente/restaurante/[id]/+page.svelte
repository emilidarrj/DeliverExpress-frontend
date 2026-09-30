<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { usd } from '$lib/formato.js';
	import { mostrarToast } from '$lib/toast.js';
	import { RESTAURANTES } from '$lib/mock/restaurantes.js';
	import { PRODUCTOS_POR_RESTAURANTE } from '$lib/mock/productos.js';
    import { carrito, agregarAlCarrito, reemplazarCarrito,  quitarDelCarrito,
	cantidadTotal, precioTotal } from '$lib/stores/carrito.js';

	const idRestaurante = Number(page.params.id);
	const restaurante = RESTAURANTES.find((r) => r.id_restaurante === idRestaurante);
	const productos = PRODUCTOS_POR_RESTAURANTE[idRestaurante] || [];
	const categorias = ['Todos', ...new Set(productos.map((p) => p.categoria))];

	let categoriaActiva = $state('Todos');
    let mostrarModalConflicto = $state(false);
    let productoPendiente = $state(null);

	// Mapa de cantidades por id_producto (reactivo)
	let cantidades = $derived.by(() => {
		const map = {};
		for (const item of $carrito.items) {
			map[item.id_producto] = item.cantidad;
		}
		return map;
	});

	let productosFiltrados = $derived(
		categoriaActiva === 'Todos' ? productos : productos.filter((p) => p.categoria === categoriaActiva)
	);

	function agregar(producto) {
	const exito = agregarAlCarrito(restaurante, producto);

	if (!exito) {
		// Hay conflicto con otro restaurante → abrir modal
		productoPendiente = producto;
		mostrarModalConflicto = true;
	}
    }

    function confirmarReemplazo() {
	if (productoPendiente) {
		reemplazarCarrito(restaurante, productoPendiente);
		productoPendiente = null;
	}
	mostrarModalConflicto = false;
    }

    function cancelarReemplazo() {
	productoPendiente = null;
	mostrarModalConflicto = false;
    }

	function quitar(idProducto) {
		quitarDelCarrito(idProducto);
	}
</script>

{#if !restaurante}
	<div class="min-h-screen bg-surface flex items-center justify-center">
		<div class="text-center">
			<span class="material-symbols-outlined text-6xl text-on-surface-variant/40">error</span>
			<h1 class="text-2xl font-bold text-on-surface mt-4">Restaurante no encontrado</h1>
			<button
				onclick={() => goto('/cliente')}
				class="mt-6 px-5 py-2.5 bg-primary-container text-white rounded-lg font-semibold"
			>
				Volver al inicio
			</button>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-surface pb-28">
		<!-- ═══════════ HERO ═══════════ -->
		<div class="relative w-full h-64 sm:h-72 overflow-hidden">
			<img src={restaurante.imagen} alt={restaurante.nombre} class="w-full h-full object-cover" />
			<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

			<!-- BOTÓN VOLVER (más visible) -->
			<button
				onclick={() => goto('/cliente')}
				class="absolute top-4 left-4 z-10 flex items-center gap-2 bg-primary-container hover:bg-primary text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-lg transition-colors"
			>
				<span class="material-symbols-outlined text-[18px]">arrow_back</span>
				<span>Volver a restaurantes</span>
			</button>

			<!-- Info del restaurante -->
			<div class="absolute bottom-4 left-4 right-4 max-w-[900px] mx-auto">
				<div class="flex items-center gap-2 flex-wrap">
					<h1 class="text-2xl sm:text-3xl font-bold text-white drop-shadow">{restaurante.nombre}</h1>
					{#if restaurante.abierto_ahora}
						<span class="inline-flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded-full text-[11px] font-bold">
							<span class="w-1.5 h-1.5 rounded-full bg-white"></span>
							Abierto ahora
						</span>
					{:else}
						<span class="inline-flex items-center gap-1 bg-red-600 text-white px-2 py-0.5 rounded-full text-[11px] font-bold">
							Cerrado
						</span>
					{/if}
				</div>
				<p class="text-sm text-white/85 mt-1">{restaurante.categoria}</p>
			</div>
		</div>

		<!-- ═══════════ INFO BAR ═══════════ -->
		<div class="max-w-[900px] mx-auto px-4 -mt-2">
			<div class="bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-x-6 gap-y-3">
				<!-- Estrellas -->
				<div class="flex items-center gap-1.5">
					<span class="material-symbols-outlined text-[18px] text-amber-400" style="font-variation-settings: 'FILL' 1;">star</span>
					<span class="text-sm font-bold text-on-surface">{restaurante.calificacion_promedio}</span>
				</div>

				<!-- Tiempo -->
				<div class="flex items-center gap-2">
					<span class="material-symbols-outlined text-[18px] text-on-surface-variant">schedule</span>
					<span class="text-sm text-on-surface">{restaurante.tiempo_prep_min} - {restaurante.tiempo_prep_min + 10} min</span>
				</div>

				<!-- Envío (con padding) -->
				<div class="flex items-center gap-2">
					<span class="material-symbols-outlined text-[18px] text-on-surface-variant">two_wheeler</span>
					{#if restaurante.costo_envio === 0}
						<span class="text-sm font-semibold text-green-600">Envío gratis</span>
					{:else}
						<span class="text-sm text-on-surface">Envío {usd(restaurante.costo_envio)}</span>
					{/if}
				</div>

				<!-- Nota -->
				<div class="ml-auto hidden sm:flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-full">
					<span class="material-symbols-outlined text-primary text-[16px]">info</span>
					Solo productos de {restaurante.nombre}
				</div>
			</div>
		</div>

		<!-- ═══════════ CATEGORÍAS ═══════════ -->
		<div class="max-w-[900px] mx-auto px-4 mt-6">
			<div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
				{#each categorias as cat (cat)}
					<button
						onclick={() => (categoriaActiva = cat)}
						class="shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-colors
							{categoriaActiva === cat
							? 'bg-primary-container text-white shadow-sm'
							: 'bg-white text-on-surface hover:bg-surface-container'}"
					>
						{cat}
					</button>
				{/each}
			</div>
		</div>

		<!-- ═══════════ PRODUCTOS ═══════════ -->
		<div class="max-w-[900px] mx-auto px-4 mt-4">
			{#if productosFiltrados.length === 0}
				<div class="text-center py-16 bg-white rounded-xl">
					<span class="material-symbols-outlined text-5xl text-on-surface-variant/40">restaurant_menu</span>
					<p class="mt-3 text-on-surface-variant">No hay productos en esta categoría.</p>
				</div>
			{:else}
				<div class="flex flex-col gap-3">
					{#each productosFiltrados as p (p.id_producto)}
						{@const qty = cantidades[p.id_producto] || 0}
						<article class="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
							<!-- Info -->
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2 flex-wrap mb-1">
									<h3 class="text-base font-bold text-on-surface">{p.nombre}</h3>
									{#if p.badge}
										<span class="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
											{p.badge}
										</span>
									{/if}
									{#if p.exento_iva}
										<span class="bg-tertiary-container/20 text-tertiary text-[10px] font-bold px-2 py-0.5 rounded-full">
											Exento IVA
										</span>
									{/if}
								</div>
								<p class="text-sm text-on-surface-variant line-clamp-2 mb-2">{p.descripcion}</p>
								<span class="text-base font-bold text-primary-container">{usd(p.precio)}</span>
							</div>

							<!-- Imagen + botón -->
							<div class="relative w-24 h-24 shrink-0">
								<img src={p.imagen} alt={p.nombre} class="w-24 h-24 object-cover rounded-lg" />

								{#if qty > 0}
									<!-- Contador -->
									<div class="absolute -bottom-2 -right-2 flex items-center bg-primary-container text-white rounded-full shadow-md z-10">
										<button
											type="button"
											onclick={() => quitar(p.id_producto)}
											class="w-8 h-8 flex items-center justify-center hover:bg-primary transition-colors rounded-l-full"
											aria-label="Quitar uno"
										>
											<span class="material-symbols-outlined text-[18px]">remove</span>
										</button>
										<span class="text-sm font-bold w-7 text-center">{qty}</span>
										<button
											type="button"
											onclick={() => agregar(p)}
											class="w-8 h-8 flex items-center justify-center hover:bg-primary transition-colors rounded-r-full"
											aria-label="Agregar uno"
										>
											<span class="material-symbols-outlined text-[18px]">add</span>
										</button>
									</div>
								{:else}
									<!-- Botón agregar -->
									<button
										type="button"
										onclick={() => agregar(p)}
										class="absolute -bottom-2 -right-2 w-9 h-9 bg-primary-container hover:bg-primary text-white rounded-full flex items-center justify-center shadow-md transition-colors z-10"
										aria-label="Agregar al carrito"
									>
										<span class="material-symbols-outlined text-[20px]">add</span>
									</button>
								{/if}
							</div>
						</article>
					{/each}
				</div>
			{/if}
		</div>

		<!-- ═══════════ BOTÓN FLOTANTE CARRITO ═══════════ -->
		{#if $carrito.items.length > 0}
			<div class="fixed bottom-4 left-4 right-4 max-w-[900px] mx-auto z-30">
				<button
					onclick={() => goto('/cliente/checkout')}
					class="w-full flex items-center justify-between bg-primary-container hover:bg-primary text-white px-5 py-3.5 rounded-xl shadow-xl transition-colors"
				>
					<div class="flex items-center gap-3">
						<div class="relative flex items-center justify-center">
							<span class="material-symbols-outlined text-[22px]">shopping_bag</span>
							<span class="absolute -top-1.5 -right-2 bg-white text-primary-container font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
								{cantidadTotal($carrito.items)}
							</span>
						</div>
						<div class="flex items-center gap-1.5 text-sm font-bold">
							<span>Ver carrito</span>
							<span class="opacity-70">·</span>
							<span>{cantidadTotal($carrito.items)} {cantidadTotal($carrito.items) === 1 ? 'producto' : 'productos'}</span>
							<span class="opacity-70">·</span>
							<span>{usd(precioTotal($carrito.items))}</span>
						</div>
					</div>
					<span class="material-symbols-outlined">arrow_forward</span>
				</button>
			</div>
		{/if}
	</div>
    		<!-- ═══════════ MODAL CONFLICTO DE CARRITO ═══════════ -->
		    {#if mostrarModalConflicto}
			<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
				<div class="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
					<!-- Ícono -->
					<div class="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center mb-4">
						<span class="material-symbols-outlined text-primary-container text-[26px]">storefront</span>
					</div>

					<!-- Título -->
					<h3 class="text-lg font-bold text-on-surface mb-2">
						¿Iniciar un nuevo pedido?
					</h3>

					<!-- Mensaje -->
					<p class="text-sm text-on-surface-variant leading-relaxed">
						Actualmente tienes productos de
						<strong class="text-on-surface">{$carrito.nombre_restaurante}</strong>.
						Solo puedes ordenar de un restaurante a la vez en DeliverExpress.
						Si continúas, se vaciará el carrito actual.
					</p>

					<!-- Botones -->
					<div class="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 mt-6">
						<button
							type="button"
							onclick={cancelarReemplazo}
							class="w-full sm:w-auto px-5 py-2.5 rounded-lg text-on-surface hover:bg-surface-container font-semibold text-sm transition-colors"
						>
							Cancelar
						</button>
						<button
							type="button"
							onclick={confirmarReemplazo}
							class="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary-container hover:bg-primary text-white font-bold text-sm transition-colors"
						>
							Iniciar nuevo pedido
						</button>
					</div>
				</div>
			</div>
		{/if}
{/if}