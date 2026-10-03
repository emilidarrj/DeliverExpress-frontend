<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { sesion, RUTA_POR_ROL } from '$lib/stores/sesion.js';
	import { mostrarToast } from '$lib/toast.js';
	import { api } from '$lib/api.js';

	// =========================================================
	// CONFIGURACIÓN SEGÚN ROL
	// =========================================================

	const CONFIG_PERFIL = {
		cliente: {
			titulo: 'Mi perfil',
			icono: 'person',
			tipoIdentificacion: 'Cédula / RIF',
			puedeEditarTelefono: true,
			puedeEditarIdentificacion: true,
			endpointGet: '/api/cliente/perfil',
			endpointPut: '/api/cliente/datos-fiscales',
			campoIdentificacion: 'cedula_rif',
			backendActivo: true
		},

		restaurante: {
			titulo: 'Perfil del restaurante',
			icono: 'storefront',
			tipoIdentificacion: 'RIF',
			puedeEditarTelefono: true,
			puedeEditarIdentificacion: true,
			endpointGet: '/api/restaurante/perfil',
			endpointPut: '/api/restaurante/perfil',
			campoIdentificacion: 'rif',
			backendActivo: true
		},

		repartidor: {
			 titulo: 'Mi perfil',
    		 icono: 'delivery_dining',
  		     tipoIdentificacion: 'Cédula',
    		 puedeEditarTelefono: true,
    		 puedeEditarIdentificacion: true,
    		 endpointGet: '/api/repartidor/perfil',
    		 endpointPut: '/api/repartidor/perfil',
    		 campoIdentificacion: 'cedula',
    		 backendActivo: true
		},

		coordinador: {
    		 titulo: 'Mi perfil',
    	 	 icono: 'supervisor_account',
    		 tipoIdentificacion: null,
    		 puedeEditarTelefono: true,
    		 puedeEditarIdentificacion: false,
    		 endpointGet: '/api/coordinador/perfil',
    		 endpointPut: '/api/coordinador/perfil',
    		 campoIdentificacion: null,
    		 backendActivo: true
		},

		admin: {
  			 titulo: 'Mi perfil',
  			 icono: 'admin_panel_settings',
  			 tipoIdentificacion: null,
  			 puedeEditarTelefono: false,
  			 puedeEditarIdentificacion: false,
  			 endpointGet: '/api/admin/perfil',
  			 endpointPut: '/api/admin/perfil',
  			 campoIdentificacion: null,
  			 backendActivo: true
		}
	};

	// =========================================================
	// ESTADO
	// =========================================================

	let cargando = $state(true);
	let guardando = $state(false);

	let nombre = $state('');
	let email = $state('');
	let telefono = $state('');
	let identificacion = $state('');
	let razonSocial = $state('');

	let fotoPreview = $state(null);

	let rolActual = $derived($sesion.rol || '');

	let config = $derived(
		CONFIG_PERFIL[rolActual] || {
			titulo: 'Mi perfil',
			icono: 'person',
			tipoIdentificacion: null,
			puedeEditarTelefono: false,
			puedeEditarIdentificacion: false,
			endpointGet: null,
			endpointPut: null,
			campoIdentificacion: null,
			backendActivo: false
		}
	);

	// =========================================================
	// CARGAR PERFIL
	// =========================================================

	onMount(() => {
		cargarPerfil();
	});

	async function cargarPerfil() {
		cargando = true;

		// Limpiar valores anteriores
		nombre = '';
		email = '';
		telefono = '';
		identificacion = '';
		razonSocial = '';

		try {
			// =====================================================
			// CLIENTE / RESTAURANTE
			// =====================================================

			if (config.backendActivo && config.endpointGet) {
				const datos = await api(config.endpointGet);

				nombre = datos.nombre || '';
				email = datos.email || '';
				telefono = datos.telefono || '';

				if (config.campoIdentificacion) {
					identificacion =
						datos[config.campoIdentificacion] || '';
				}

				// Solo restaurante tiene actualmente razón social
				if (rolActual === 'restaurante') {
					razonSocial = datos.razon_social || '';
				}

				return;
			}

			// =====================================================
			// ROLES QUE TODAVÍA NO TIENEN ENDPOINT DE PERFIL
			// =====================================================

			nombre = $sesion.nombre || '';
			email = $sesion.email || '';

			/*
			 * No inventamos teléfono ni identificación desde /auth/yo.
			 * Esos campos deben venir del endpoint de perfil propio
			 * de cada rol cuando exista.
			 */
			telefono = '';
			identificacion = '';
		} catch (error) {
			console.error('Error cargando perfil:', error);

			mostrarToast(
				'error',
				error?.message || 'No se pudo cargar el perfil'
			);
		} finally {
			cargando = false;
		}
	}

	// =========================================================
	// VOLVER
	// =========================================================

	function volver() {
		const ruta = RUTA_POR_ROL[$sesion.rol] || '/';
		goto(ruta);
	}

	// =========================================================
	// FORMATEAR TELÉFONO
	// =========================================================

	function formatearTelefono(event) {
		let valor = event.target.value
			.replace(/\D/g, '')
			.slice(0, 11);

		if (valor.length > 4) {
			valor =
				valor.slice(0, 4) +
				' ' +
				valor.slice(4);
		}

		telefono = valor;
	}

	// =========================================================
	// FORMATEAR IDENTIFICACIÓN
	// =========================================================

	function formatearIdentificacion(event) {
		let valor = event.target.value
			.toUpperCase()
			.replace(/[^VJGE0-9-]/g, '');

		identificacion = valor;
	}

	// =========================================================
	// VALIDAR TELÉFONO
	// =========================================================

	function validarTelefono() {
		if (!config.puedeEditarTelefono) {
			return { ok: true };
		}

		const limpio = telefono.replace(/\D/g, '');

		if (!limpio) {
			return {
				ok: false,
				mensaje: 'El teléfono es obligatorio'
			};
		}

		if (limpio.length !== 11) {
			return {
				ok: false,
				mensaje: 'El teléfono debe tener 11 dígitos'
			};
		}

		return { ok: true };
	}

	// =========================================================
	// VALIDAR IDENTIFICACIÓN
	// =========================================================

	function validarIdentificacion() {
		if (!config.puedeEditarIdentificacion) {
			return { ok: true };
		}

		if (!identificacion.trim()) {
			return {
				ok: false,
				mensaje: `${config.tipoIdentificacion} es obligatoria`
			};
		}

		return { ok: true };
	}

	// =========================================================
	// GUARDAR
	// =========================================================

	async function guardar() {
		const telefonoValido = validarTelefono();

		if (!telefonoValido.ok) {
			mostrarToast(
				'error',
				telefonoValido.mensaje
			);
			return;
		}

		const identificacionValida =
			validarIdentificacion();

		if (!identificacionValida.ok) {
			mostrarToast(
				'error',
				identificacionValida.mensaje
			);
			return;
		}

		// =====================================================
		// RESTAURANTE
		// =====================================================

		if (rolActual === 'restaurante') {
			guardando = true;

			try {
				const datos = await api(
					'/api/restaurante/perfil',
					{
						metodo: 'PUT',
						cuerpo: {
							telefono: telefono
								.replace(/\s/g, ''),
							rif: identificacion
								.trim()
								.toUpperCase()
						}
					}
				);

				// Actualizar pantalla con respuesta real
				nombre = datos.nombre || '';
				email = datos.email || '';
				telefono = datos.telefono || '';
				identificacion = datos.rif || '';
				razonSocial = datos.razon_social || '';

				mostrarToast(
					'exito',
					'Perfil actualizado correctamente'
				);
			} catch (error) {
				console.error(
					'Error guardando perfil de restaurante:',
					error
				);

				mostrarToast(
					'error',
					error?.message ||
						'No se pudo actualizar el perfil'
				);
			} finally {
				guardando = false;
			}

			return;
		}

		// =====================================================
		// CLIENTE
		// =====================================================

		if (rolActual === 'cliente') {
			guardando = true;

			try {
				await api(
					'/api/cliente/datos-fiscales',
					{
						metodo: 'PUT',
						cuerpo: {
							cedula_rif:
								identificacion
									.trim()
									.toUpperCase(),
							telefono:
								telefono.replace(/\s/g, '')
						}
					}
				);

				mostrarToast(
					'exito',
					'Datos fiscales actualizados correctamente'
				);

				await cargarPerfil();
			} catch (error) {
				console.error(
					'Error guardando perfil de cliente:',
					error
				);

				mostrarToast(
					'error',
					error?.message ||
						'No se pudieron guardar los datos'
				);
			} finally {
				guardando = false;
			}

			return;
		}

		// =====================================================
		// REPARTIDOR / COORDINADOR / ADMIN
		// =====================================================

		mostrarToast(
			'error',
			'El perfil de este rol todavía no tiene un endpoint de edición en el backend'
		);
	}

	// =========================================================
	// FOTO
	// =========================================================

	function cambiarFoto(event) {
		const archivo = event.target.files?.[0];

		if (!archivo) return;

		if (archivo.size > 5 * 1024 * 1024) {
			mostrarToast(
				'error',
				'La imagen no puede pesar más de 5 MB'
			);
			return;
		}

		if (!archivo.type.startsWith('image/')) {
			mostrarToast(
				'error',
				'Selecciona una imagen válida'
			);
			return;
		}

		const reader = new FileReader();

		reader.onload = (e) => {
			fotoPreview = e.target.result;

			mostrarToast(
				'exito',
				'Foto actualizada'
			);
		};

		reader.readAsDataURL(archivo);
	}
</script>


<div class="min-h-screen bg-surface">

	<div class="max-w-[800px] mx-auto px-4 py-6">

		<!-- =====================================================
		     VOLVER
		====================================================== -->

		<button
			type="button"
			onclick={volver}
			class="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary-container transition-colors mb-5"
		>
			<span class="material-symbols-outlined text-[20px]">
				arrow_back
			</span>

			Volver al panel
		</button>


		<!-- =====================================================
		     TÍTULO
		====================================================== -->

		<div class="flex items-center gap-3 mb-6">

			<div
				class="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center"
			>
				<span class="material-symbols-outlined">
					{config.icono}
				</span>
			</div>

			<h1 class="text-2xl font-bold text-on-surface">
				{config.titulo}
			</h1>

		</div>


		{#if cargando}

			<div class="bg-white rounded-2xl shadow-sm p-6">

				<p class="text-sm text-on-surface-variant">
					Cargando información del perfil...
				</p>

			</div>

		{:else}

			<div
				class="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-6"
			>

				<!-- =================================================
				     AVATAR + NOMBRE
				================================================== -->

				<div
					class="flex items-center gap-4 pb-5 border-b border-gray-100"
				>

					<div class="relative">

						{#if fotoPreview}

							<img
								src={fotoPreview}
								alt="Foto de perfil"
								class="w-20 h-20 rounded-full object-cover"
							/>

						{:else}

							<div
								class="w-20 h-20 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-3xl"
							>
								{(nombre || 'U')
									.charAt(0)
									.toUpperCase()}
							</div>

						{/if}


						<label
							class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-surface-container"
							title="Cambiar foto"
						>

							<span
								class="material-symbols-outlined text-[16px]"
							>
								camera_alt
							</span>

							<input
								type="file"
								accept="image/*"
								class="hidden"
								onchange={cambiarFoto}
							/>

						</label>

					</div>


					<div>

						<p class="text-lg font-bold text-on-surface">
							{nombre || 'Usuario'}
						</p>

						<p
							class="text-sm text-on-surface-variant capitalize"
						>
							{rolActual || 'usuario'}
						</p>

					</div>

				</div>


				<!-- =================================================
				     INFORMACIÓN DE CUENTA
				================================================== -->

				<div class="flex flex-col gap-4">

					<h2
						class="text-sm font-bold text-on-surface flex items-center gap-2"
					>

						<span
							class="material-symbols-outlined text-primary-container text-[20px]"
						>
							person
						</span>

						Información de cuenta

					</h2>


					<!-- NOMBRE -->

					<div>

						<label
							class="block text-xs font-semibold text-on-surface-variant mb-1.5"
						>
							Nombre
						</label>

						<input
							type="text"
							value={nombre}
							readonly
							class="w-full h-11 bg-surface-container-low text-on-surface-variant text-sm rounded-lg px-3.5 border border-gray-200 cursor-not-allowed"
						/>

					</div>


					<!-- CORREO -->

					<div>

						<label
							class="block text-xs font-semibold text-on-surface-variant mb-1.5"
						>
							Correo electrónico
						</label>

						<input
							type="email"
							value={email}
							readonly
							class="w-full h-11 bg-surface-container-low text-on-surface-variant text-sm rounded-lg px-3.5 border border-gray-200 cursor-not-allowed"
						/>

					</div>


					<!-- RAZÓN SOCIAL SOLO RESTAURANTE -->

					{#if rolActual === 'restaurante'}

						<div>

							<label
								class="block text-xs font-semibold text-on-surface-variant mb-1.5"
							>
								Razón social
							</label>

							<input
								type="text"
								value={razonSocial}
								readonly
								class="w-full h-11 bg-surface-container-low text-on-surface-variant text-sm rounded-lg px-3.5 border border-gray-200 cursor-not-allowed"
							/>

						</div>

					{/if}

				</div>


				<!-- =================================================
				     DATOS DE CONTACTO
				================================================== -->

				<div
					class="pt-5 border-t border-gray-100 flex flex-col gap-4"
				>

					<h2
						class="text-sm font-bold text-on-surface flex items-center gap-2"
					>

						<span
							class="material-symbols-outlined text-primary-container text-[20px]"
						>
							contact_phone
						</span>

						Datos de contacto

					</h2>


					<!-- TELÉFONO -->

					<div>

						<label
							class="block text-xs font-semibold text-on-surface-variant mb-1.5"
						>
							Teléfono
						</label>

						<div class="flex">

							<div
								class="h-11 bg-surface-container-low text-on-surface-variant text-sm rounded-l-lg px-4 flex items-center border border-r-0 border-gray-200 font-semibold"
							>
								+58
							</div>

							<input
								type="tel"
								value={telefono}
								oninput={formatearTelefono}
								disabled={!config.puedeEditarTelefono}
								class="w-full h-11 text-sm rounded-r-lg px-3.5 border border-gray-200 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 disabled:bg-surface-container-low disabled:text-on-surface-variant disabled:cursor-not-allowed"
								placeholder="0414 1234567"
							/>

						</div>

					</div>


					<!-- IDENTIFICACIÓN -->

					{#if config.tipoIdentificacion}

						<div>

							<label
								class="block text-xs font-semibold text-on-surface-variant mb-1.5"
							>
								{config.tipoIdentificacion}
							</label>

							<input
								type="text"
								value={identificacion}
								oninput={formatearIdentificacion}
								disabled={!config.puedeEditarIdentificacion}
								placeholder={
									config.tipoIdentificacion === 'RIF'
										? 'J-12345678-9'
										: 'V-12345678'
								}
								class="w-full h-11 text-sm rounded-lg px-3.5 border border-gray-200 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 uppercase disabled:bg-surface-container-low disabled:text-on-surface-variant disabled:cursor-not-allowed"
							/>

						</div>

					{/if}

				</div>


				<!-- =================================================
				     AVISO PARA ROLES SIN BACKEND
				================================================== -->

				{#if !config.backendActivo && rolActual !== 'admin'}

					<div
						class="rounded-lg bg-surface-container-low p-3 flex items-start gap-3"
					>

						<span
							class="material-symbols-outlined text-primary-container text-[20px] mt-0.5"
						>
							info
						</span>

						<p class="text-xs text-on-surface-variant">
							El perfil de este rol ya está disponible en la
							interfaz, pero todavía falta conectar su
							endpoint de perfil en el backend.
						</p>

					</div>

				{/if}


				<!-- =================================================
				     ADMIN SIN EDICIÓN
				================================================== -->

				{#if rolActual === 'admin'}

					<div
						class="rounded-lg bg-surface-container-low p-3 flex items-start gap-3"
					>

						<span
							class="material-symbols-outlined text-primary-container text-[20px] mt-0.5"
						>
							info
						</span>

						<p class="text-xs text-on-surface-variant">
							La información de administrador se muestra desde
							la sesión autenticada. No hay campos editables
							hasta que exista un endpoint de perfil para este rol.
						</p>

					</div>

				{/if}


				<!-- =================================================
				     GUARDAR
				================================================== -->

				{#if config.puedeEditarTelefono || config.puedeEditarIdentificacion}

					<button
						type="button"
						onclick={guardar}
						disabled={
							guardando ||
							!config.backendActivo
						}
						class="w-full h-12 bg-primary-container hover:bg-primary disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-lg transition-colors"
					>

						{#if guardando}

							<span class="flex items-center justify-center gap-2">

								<span
									class="material-symbols-outlined animate-spin text-[18px]"
								>
									progress_activity
								</span>

								Guardando...

							</span>

						{:else}

							Guardar cambios

						{/if}

					</button>

				{/if}

			</div>

		{/if}

	</div>

</div>