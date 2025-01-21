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

document.getElementById('toggleButton3').addEventListener('click', () => {
  toggleElement('timer1', true);
});

document.getElementById('hideButton3').addEventListener('click', () => {
  toggleElement('timer1', false);
});

document.getElementById('toggleButton4').addEventListener('click', () => {
  toggleElement('timer2', true);
});

document.getElementById('hideButton4').addEventListener('click', () => {
  toggleElement('timer2', false);
});

document.getElementById('toggleButton5').addEventListener('click', () => {
  toggleElement('timer3', true);
});

document.getElementById('hideButton5').addEventListener('click', () => {
  toggleElement('timer3', false);
});

document.getElementById('toggleButton6').addEventListener('click', () => {
  toggleElement('timer4', true);
});

document.getElementById('hideButton6').addEventListener('click', () => {
  toggleElement('timer4', false);
});

document.getElementById('toggleButton7').addEventListener('click', () => {
  toggleElement('timer5', true);
});

document.getElementById('hideButton7').addEventListener('click', () => {
  toggleElement('timer5', false);
});
