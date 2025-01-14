const { ZoomMtgEmbedded } = window;

export async function initializeZoomMeeting() {
  const client = ZoomMtgEmbedded.createClient();

  const meetingNumber = '87423967832';
  const userName = 'Guest User';
  const password = '718510';

  // Obtener la signature desde el servidor
  const response = await fetch(`/signature?meetingNumber=${meetingNumber}`);
  const data = await response.json();

  client.init({
    zoomAppRoot: document.getElementById('zoomMeetingContainer'),
    language: 'en-US',
  });

  client.join({
    sdkKey: 'UEEbOouT0wWC14opf66w',
    signature: data.signature,
    meetingNumber: meetingNumber,
    password: password,
    userName: userName,
  });
}
