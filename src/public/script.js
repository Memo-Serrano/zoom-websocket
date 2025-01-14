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
  signature: 'VUVFYk9vdVQwd1dDMTRvcGY2NncuODc0MjM5Njc4MzIuMTczNjgxNzI5MTg5Ny4xLitnUUxpUklHRGI3RmJHek5CYTlYSTR0YWZaQjhPQ2d3Rkd2ZWdSaEFORlE9',
  meetingNumber: '87423967832',
  password: '718510',
  userName: 'Invitado',
});
