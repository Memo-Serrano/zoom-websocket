const { ZoomMtgEmbedded } = window;
//import { Client } from '/modules/@zoom/meetingsdk/dist/zoom-meeting-embedded-ES5.min.js';
//import ZoomMtgEmbedded from '/modules/@zoom/meetingsdk/dist/embedded';


export async function initializeZoomMeeting(email, meeting_number) {
  // Detectar si está en producción
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  // Configurar la URL base
  const baseUrl = isProduction ? 'https://evento.conmemo.com' : 'http://localhost:3000';

  // Cambiar el fondo virtual
  const imageUrl = `${baseUrl}/images/Elite.png`;

  const client = ZoomMtgEmbedded.createClient();

  //const client = new Client();
  const password = '718510';

  // Obtener la signature desde el servidor
  const response = await fetch(`/signature?meetingNumber=${meeting_number}`);
  const data = await response.json();

  client.init({
    zoomAppRoot: document.getElementById('zoomMeetingContainer'),
    debug: true,
    language: 'en-US',
    customize: {
      virtualBackground: {
        isEnabled: true,
      },
      video: {
        popper: {
          disableDraggable: true
        },
        isResizable: true,
        defaultViewType: 'active',
        viewSizes: {
          default: {
            width: 1000,
            height: 600
          }
        }
      }
    },
  });

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlQ0bHhiVWdxVFhlaWRRZ1pDV0NkIiwiY29tcGFueV9pZCI6IlgzaGdlNFFxbUVRYmdiNGcxWTE4IiwidmVyc2lvbiI6MSwiaWF0IjoxNzA2NzQ0NjU0NDE1LCJzdWIiOiJ1c2VyX2lkIn0._ke4US2bIL2MNsdMm9GYTGQ8wQtbBBLW0UAFjcr6M78");

  const raw = JSON.stringify({
    "email": decodeURIComponent(email),
    "tags": 'attendee_zoom'
  });


  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  const vbList = [{
    displayName: 'Fondo Elite',
    fileName: 'Elite',
    id: '1111',
    url: imageUrl
  }]

  fetch("https://rest.gohighlevel.com/v1/contacts", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      
      client.join({
        sdkKey: 'UEEbOouT0wWC14opf66w',
        signature: data.signature,
        meetingNumber: meeting_number,
        password: password,
        userName: `${result.contact.firstName} ${result.contact.lastName}`,
      }).then(() => {
        client.updateVirtualBackgroundList(vbList).then(() => {
          setTimeout(() => client.setVirtualBackground('1111'), 100);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
        
      }).catch((error) => console.error('Error al unirse a la reunión:', error));
    })
    .catch((error) => console.error(error));
}
