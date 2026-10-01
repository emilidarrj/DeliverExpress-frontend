// Pedidos falsos para desarrollo del panel del repartidor y coordinador.
// Cuando el backend esté listo, esto se reemplaza por llamadas a la API.

export const PEDIDOS_REPARTIDOR_DEMO = [
  {
    id_pedido: 101,
    estado: 'listo_para_retirar',
    restaurante: {
      nombre: 'Burger Artisan Lab',
      direccion: 'Av. Principal, Local 3, Puerto Ordaz',
      telefono: '+58 414-1234567',
      latitud: 8.2865,
      longitud: -62.7189
    },
    cliente: {
      nombre: 'Carlos Mendoza',
      telefono: '+58 424-9876543',
      direccion: 'Calle Los Olivos, Casa 12, Puerto Ordaz',
      latitud: 8.2915,
      longitud: -62.7135,
      referencia: 'Frente a la panaderia'
    },
    productos: [
      { nombre: 'Hamburguesa clasica', cantidad: 2 },
      { nombre: 'Papas fritas grandes', cantidad: 1 }
    ],
    distancia_km: 1.8,
    tiempo_estimado_min: 25,
    costo_envio: 2.5,
    propina: 1.0,
    subtotal: 12.5,
    total: 16.0
  },
  {
    id_pedido: 102,
    estado: 'en_camino',
    restaurante: {
      nombre: 'Pizzeria Napoli',
      direccion: 'Av. Guayana, CC Orinoco, Puerto Ordaz',
      telefono: '+58 414-5555555',
      latitud: 8.2795,
      longitud: -62.7289
    },
    cliente: {
      nombre: 'Ana Rodriguez',
      telefono: '+58 424-1111111',
      direccion: 'Res. Villa Nueva, Torre B, Apto 502, Puerto Ordaz',
      latitud: 8.2955,
      longitud: -62.7055,
      referencia: 'Porton azul'
    },
    productos: [
      { nombre: 'Pizza margarita', cantidad: 1 },
      { nombre: 'Refresco 2L', cantidad: 1 }
    ],
    distancia_km: 3.2,
    tiempo_estimado_min: 35,
    costo_envio: 3.5,
    propina: 0,
    subtotal: 10.0,
    total: 13.5
  }
];

export const PEDIDOS_ACTIVOS_COORDINADOR_DEMO = [
  ...PEDIDOS_REPARTIDOR_DEMO,
  {
    id_pedido: 103,
    estado: 'en_preparacion',
    restaurante: {
      nombre: 'Sushi Tokio',
      direccion: 'Av. Atlantico, Puerto Ordaz',
      latitud: 8.2880,
      longitud: -62.7200
    },
    repartidor: null,
    cliente: {
      nombre: 'Luis Perez',
      direccion: 'Calle 5, Casa 8, Puerto Ordaz',
      latitud: 8.2900,
      longitud: -62.7100
    },
    distancia_km: 2.1,
    tiempo_estimado_min: 30,
    total: 18.0
  }
];
