// Detectar si está en local o en producción
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const socketUrl = isProduction ? 'wss://test-boton-ptop.onrender.com' : 'ws://localhost:3000';

const socket = new WebSocket(socketUrl);

// Función para enviar comandos al servidor
function toggleElement(elementId, visible) {
  socket.send(JSON.stringify({ action: 'toggleElement', element: elementId, visible }));
}

// Eventos para controlar los botones
document.getElementById('toggleButton1').addEventListener('click', () => {
  toggleElement('cta1', true);
});

document.getElementById('hideButton1').addEventListener('click', () => {
  toggleElement('cta1', false);
});

document.getElementById('toggleButton2').addEventListener('click', () => {
  toggleElement('cta2', true);
});

document.getElementById('hideButton2').addEventListener('click', () => {
  toggleElement('cta2', false);
});
