const ws = new WebSocket('wss://' + window.location.host);
const dynamicButton = document.getElementById('dynamicButton');

// Mostrar el botón cuando se reciba el mensaje
ws.onmessage = (event) => {
  if (event.data === 'showButton') {
    dynamicButton.style.display = 'block';
  }
};

// Zoom Meeting SDK
import { ZoomMtgEmbedded } from '@zoomus/websdk';

const client = ZoomMtgEmbedded.createClient();
const meetingSDKElement = document.getElementById('zoomMeetingContainer');

client.init({
  debug: true,
  zoomAppRoot: meetingSDKElement,
  language: 'en-US',
});

client.join({
  sdkKey: 'YOUR_SDK_KEY',
  signature: 'YOUR_SIGNATURE',
  meetingNumber: 'YOUR_MEETING_NUMBER',
  password: 'YOUR_MEETING_PASSWORD',
  userName: 'YOUR_NAME',
});
