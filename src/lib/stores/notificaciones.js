import { writable, derived } from 'svelte/store';

// Estructura de una notificación:
// { id, titulo, mensaje, fecha (ISO), leida (bool), tipo ('pedido'|'oferta'|'info') }

const iniciales = [
	{
		id: 1,
		titulo: 'Pedido confirmado',
		mensaje: 'Tu pedido #18 fue recibido por el restaurante',
		fecha: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
		leida: false,
		tipo: 'pedido'
	},
	{
		id: 2,
		titulo: 'Repartidor en camino',
		mensaje: 'Carlos M. retiró tu pedido y va hacia tu dirección',
		fecha: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
		leida: false,
		tipo: 'pedido'
	}
];

export const notificaciones = writable(iniciales);

// Cantidad de no leídas (se recalcula solo)
export const noLeidas = derived(notificaciones, ($n) =>
	$n.filter((x) => !x.leida).length
);

// Agregar notificación (útil para cuando llegue WS "pedido")
export function agregarNotificacion({ titulo, mensaje, tipo = 'info' }) {
	notificaciones.update((lista) => [
		{
			id: Date.now(),
			titulo,
			mensaje,
			fecha: new Date().toISOString(),
			leida: false,
			tipo
		},
		...lista
	]);
}

// Marcar todas como leídas (se llama al abrir el panel)
export function marcarTodasLeidas() {
	notificaciones.update((lista) => lista.map((n) => ({ ...n, leida: true })));
}

// Eliminar una
export function eliminarNotificacion(id) {
	notificaciones.update((lista) => lista.filter((n) => n.id !== id));
}

// Vaciar todas
export function vaciarNotificaciones() {
	notificaciones.set([]);
}

// Formato "hace X min"
export function tiempoRelativo(iso) {
	const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
	if (diff < 60) return 'hace unos segundos';
	if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
	if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
	return `hace ${Math.floor(diff / 86400)} d`;
}