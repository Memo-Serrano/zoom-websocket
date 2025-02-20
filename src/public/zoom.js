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

  //Tag to grant access to the meeting
  const access_tag = 'zoom_access'
  const loggin_tag = 'zoom_loggin'

  // Obtener la signature desde el servidor
  const response = await fetch(`/signature?meetingNumber=${meeting_number}`);
  const data = await response.json();

  client.init({
    zoomAppRoot: document.getElementById('zoomMeetingContainer'),
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
        defaultViewType: 'gallery',
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
    "email": decodeURIComponent(email)
  });

  const req_options = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  const vbList = [{
    displayName: 'Fondo Elite',
    fileName: 'Elite',
    id: 'program',
    url: imageUrl
  }]
  client.on("connection-change", (payload) => {
    if (payload.state === 'Closed') {
      console.log("Meeting ended")
      document.querySelector('body').append(document.querySelector('[role="dialog"][aria-label="Chat"]'))
      //document.querySelector('body').innerHTML = '<h1>La Sesion ha terminado</h1>';
    }
   })

  /* fetch("https://rest.gohighlevel.com/v1/contacts", get_contact_options)
    .then((response) => response.json())
    .then((result) => {
      console.log(result.contact.tags)
      if(result.contact.tags.includes(access_tag)) {
        client.join({
          sdkKey: 'UEEbOouT0wWC14opf66w',
          signature: data.signature,
          meetingNumber: meeting_number,
          password: password,
          userName: `${result.contact.firstName} ${result.contact.lastName}`,
        }).then(() => {

          
        }).catch((error) => console.error('Error al unirse a la reunión:', error));
      } else {
        console.log('Access not granted')
        document.getElementById('zoomMeetingContainer').innerHTML = '<span class="no-access">No tienes acceso a esta clase</span>'
      }
    })
    .catch((error) => console.error(error)); */

    function startMeeting(result) {
      client.join({
        sdkKey: 'UEEbOouT0wWC14opf66w',
        signature: data.signature,
        meetingNumber: meeting_number,
        password: password,
        userName: `${result.contact.firstName} ${result.contact.lastName}`,
      }).then(() => {
          /* client.updateVirtualBackgroundList(vbList)
          setTimeout(() => {
            console.log(client.getVirtualBackgroundStatus())
            client.setVirtualBackground('program')
          }, 2000) */
      }).catch((error) => console.error('Error al unirse a la reunión:', error));
    }

    async function initMeeting() {
      try {
          const get_contact = await fetch('https://rest.gohighlevel.com/v1/contacts', req_options);
          if (!get_contact.ok) {
              throw new Error('Error en el primer request');
          }
          const data = await get_contact.json();

          const cName = 'msid';
          const cValue = data.contact.id;
          const cExp = 3600000;

          const date = new Date();
          date.setTime(date.getTime() + (cExp));
          const expiry = "expires=" + date.toUTCString();

          document.cookie = `${cName}=${cValue}; ${expiry}; path=/`;

          let tags = data.contact.tags;
          tags.push(loggin_tag);

          const raw_attendee = JSON.stringify({
            "email": decodeURIComponent(email),
            "tags": tags
          });

          req_options.body = raw_attendee;
  
          if (data.contact.tags.includes(access_tag)) {
              const attendee = await fetch('https://rest.gohighlevel.com/v1/contacts', req_options);
              if (!attendee.ok) {
                  throw new Error('Error en el segundo request');
              }
              const res = await attendee.json(); // Convertir la respuesta a JSON
              console.log('Acceso autorizado');
              startMeeting(res);
          } else {
              console.log('Access not granted')
              document.getElementById('zoomMeetingContainer').innerHTML = '<span class="no-access">No tienes acceso a esta clase</span>'
              //throw new Error('Condición no válida para el segundo request');
          }
      } catch (error) {
          console.error('Error:', error);
      }
  }
  
  initMeeting();


}
