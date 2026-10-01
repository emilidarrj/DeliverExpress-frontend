// Repartidores demo para el panel de coordinadores.
// Cuando el backend esté listo, se reemplaza por GET /api/coordinador/repartidores

export const REPARTIDORES_DISPONIBLES_DEMO = [
  {
    id_repartidor: 1,
    nombre: 'Carlos Mendoza',
    iniciales: 'CM',
    vehiculo: 'moto',
    zona: 'Zona Centro',
    disponibilidad: 'libre',
    calificacion_promedio: 4.9,
    latitud_actual: 8.2900,
    longitud_actual: -62.7150
  },
  {
    id_repartidor: 2,
    nombre: 'Lucía Rodríguez',
    iniciales: 'LR',
    vehiculo: 'bicicleta',
    zona: 'Zona Palermo / Norte',
    disponibilidad: 'libre',
    calificacion_promedio: 4.8,
    latitud_actual: 8.2950,
    longitud_actual: -62.7200
  },
  {
    id_repartidor: 3,
    nombre: 'Mateo Gómez',
    iniciales: 'MG',
    vehiculo: 'moto',
    zona: 'Zona Oeste',
    disponibilidad: 'ocupado',
    calificacion_promedio: 4.7,
    latitud_actual: 8.2880,
    longitud_actual: -62.7280
  },
  {
    id_repartidor: 4,
    nombre: 'Sofía Peralta',
    iniciales: 'SP',
    vehiculo: 'auto',
    zona: 'Zona Sur',
    disponibilidad: 'libre',
    calificacion_promedio: 5.0,
    latitud_actual: 8.2820,
    longitud_actual: -62.7100
  },
  {
    id_repartidor: 5,
    nombre: 'Andrés Vargas',
    iniciales: 'AV',
    vehiculo: 'bicicleta',
    zona: 'Zona Centro',
    disponibilidad: 'libre',
    calificacion_promedio: 4.8,
    latitud_actual: 8.2930,
    longitud_actual: -62.7080
  },
  {
    id_repartidor: 6,
    nombre: 'Diego Silva',
    iniciales: 'DS',
    vehiculo: 'moto',
    zona: 'Zona Este',
    disponibilidad: 'ocupado',
    calificacion_promedio: 4.6,
    latitud_actual: 8.2860,
    longitud_actual: -62.7050
  },
  {
    id_repartidor: 7,
    nombre: 'Elena Torres',
    iniciales: 'ET',
    vehiculo: 'bicicleta',
    zona: 'Zona Norte',
    disponibilidad: 'libre',
    calificacion_promedio: 4.9,
    latitud_actual: 8.2980,
    longitud_actual: -62.7180
  }
];

// Restaurantes con coordenadas para el mapa
export const RESTAURANTES_MAPA_DEMO = [
  { id_restaurante: 1, nombre: 'Pizzería Bella', latitud: 8.2910, longitud: -62.7150, categoria: 'Italiana' },
  { id_restaurante: 2, nombre: 'Burger Craze', latitud: 8.2850, longitud: -62.7080, categoria: 'Hamburguesas' },
  { id_restaurante: 3, nombre: 'Sushi Master', latitud: 8.2960, longitud: -62.7220, categoria: 'Sushi' },
  { id_restaurante: 4, nombre: 'Tacos El Rey', latitud: 8.2830, longitud: -62.7140, categoria: 'Mexicana' },
  { id_restaurante: 5, nombre: 'Green Bowl Deli', latitud: 8.2900, longitud: -62.7060, categoria: 'Saludable' }
];