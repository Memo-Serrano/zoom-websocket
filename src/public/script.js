const ws = new WebSocket('wss://' + window.location.host);
const dynamicButton = document.getElementById('dynamicButton');

// Mostrar el botón cuando se reciba el mensaje
ws.onmessage = (event) => {
  if (event.data === 'showButton') {
    dynamicButton.style.display = 'block';
  }
};

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
  signature: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBLZXkiOiJVRUViT291VDB3V0MxNG9wZjY2dyIsImlhdCI6MTczNjgzNzk3NTU3MiwiZXhwIjoxNzM2ODQyOTc1NTcyLCJ0cGMiOiIxMjM0NTY3ODkiLCJyb2xlIjoxfQ.hNNFxMH6WzE3pIYFAvMhRGVlOOhlDUywA25xNKJJpGM',
  meetingNumber: '87423967832',
  password: '718510',
  userName: 'Invitado',
});
