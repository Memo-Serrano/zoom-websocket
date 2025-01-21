const { ZoomMtgEmbedded } = window;

export async function initializeZoomMeeting(email, meeting_number) {
  const client = ZoomMtgEmbedded.createClient();

  const password = '718510';

  // Obtener la signature desde el servidor
  const response = await fetch(`/signature?meetingNumber=${meeting_number}`);
  const data = await response.json();

  client.init({
    zoomAppRoot: document.getElementById('zoomMeetingContainer'),
    language: 'en-US',
  });

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlQ0bHhiVWdxVFhlaWRRZ1pDV0NkIiwiY29tcGFueV9pZCI6IlgzaGdlNFFxbUVRYmdiNGcxWTE4IiwidmVyc2lvbiI6MSwiaWF0IjoxNzA2NzQ0NjU0NDE1LCJzdWIiOiJ1c2VyX2lkIn0._ke4US2bIL2MNsdMm9GYTGQ8wQtbBBLW0UAFjcr6M78");

  const raw = JSON.stringify({
    "email": email,
    "tags": 'attendee_zoom'
  });


  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("https://rest.gohighlevel.com/v1/contacts", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      client.join({
        sdkKey: 'UEEbOouT0wWC14opf66w',
        signature: data.signature,
        meetingNumber: meeting_number,
        password: password,
        userName: `${result.contact.firstName} ${result.contact.lastName}`,
      });
    })
    .catch((error) => console.error(error));
}
