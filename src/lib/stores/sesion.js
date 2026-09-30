import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const inicial = { token: null, rol: null, id_perfil: null, nombre: null };

export const sesion = writable(inicial);

export function cargarSesion() {
  if (!browser) return;
  const raw = localStorage.getItem('sesion');
  if (raw) sesion.set(JSON.parse(raw));
}

export function iniciarSesion(data) {
  sesion.set(data);
  if (browser) localStorage.setItem('sesion', JSON.stringify(data));
}

export function cerrarSesion() {
  sesion.set(inicial);
  if (browser) localStorage.removeItem('sesion');
}

export const RUTA_POR_ROL = {
  cliente:     '/cliente',
  restaurante: '/restaurante',
  repartidor:  '/repartidor',
  coordinador: '/coordinador',
  admin:       '/admin'
};