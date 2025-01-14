const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const socket = new WebSocket(`${protocol}://${window.location.host}`);

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
  signature: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBLZXkiOiJVRUViT291VDB3V0MxNG9wZjY2dyIsInNka0tleSI6IlVFRWJPb3VUMHdXQzE0b3BmNjZ3IiwibW4iOiI4NzQyMzk2NzgzMiIsInJvbGUiOjAsInRva2VuRXhwIjoxNzM2ODQyMTI4LCJpYXQiOjE3MzY4Mzg1MjgsImV4cCI6MTczNjg0MjEyOH0.KMuh4K9yuz8slwUiDKjmCVO9Il-kDdhtV3e8KN-DvYk',
  meetingNumber: '87423967832',
  password: '718510',
  userName: 'Invitado',
});
