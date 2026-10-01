// Historial de pedidos del cliente.
// Cuando el backend esté listo: GET /api/cliente/pedidos (lista) y GET /api/cliente/pedidos/{id} (detalle)

const REST_INFO = {
	1: { nombre: 'Burger Artisan Lab', imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80' },
	4: { nombre: 'Bella Napoli Trattoria', imagen: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80' },
	6: { nombre: 'Tacos El Auténtico', imagen: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&q=80' },
	8: { nombre: 'Tokyo Sushi Bar', imagen: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&q=80' },
	10: { nombre: 'Green Bowl Deli', imagen: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80' },
	12: { nombre: 'Cafeína Roast & Bakery', imagen: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80' },
	14: { nombre: 'Crispy Chicken Co.', imagen: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200&q=80' },
	16: { nombre: 'Wok Express Asiático', imagen: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&q=80' }
};

// Helper: fecha hace N horas / días
const haceHoras = (h) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
const haceDias = (d) => haceHoras(d * 24);

export const PEDIDOS = [
	// ══════════════════════════════════════════════
	// #18 — EN CAMINO (Activo)
	// ══════════════════════════════════════════════
	{
		id_pedido: 18,
		id_estado: 4,
		estado_codigo: 'en_camino',
		estado_nombre: 'En camino',
		fecha_creacion: haceHoras(1),
		subtotal: 22.0,
		costo_envio: 2.0,
		propina: 2.0,
		iva_total: 3.84,
		igtf: 0.90,
		total: 30.74,
		moneda_pago: 'USD',
		tasa_bcv_aplicada: 38.5,
		total_ves: 1183.49,
		id_factura: null,
		distancia_km: 1.4,
		tiempo_estimado_min: 30,
		motivo_cancelacion: null,
		id_restaurante: 1,
		...REST_INFO[1],
		repartidor: {
			id_repartidor: 5,
			nombre: 'Carlos Méndez',
			telefono: '+58 412 889-1234',
			tipo_vehiculo: 'Moto Honda Cargo 150cc',
			calificacion_promedio: 4.9,
			latitud_actual: 8.295,
			longitud_actual: -62.735
		},
		detalle: [
			{ id_producto: 1, nombre: 'Doble Bacon Smash Burger', cantidad: 2, precio_unitario: 8.5, subtotal: 17.0 },
			{ id_producto: 4, nombre: 'Papas Rústicas Trufadas', cantidad: 1, precio_unitario: 3.2, subtotal: 3.2 },
			{ id_producto: 6, nombre: 'Bebida Refrescante 500ml', cantidad: 1, precio_unitario: 1.8, subtotal: 1.8 }
		],
		historial: [
			{ id_estado: 1, estado_codigo: 'recibido', estado_nombre: 'Recibido', fecha_hora: haceHoras(1) },
			{ id_estado: 2, estado_codigo: 'en_preparacion', estado_nombre: 'En preparación', fecha_hora: haceHoras(0.9) },
			{ id_estado: 3, estado_codigo: 'listo_para_retirar', estado_nombre: 'Listo para retirar', fecha_hora: haceHoras(0.55) },
			{ id_estado: 4, estado_codigo: 'en_camino', estado_nombre: 'En camino', fecha_hora: haceHoras(0.35) }
		],
		calificaciones_hechas: []
	},

	// ══════════════════════════════════════════════
	// #17 — EN PREPARACIÓN (Activo)
	// ══════════════════════════════════════════════
	{
		id_pedido: 17,
		id_estado: 2,
		estado_codigo: 'en_preparacion',
		estado_nombre: 'En preparación',
		fecha_creacion: haceHoras(2),
		subtotal: 15.2,
		costo_envio: 1.5,
		propina: 1.0,
		iva_total: 2.67,
		igtf: 0.61,
		total: 20.98,
		moneda_pago: 'USD',
		tasa_bcv_aplicada: 38.5,
		total_ves: 807.73,
		id_factura: null,
		distancia_km: 2.6,
		tiempo_estimado_min: 38,
		motivo_cancelacion: null,
		id_restaurante: 4,
		...REST_INFO[4],
		repartidor: null,
		detalle: [
			{ id_producto: 30, nombre: 'Pizza Margherita D.O.P', cantidad: 1, precio_unitario: 11.2, subtotal: 11.2 },
			{ id_producto: 32, nombre: 'Focaccia Romero', cantidad: 1, precio_unitario: 4.0, subtotal: 4.0 }
		],
		historial: [
			{ id_estado: 1, estado_codigo: 'recibido', estado_nombre: 'Recibido', fecha_hora: haceHoras(2) },
			{ id_estado: 2, estado_codigo: 'en_preparacion', estado_nombre: 'En preparación', fecha_hora: haceHoras(1.9) }
		],
		calificaciones_hechas: []
	},

	// ══════════════════════════════════════════════
	// #16 — RECIBIDO (Activo)
	// ══════════════════════════════════════════════
	{
		id_pedido: 16,
		id_estado: 1,
		estado_codigo: 'recibido',
		estado_nombre: 'Recibido',
		fecha_creacion: haceHoras(0.2),
		subtotal: 13.0,
		costo_envio: 1.2,
		propina: 2.0,
		iva_total: 2.27,
		igtf: 0.55,
		total: 19.02,
		moneda_pago: 'USD',
		tasa_bcv_aplicada: 38.5,
		total_ves: 732.27,
		id_factura: null,
		distancia_km: 1.8,
		tiempo_estimado_min: 24,
		motivo_cancelacion: null,
		id_restaurante: 6,
		...REST_INFO[6],
		repartidor: null,
		detalle: [
			{ id_producto: 50, nombre: 'Tacos al Pastor (x3)', cantidad: 2, precio_unitario: 6.5, subtotal: 13.0 }
		],
		historial: [
			{ id_estado: 1, estado_codigo: 'recibido', estado_nombre: 'Recibido', fecha_hora: haceHoras(0.2) }
		],
		calificaciones_hechas: []
	},

	// ══════════════════════════════════════════════
	// #15 — ENTREGADO (con factura)
	// ══════════════════════════════════════════════
	{
		id_pedido: 15,
		id_estado: 5,
		estado_codigo: 'entregado',
		estado_nombre: 'Entregado',
		fecha_creacion: haceDias(1),
		subtotal: 20.0,
		costo_envio: 2.0,
		propina: 3.0,
		iva_total: 3.52,
		igtf: 0.85,
		total: 29.37,
		moneda_pago: 'USD',
		tasa_bcv_aplicada: 38.5,
		total_ves: 1130.75,
		id_factura: 1001,
		distancia_km: 3.5,
		tiempo_estimado_min: 42,
		motivo_cancelacion: null,
		id_restaurante: 8,
		...REST_INFO[8],
		repartidor: {
			id_repartidor: 5,
			nombre: 'Carlos Méndez',
			telefono: '+58 412 889-1234',
			tipo_vehiculo: 'Moto Honda Cargo 150cc',
			calificacion_promedio: 4.9
		},
		detalle: [
			{ id_producto: 70, nombre: 'Roll California Ebi', cantidad: 2, precio_unitario: 10.0, subtotal: 20.0 }
		],
		historial: [
			{ id_estado: 1, estado_codigo: 'recibido', estado_nombre: 'Recibido', fecha_hora: haceDias(1) },
			{ id_estado: 2, estado_codigo: 'en_preparacion', estado_nombre: 'En preparación', fecha_hora: haceHoras(23.9) },
			{ id_estado: 3, estado_codigo: 'listo_para_retirar', estado_nombre: 'Listo para retirar', fecha_hora: haceHoras(23.5) },
			{ id_estado: 4, estado_codigo: 'en_camino', estado_nombre: 'En camino', fecha_hora: haceHoras(23.3) },
			{ id_estado: 5, estado_codigo: 'entregado', estado_nombre: 'Entregado', fecha_hora: haceHoras(23) }
		],
		calificaciones_hechas: []
	},

	// ══════════════════════════════════════════════
	// #14 — ENTREGADO (con factura)
	// ══════════════════════════════════════════════
	{
		id_pedido: 14,
		id_estado: 5,
		estado_codigo: 'entregado',
		estado_nombre: 'Entregado',
		fecha_creacion: haceDias(3),
		subtotal: 18.4,
		costo_envio: 0,
		propina: 2.0,
		iva_total: 2.94,
		igtf: 0.70,
		total: 24.04,
		moneda_pago: 'USD',
		tasa_bcv_aplicada: 38.5,
		total_ves: 925.54,
		id_factura: 1002,
		distancia_km: 2.2,
		tiempo_estimado_min: 26,
		motivo_cancelacion: null,
		id_restaurante: 10,
		...REST_INFO[10],
		repartidor: {
			id_repartidor: 7,
			nombre: 'Andrés Torres',
			telefono: '+58 414 555-7788',
			tipo_vehiculo: 'Bicicleta',
			calificacion_promedio: 4.7
		},
		detalle: [
			{ id_producto: 90, nombre: 'Poke Bowl Salmón Fresh', cantidad: 1, precio_unitario: 9.9, subtotal: 9.9 },
			{ id_producto: 91, nombre: 'Salad Bowl Quinoa', cantidad: 1, precio_unitario: 8.5, subtotal: 8.5 }
		],
		historial: [
			{ id_estado: 1, estado_codigo: 'recibido', estado_nombre: 'Recibido', fecha_hora: haceDias(3) },
			{ id_estado: 2, estado_codigo: 'en_preparacion', estado_nombre: 'En preparación', fecha_hora: haceHoras(71.8) },
			{ id_estado: 3, estado_codigo: 'listo_para_retirar', estado_nombre: 'Listo para retirar', fecha_hora: haceHoras(71.5) },
			{ id_estado: 4, estado_codigo: 'en_camino', estado_nombre: 'En camino', fecha_hora: haceHoras(71.3) },
			{ id_estado: 5, estado_codigo: 'entregado', estado_nombre: 'Entregado', fecha_hora: haceHoras(71) }
		],
		calificaciones_hechas: []
	},

	// ══════════════════════════════════════════════
	// #13 — ENTREGADO (con factura)
	// ══════════════════════════════════════════════
	{
		id_pedido: 13,
		id_estado: 5,
		estado_codigo: 'entregado',
		estado_nombre: 'Entregado',
		fecha_creacion: haceDias(5),
		subtotal: 15.8,
		costo_envio: 1.5,
		propina: 0,
		iva_total: 2.77,
		igtf: 0.60,
		total: 20.67,
		moneda_pago: 'USD',
		tasa_bcv_aplicada: 38.2,
		total_ves: 789.59,
		id_factura: 1003,
		distancia_km: 3.3,
		tiempo_estimado_min: 30,
		motivo_cancelacion: null,
		id_restaurante: 14,
		...REST_INFO[14],
		repartidor: {
			id_repartidor: 9,
			nombre: 'Manuel Gómez',
			telefono: '+58 416 222-3344',
			tipo_vehiculo: 'Moto',
			calificacion_promedio: 4.5
		},
		detalle: [
			{ id_producto: 130, nombre: 'Crispy Chicken Burger', cantidad: 2, precio_unitario: 7.9, subtotal: 15.8 }
		],
		historial: [
			{ id_estado: 1, estado_codigo: 'recibido', estado_nombre: 'Recibido', fecha_hora: haceDias(5) },
			{ id_estado: 2, estado_codigo: 'en_preparacion', estado_nombre: 'En preparación', fecha_hora: haceHoras(119.8) },
			{ id_estado: 3, estado_codigo: 'listo_para_retirar', estado_nombre: 'Listo para retirar', fecha_hora: haceHoras(119.5) },
			{ id_estado: 4, estado_codigo: 'en_camino', estado_nombre: 'En camino', fecha_hora: haceHoras(119.3) },
			{ id_estado: 5, estado_codigo: 'entregado', estado_nombre: 'Entregado', fecha_hora: haceHoras(119) }
		],
		calificaciones_hechas: ['cliente_a_repartidor', 'cliente_a_restaurante']
	},

	// ══════════════════════════════════════════════
	// #12 — ENTREGADO (con factura)
	// ══════════════════════════════════════════════
	{
		id_pedido: 12,
		id_estado: 5,
		estado_codigo: 'entregado',
		estado_nombre: 'Entregado',
		fecha_creacion: haceDias(8),
		subtotal: 9.0,
		costo_envio: 0,
		propina: 1.0,
		iva_total: 1.44,
		igtf: 0.34,
		total: 11.78,
		moneda_pago: 'USD',
		tasa_bcv_aplicada: 38.0,
		total_ves: 447.64,
		id_factura: 1004,
		distancia_km: 1.5,
		tiempo_estimado_min: 18,
		motivo_cancelacion: null,
		id_restaurante: 12,
		...REST_INFO[12],
		repartidor: null,
		detalle: [
			{ id_producto: 110, nombre: 'Flat White + Croissant', cantidad: 1, precio_unitario: 5.5, subtotal: 5.5 },
			{ id_producto: 111, nombre: 'Cappuccino Vainilla', cantidad: 1, precio_unitario: 3.5, subtotal: 3.5 }
		],
		historial: [
			{ id_estado: 1, estado_codigo: 'recibido', estado_nombre: 'Recibido', fecha_hora: haceDias(8) },
			{ id_estado: 2, estado_codigo: 'en_preparacion', estado_nombre: 'En preparación', fecha_hora: haceHoras(191.9) },
			{ id_estado: 3, estado_codigo: 'listo_para_retirar', estado_nombre: 'Listo para retirar', fecha_hora: haceHoras(191.7) },
			{ id_estado: 4, estado_codigo: 'en_camino', estado_nombre: 'En camino', fecha_hora: haceHoras(191.6) },
			{ id_estado: 5, estado_codigo: 'entregado', estado_nombre: 'Entregado', fecha_hora: haceHoras(191.5) }
		],
		calificaciones_hechas: ['cliente_a_repartidor']
	},

	// ══════════════════════════════════════════════
	// #11 — CANCELADO
	// ══════════════════════════════════════════════
	{
		id_pedido: 11,
		id_estado: 6,
		estado_codigo: 'cancelado',
		estado_nombre: 'Cancelado',
		fecha_creacion: haceDias(10),
		subtotal: 17.0,
		costo_envio: 1.5,
		propina: 0,
		iva_total: 2.96,
		igtf: 0,
		total: 21.46,
		moneda_pago: 'VES',
		tasa_bcv_aplicada: 38.0,
		total_ves: 815.48,
		id_factura: null,
		distancia_km: 2.7,
		tiempo_estimado_min: 35,
		motivo_cancelacion: 'El restaurante cerró por mantenimiento',
		id_restaurante: 16,
		...REST_INFO[16],
		repartidor: null,
		detalle: [
			{ id_producto: 150, nombre: 'Pad Thai Mixto', cantidad: 1, precio_unitario: 9.5, subtotal: 9.5 },
			{ id_producto: 151, nombre: 'Rollitos Primavera x4', cantidad: 1, precio_unitario: 4.5, subtotal: 4.5 }
		],
		historial: [
			{ id_estado: 1, estado_codigo: 'recibido', estado_nombre: 'Recibido', fecha_hora: haceDias(10) },
			{ id_estado: 6, estado_codigo: 'cancelado', estado_nombre: 'Cancelado', fecha_hora: haceHoras(239.5) }
		],
		calificaciones_hechas: []
	},

	// ══════════════════════════════════════════════
	// #10 — CANCELADO
	// ══════════════════════════════════════════════
	{
		id_pedido: 10,
		id_estado: 6,
		estado_codigo: 'cancelado',
		estado_nombre: 'Cancelado',
		fecha_creacion: haceDias(15),
		subtotal: 11.0,
		costo_envio: 2.0,
		propina: 0,
		iva_total: 2.08,
		igtf: 0,
		total: 15.08,
		moneda_pago: 'VES',
		tasa_bcv_aplicada: 37.5,
		total_ves: 565.50,
		id_factura: null,
		distancia_km: 4.1,
		tiempo_estimado_min: 40,
		motivo_cancelacion: 'Cancelado por el cliente',
		id_restaurante: 4,
		...REST_INFO[4],
		repartidor: null,
		detalle: [
			{ id_producto: 30, nombre: 'Pizza Margherita D.O.P', cantidad: 1, precio_unitario: 11.0, subtotal: 11.0 }
		],
		historial: [
			{ id_estado: 1, estado_codigo: 'recibido', estado_nombre: 'Recibido', fecha_hora: haceDias(15) },
			{ id_estado: 6, estado_codigo: 'cancelado', estado_nombre: 'Cancelado', fecha_hora: haceHoras(359.8) }
		],
		calificaciones_hechas: []
	}
];

// ───── Helpers (por si otros componentes los necesitan) ─────

export function filtrarPedidos(categoria) {
	if (!categoria || categoria === 'todos') return PEDIDOS;
	if (categoria === 'activos') return PEDIDOS.filter((p) => [1, 2, 3, 4].includes(p.id_estado));
	if (categoria === 'entregados') return PEDIDOS.filter((p) => p.id_estado === 5);
	if (categoria === 'cancelados') return PEDIDOS.filter((p) => p.id_estado === 6);
	return PEDIDOS;
}

export function contarPorCategoria() {
	return {
		todos: PEDIDOS.length,
		activos: PEDIDOS.filter((p) => [1, 2, 3, 4].includes(p.id_estado)).length,
		entregados: PEDIDOS.filter((p) => p.id_estado === 5).length,
		cancelados: PEDIDOS.filter((p) => p.id_estado === 6).length
	};
}