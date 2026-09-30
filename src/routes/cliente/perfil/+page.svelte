<script>
	import { goto } from '$app/navigation';
	import { mostrarToast } from '$lib/toast.js';
	import { sesion } from '$lib/stores/sesion.js';
	import { obtenerPerfilMock, actualizarDatosFiscalesMock } from '$lib/mock/perfil.js';
	import { DIRECCIONES } from '$lib/mock/direcciones.js';

	// ───── Estado ─────
	let perfil = $state(null);
	let cargando = $state(true);
	let guardando = $state(false);

	// Campos editables
	let telefono = $state('');
	let cedula = $state('');
	let fotoPreview = $state(null);
	let direccionActual = $state(DIRECCIONES[0]);
	let modalDireccion = $state(false);

	$effect(() => {
		cargarPerfil();
	});

	async function cargarPerfil() {
		cargando = true;
		try {
			perfil = await obtenerPerfilMock();
			telefono = perfil.telefono;
			cedula = perfil.cedula_rif;
		} catch (err) {
			mostrarToast('error', err.message);
		} finally {
			cargando = false;
		}
	}

	function formatearTelefono(e) {
		let v = e.target.value.replace(/\D/g, '').slice(0, 11);
		if (v.length > 4) v = v.slice(0, 4) + ' ' + v.slice(4);
		telefono = v;
		e.target.value = v;
	}

	function formatearCedula(e) {
		let v = e.target.value.toUpperCase().replace(/[^VJ0-9-]/g, '');
		if (/^[VJ]/.test(v) && v.length > 1 && v[1] !== '-') {
			v = v[0] + '-' + v.slice(1);
		}
		cedula = v;
		e.target.value = v;
	}

	function validarTelefono() {
		const digitos = telefono.replace(/\D/g, '');
		if (digitos.length < 10 || digitos.length > 11) {
			return { ok: false, msj: 'El teléfono debe tener 10 u 11 dígitos' };
		}
		return { ok: true };
	}

	function validarCedula() {
		if (!cedula) return { ok: false, msj: 'La cédula/RIF es obligatoria' };
		if (!/^V-\d{7,9}$/.test(cedula) && !/^J-\d{8}-\d$/.test(cedula)) {
			return {
				ok: false,
				msj: 'Formato inválido. Usa V-12345678 (7-9 dígitos) o J-12345678-9'
			};
		}
		return { ok: true };
	}

	async function guardar() {
		const t = validarTelefono();
		if (!t.ok) {
			mostrarToast('error', t.msj);
			return;
		}
		const c = validarCedula();
		if (!c.ok) {
			mostrarToast('error', c.msj);
			return;
		}

		guardando = true;
		try {
			perfil = await actualizarDatosFiscalesMock({ telefono, cedula_rif: cedula });
			mostrarToast('exito', 'Datos fiscales actualizados con éxito');
		} catch (err) {
			mostrarToast('error', err.message);
		} finally {
			guardando = false;
		}
	}

	// Foto
	function cambiarFoto(e) {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			mostrarToast('error', 'La imagen no puede pesar más de 5MB');
			return;
		}

		const reader = new FileReader();
		reader.onload = (ev) => {
			fotoPreview = ev.target.result;
			mostrarToast('exito', 'Foto actualizada');
		};
		reader.readAsDataURL(file);
	}

	// Direcciones
	function seleccionarDireccion(dir) {
		direccionActual = dir;
		modalDireccion = false;
		mostrarToast('exito', 'Dirección principal actualizada');
	}
</script>

<div class="min-h-screen bg-surface">
	<div class="max-w-[800px] mx-auto px-4 py-8">
		<!-- Breadcrumb -->
		<nav class="flex items-center gap-1.5 text-xs text-on-surface-variant mb-4">
			<a href="/cliente" class="flex items-center gap-1 hover:text-primary transition-colors">
				<span class="material-symbols-outlined text-[16px]">arrow_back</span>
				Mi cuenta
			</a>
			<span class="text-outline-variant">/</span>
			<span class="text-on-surface font-semibold">Mi perfil</span>
		</nav>

		<!-- Card principal -->
		<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
			<!-- Cabecera -->
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-gray-100">
				<div>
					<div class="flex items-center gap-2 flex-wrap">
						<h1 class="text-2xl font-bold text-on-surface">Mi perfil</h1>
						<span class="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-[11px] font-semibold px-2.5 py-1 rounded-full">
							<span class="w-1.5 h-1.5 rounded-full bg-green-600"></span>
							Perfil Activo
						</span>
					</div>
					<p class="text-sm text-on-surface-variant mt-1">Tus datos fiscales y dirección principal</p>
				</div>
			</div>

			{#if cargando}
				<div class="py-16 flex flex-col items-center justify-center gap-3">
					<span class="material-symbols-outlined text-4xl text-primary-container animate-spin">progress_activity</span>
					<p class="text-sm text-on-surface-variant">Cargando tu perfil...</p>
				</div>
			{:else}
				<!-- Avatar -->
				<div class="py-6 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4">
					<div class="relative">
						<div class="w-20 h-20 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center text-primary-container shadow-inner border-2 border-white">
							{#if fotoPreview}
								<img src={fotoPreview} alt="Foto de perfil" class="w-full h-full object-cover" />
							{:else}
								<span class="text-3xl font-bold">{$sesion.nombre?.charAt(0) || 'C'}</span>
							{/if}
						</div>
						<label class="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary-container text-white flex items-center justify-center shadow-md hover:bg-primary transition-colors cursor-pointer">
							<span class="material-symbols-outlined text-[15px]">photo_camera</span>
							<input
								type="file"
								accept="image/*"
								onchange={cambiarFoto}
								class="hidden"
							/>
						</label>
					</div>
					<div class="flex flex-col sm:flex-row items-center justify-between flex-1 gap-3 text-center sm:text-left">
						<div>
							<p class="text-sm font-bold text-on-surface">Fotografía del titular</p>
							<p class="text-xs text-on-surface-variant mt-0.5">JPG o PNG. Máximo 5MB.</p>
						</div>
						<label class="inline-flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold px-4 py-2 rounded-lg border border-gray-200 transition-colors cursor-pointer">
							<span class="material-symbols-outlined text-[18px]">photo_camera</span>
							Cambiar foto
							<input
								type="file"
								accept="image/*"
								onchange={cambiarFoto}
								class="hidden"
							/>
						</label>
					</div>
				</div>

				<!-- ══════════ DIRECCIÓN PRINCIPAL ══════════ -->
				<div class="py-6 border-b border-gray-100">
					<div class="flex items-center justify-between mb-3">
						<h2 class="text-sm font-bold text-on-surface flex items-center gap-2">
							<span class="material-symbols-outlined text-primary-container text-[20px]">location_on</span>
							Dirección de entrega principal
						</h2>
						<button
							type="button"
							onclick={() => (modalDireccion = true)}
							class="text-xs font-semibold text-primary-container hover:underline"
						>
							Cambiar
						</button>
					</div>
					<div class="bg-surface-container-low rounded-lg p-3 flex items-start gap-3">
						<span class="material-symbols-outlined text-primary-container text-[22px] mt-0.5">home_pin</span>
						<div class="min-w-0">
							<p class="text-sm font-semibold text-on-surface">{direccionActual.direccion}</p>
							<p class="text-xs text-on-surface-variant mt-0.5">{direccionActual.zona}</p>
							{#if direccionActual.referencia}
								<p class="text-[11px] text-on-surface-variant flex items-center gap-1 mt-1">
									<span class="material-symbols-outlined text-[14px] text-tertiary">info</span>
									{direccionActual.referencia}
								</p>
							{/if}
						</div>
					</div>
				</div>

				<!-- Formulario -->
				<form onsubmit={(e) => { e.preventDefault(); guardar(); }} class="flex flex-col gap-5 mt-6">
					<!-- Nombre (readonly) -->
					<div>
						<label class="block text-xs font-semibold text-on-surface-variant mb-1.5">
							Nombre y Apellido
						</label>
						<div class="relative flex items-center">
							<input
								type="text"
								value={perfil.nombre}
								readonly
								class="w-full h-11 bg-surface-container-low text-on-surface-variant text-sm rounded-lg px-3.5 pr-10 border border-gray-200 cursor-not-allowed focus:outline-none"
							/>
							<span class="material-symbols-outlined absolute right-3 text-on-surface-variant/60 text-[20px] pointer-events-none">lock</span>
						</div>
					</div>

					<!-- Email (readonly) -->
					<div>
						<label class="block text-xs font-semibold text-on-surface-variant mb-1.5">
							Correo electrónico de facturación
						</label>
						<div class="relative flex items-center">
							<input
								type="email"
								value={perfil.email}
								readonly
								class="w-full h-11 bg-surface-container-low text-on-surface-variant text-sm rounded-lg px-3.5 pr-10 border border-gray-200 cursor-not-allowed focus:outline-none"
							/>
							<span class="material-symbols-outlined absolute right-3 text-on-surface-variant/60 text-[20px] pointer-events-none">lock</span>
						</div>
					</div>

					<!-- Teléfono -->
					<div>
						<label for="telefono" class="block text-xs font-semibold text-on-surface-variant mb-1.5">
							Teléfono de contacto fiscal
						</label>
						<div class="flex">
							<span class="inline-flex items-center px-3.5 bg-surface-container-low text-on-surface text-sm font-bold border border-r-0 border-gray-200 rounded-l-lg select-none">
								+58
							</span>
							<input
								id="telefono"
								type="tel"
								value={telefono}
								oninput={formatearTelefono}
								placeholder="0414 1234567"
								class="w-full h-11 bg-white text-on-surface text-sm rounded-r-lg px-3.5 border border-gray-200 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
							/>
						</div>
					</div>

					<!-- Cédula o RIF -->
					<div>
						<div class="flex items-center justify-between mb-1.5">
							<label for="cedula" class="text-xs font-semibold text-on-surface-variant flex items-center gap-2">
								Cédula o RIF
								<span class="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
									Obligatorio
								</span>
							</label>
							{#if cedula && validarCedula().ok}
								<span class="text-[11px] text-green-600 flex items-center gap-0.5 font-medium">
									<span class="material-symbols-outlined text-[14px]">check</span>
									Válido
								</span>
							{/if}
						</div>
						<div class="relative flex items-center">
							<input
								id="cedula"
								type="text"
								value={cedula}
								oninput={formatearCedula}
								placeholder="V-12345678 o J-12345678-9"
								class="w-full h-11 bg-white text-on-surface font-semibold text-sm rounded-lg px-3.5 pr-10 border border-gray-200 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all uppercase"
							/>
							{#if cedula && validarCedula().ok}
								<span class="material-symbols-outlined absolute right-3 text-green-600 text-[22px] pointer-events-none" style="font-variation-settings: 'FILL' 1;">
									check_circle
								</span>
							{/if}
						</div>
						<p class="text-[11px] text-on-surface-variant mt-1 flex items-center gap-1">
							<span class="material-symbols-outlined text-[13px]">pin</span>
							Formato válido: V- seguido de 7 a 9 dígitos, o J- seguido de 8 dígitos y guion
						</p>
					</div>

					<!-- Card informativo -->
					<div class="bg-surface-container-low border border-gray-100 rounded-xl p-4 flex items-start gap-3">
						<span class="material-symbols-outlined text-tertiary text-[22px] shrink-0 mt-0.5" style="font-variation-settings: 'FILL' 1;">
							verified_user
						</span>
						<div>
							<h2 class="text-sm font-bold text-on-surface">
								Facturación fiscal electrónica
							</h2>
							<p class="text-xs text-on-surface-variant mt-1 leading-relaxed">
								Emitimos comprobantes fiscales digitales. Tus pedidos generarán factura formal con tu cédula/RIF automáticamente.
							</p>
						</div>
					</div>

					<!-- Botón -->
					<button
						type="submit"
						disabled={guardando}
						class="w-full h-12 bg-primary-container hover:bg-primary disabled:opacity-60 text-white font-bold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
					>
						{#if guardando}
							<span class="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
							<span>Guardando...</span>
						{:else}
							<span class="material-symbols-outlined text-[20px]">save</span>
							<span>Guardar cambios</span>
						{/if}
					</button>
				</form>

				<div class="text-on-surface-variant text-[11px] flex items-center justify-center gap-1.5 mt-5">
					<span class="material-symbols-outlined text-[14px]">lock</span>
					Tus datos se procesan con cifrado bancario SHA-256
				</div>
			{/if}
		</div>
	</div>

	<!-- ═══════════ MODAL DIRECCIÓN ═══════════ -->
	{#if modalDireccion}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
			<div class="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-bold text-on-surface">Dirección principal</h3>
					<button
						type="button"
						onclick={() => (modalDireccion = false)}
						class="text-on-surface-variant hover:text-on-surface p-1 rounded transition-colors"
						aria-label="Cerrar"
					>
						<span class="material-symbols-outlined text-[20px]">close</span>
					</button>
				</div>

				<div class="flex flex-col gap-2">
					{#each DIRECCIONES as dir (dir.id_direccion)}
						<button
							type="button"
							onclick={() => seleccionarDireccion(dir)}
							class="w-full text-left p-3 rounded-lg border-2 transition-all
								{direccionActual.id_direccion === dir.id_direccion
								? 'border-primary-container bg-primary-fixed/20'
								: 'border-gray-200 hover:border-primary-container/40'}"
						>
							<div class="flex items-start gap-3">
								<span class="material-symbols-outlined text-primary-container text-[20px] mt-0.5 shrink-0">
									{direccionActual.id_direccion === dir.id_direccion ? 'radio_button_checked' : 'radio_button_unchecked'}
								</span>
								<div class="min-w-0 flex-1">
									<p class="text-sm font-semibold text-on-surface">{dir.direccion}</p>
									<p class="text-xs text-on-surface-variant mt-0.5">{dir.zona}</p>
									{#if dir.referencia}
										<p class="text-[11px] text-on-surface-variant mt-1 italic">{dir.referencia}</p>
									{/if}
								</div>
							</div>
						</button>
					{/each}
				</div>

				<button
					type="button"
					onclick={() => (modalDireccion = false)}
					class="w-full h-11 mt-4 bg-surface-container text-on-surface font-semibold text-sm rounded-lg hover:bg-surface-container-high transition-colors"
				>
					Cerrar
				</button>
			</div>
		</div>
	{/if}
</div>