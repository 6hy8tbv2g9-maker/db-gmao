// ═══════════════════════════════════════════
// Service Worker GMAO - Notifications push
// ═══════════════════════════════════════════

// Activation immédiate (pas d'attente)
self.addEventListener('install', (event) => {
self.skipWaiting();
});

self.addEventListener('activate', (event) => {
event.waitUntil(self.clients.claim());
});

// Réception d'une notification push
self.addEventListener('push', (event) => {
let data = { title: 'GMAO', body: 'Nouvelle notification', url: './NewGMAO.html' };
try {
if (event.data) {
data = { ...data, ...event.data.json() };
}
} catch (e) {
if (event.data) data.body = event.data.text();
}

const options = {
body: data.body,
icon: data.icon || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' rx='40' fill='%230d1117'/%3E%3Ctext x='90' y='120' text-anchor='middle' font-family='system-ui' font-weight='700' font-size='72' fill='%23e8970a'%3E%E2%9A%99%3C/text%3E%3C/svg%3E",
badge: data.badge,
tag: data.tag || 'gmao-ot',
data: { url: data.url || './NewGMAO.html' },
vibrate: [100, 50, 100],
requireInteraction: false,
};

event.waitUntil(self.registration.showNotification(data.title, options));
});

// Clic sur la notification : ouvrir / focaliser l'app
self.addEventListener('notificationclick', (event) => {
event.notification.close();
const targetUrl = (event.notification.data && event.notification.data.url) || './NewGMAO.html';

event.waitUntil(
self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
// Si une fenêtre de l'app est déjà ouverte, la focaliser
for (const client of clientList) {
if ('focus' in client) {
client.focus();
return;
}
}
// Sinon, ouvrir une nouvelle fenêtre
if (self.clients.openWindow) {
return self.clients.openWindow(targetUrl);
}
})
);
});
