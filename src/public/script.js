// Detectar si está en local o en producción
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const socketUrl = isProduction ? 'wss://test-boton-ptop.onrender.com' : 'ws://localhost:3000';

const socket = new WebSocket(socketUrl);

// Manejar mensajes recibidos del servidor WebSocket
socket.onmessage = (event) => {
  if (event.data === 'showButton') {
    const hiddenButton = document.getElementById('hiddenButton');
    if (hiddenButton) {
      hiddenButton.style.display = 'block';
    }
  }
};

// Manejar clic en el botón de page2.html
const showButton = document.getElementById('showButton');
if (showButton) {
  showButton.addEventListener('click', () => {
    socket.send('showButton');
  });
}

// Usa ZoomMtgEmbedded desde el global window object
const { ZoomMtgEmbedded } = window;

const client = ZoomMtgEmbedded.createClient();

const meetingSDKElement = document.getElementById('zoomMeetingContainer');

client.init({
  debug: true,
  zoomAppRoot: meetingSDKElement,
  language: 'en-US',
});

client.join({
  sdkKey: 'UEEbOouT0wWC14opf66w',
  signature: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBLZXkiOiJVRUViT291VDB3V0MxNG9wZjY2dyIsInNka0tleSI6IlVFRWJPb3VUMHdXQzE0b3BmNjZ3IiwibW4iOiI4NzQyMzk2NzgzMiIsInJvbGUiOjAsInRva2VuRXhwIjoxNzM2ODQyMTI4LCJpYXQiOjE3MzY4Mzg1MjgsImV4cCI6MTczNjg0MjEyOH0.KMuh4K9yuz8slwUiDKjmCVO9Il-kDdhtV3e8KN-DvYk',
  meetingNumber: '87423967832',
  password: '718510',
  userName: 'Invitado',
});
