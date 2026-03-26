// Nombre del caché.
// Cuando actualices la app cámbialo a 'agenda-v2', etc.
// Cambiar el nombre obliga al SW a descargar archivos frescos.
const CACHE = 'agenda-v1';

// Lista de archivos a guardar en el dispositivo.
// Nota: ya no incluimos style.css ni app.js porque ahora
// todo está dentro de index.html.
const ARCHIVOS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];


// ── EVENTO: install ──────────────────────────────────
// Primera vez que el SW se instala.
// waitUntil: "no termines hasta que esta promesa se resuelva".
self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(CACHE)
      .then(cache => {
        console.log('📦 Guardando archivos...');
        return cache.addAll(ARCHIVOS); // descarga y guarda cada archivo
      })
  );
});


// ── EVENTO: activate ─────────────────────────────────
// El SW toma el control. Borramos cachés viejos.
self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys()
      .then(nombres =>
        Promise.all(
          nombres
            .filter(n => n !== CACHE)    // los que NO son el caché actual
            .map(n    => caches.delete(n)) // los borra
        )
      )
  );
});


// ── EVENTO: fetch ────────────────────────────────────
// Cada vez que la app pide cualquier recurso.
// Estrategia "Cache First":
//   1. Busca en caché → devuelve sin internet.
//   2. Si no está → pide al servidor.
self.addEventListener('fetch', evento => {
  evento.respondWith(
    caches.match(evento.request)
      .then(respuesta => respuesta || fetch(evento.request))
  );
});