import { initializeZoomMeeting } from './zoom.js';

// Detectar si está en local o en producción
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const socketUrl = isProduction ? 'wss://test-boton-ptop.onrender.com' : 'ws://localhost:3000';

const socket = new WebSocket(socketUrl);

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message === 'showButton') {
    document.getElementById('hiddenButton').style.display = 'block';
  }
};

// Inicializar el Zoom Meeting
initializeZoomMeeting();
