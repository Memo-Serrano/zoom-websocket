import { initializeZoomMeeting } from './zoom.js';

const { ZoomMtgEmbedded } = window;
const client = ZoomMtgEmbedded.createClient();
// Detectar si está en local o en producción
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const socketUrl = isProduction ? 'wss://evento.conmemo.com' : 'ws://localhost:3000';

const socket = new WebSocket(socketUrl);

let timerIntervals = {};

//Save Time in Session
let timeInMeeting = 0; // Tiempo total en segundos
let startTime = 0; // Tiempo cuando el usuario entra a la ventana
let meetingStartTime = null; // Tiempo de inicio del Meeting
let meetingEndTime = null; // Tiempo de salida del Meeting
// Manejar mensajes del servidor
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.action === 'initialize') {
    Object.keys(data.states).forEach((id) => {
      updateElement(document.getElementById(id), data.states[id]);
    });

    Object.keys(data.timers).forEach((id) => {
      updateTimerDisplay(id, data.timers[id].remainingTime);
      if (data.timers[id].running) {
        startTimer(id, data.timers[id].remainingTime);
      }
    });
  }

  if (data.action === 'updateElement') {
    updateElement(document.getElementById(data.element), data.visible);
  }

  if (data.action === 'updateTimer') {
    const { timerId, remainingTime } = data;

    // Actualizar el temporizador local
    startTimer(timerId, remainingTime);
    updateTimerDisplay(timerId, remainingTime); // Ajuste inmediato
  }
};

// Actualizar la visibilidad de un elemento
function updateElement(element, visible) {
  element.classList.toggle('hidden', !visible);
}

// Actualizar la visualización del temporizador
function updateTimerDisplay(timerId, seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remainingSeconds = String(seconds % 60).padStart(2, '0');
  document.querySelector(`#${timerId} .timer-count`).innerText = `${minutes}:${remainingSeconds}`;
}

// Iniciar temporizador local con sincronización
function startTimer(timerId, initialSeconds) {
  if (timerIntervals[timerId]) clearInterval(timerIntervals[timerId]);

  let seconds = initialSeconds;
  const element = document.querySelector(`#${timerId} .timer-count`);

  timerIntervals[timerId] = setInterval(() => {
    if (seconds <= 0) {
      clearInterval(timerIntervals[timerId]);
      element.innerText = '¡Tiempo terminado!';
      return;
    }
    seconds--;
    updateTimerDisplay(timerId, seconds);
  }, 1000);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const email = getCookie('zue');
const meetingID = getCookie('zmid');

if (email && meetingID) {
  initializeZoomMeeting(email, meetingID);
}

// Select the node that will be observed for mutations
const targetNode = document.getElementById("zoomMeetingContainer");

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

var clientReady = false;
var chatEnabled = false;
var sessionEnded = false;
var settings_opened = false;
// Callback function to execute when mutations are observed

const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (document.querySelector('#zoom-sdk-video-canvas ~ ul>li') && !clientReady) {
      console.log('Client Ready');
      clientReady = true //Checks if there are users added in meeting
      setAttendedTag()
    }
    /* if(clientReady) {
      if(client.getVirtualBackgroundStatus().vbList[1].id == 'program' && client.getVirtualBackgroundStatus().id !== 'program') {
        setTimeout(() => {
          // Configurar la URL base
          const baseUrl = isProduction ? 'https://evento.conmemo.com' : 'http://localhost:3000';

          // Cambiar el fondo virtual
          const imageUrl = `${baseUrl}/images/Elite.png`;
          const vbList = [{
            displayName: 'Fondo Elite',
            fileName: 'Elite',
            id: 'customprogram',
            url: imageUrl
          }]
          client.updateVirtualBackgroundList(vbList).then(() => {
            client.setVirtualBackground('program')
          })
        }, 1000)
      }
    } */
    
    if(clientReady && !document.querySelector('[role="dialog"][aria-label="Settings"]') && !settings_opened) {
      /* if(document.querySelector('button[title="Settings"]')) {
        document.querySelector('button[title="Settings"]').click()
        settings_opened = true
      } */
    }

    if (!document.querySelector('[role="dialog"][aria-label="Chat"]') && clientReady && !document.querySelector("#menu-list-icon-more > li") && !chatEnabled) {
      console.log('Enabling Chat Window...')
        if(document.querySelector('button[title="Chat"]')) {
          document.querySelector('button[title="Chat"]').click()
          setTimeout(() => {
            setChatWindow()
          }, 1000)
        } else {
          document.querySelector("button[aria-label='More']").click()
        }
        
    }
    if (!document.querySelector('[role="dialog"][aria-label="Chat"]') && clientReady && document.querySelector("#menu-list-icon-more > li") && !chatEnabled) {
          document.querySelector("#menu-list-icon-more > li").click()
    }

    if(document.querySelector('[role="dialog"][aria-label="Chat"]')) chatEnabled = true;

    if (!document.querySelector('.zoom-wrapper [role="dialog"][aria-label="Chat"]') && document.querySelector('[role="dialog"][aria-label="Chat"]') && clientReady) {
      setChatWindow()
    }
    if (document.querySelector('#zoomMeetingContainer div[aria-label="Zoom app container"]') && clientReady) {
      if (document.querySelector('#zoomMeetingContainer div[aria-label="Zoom app container"]').innerHTML == '<div></div>') {
        document.querySelector('body').innerHTML = '<h1>La Sesion ha terminado</h1>';
        sessionEnded = true;
        meetingEndTime = Date.now();
        stopMeetingTimer();
        sendReportToGHL(); 
      }
    }

    if (clientReady && !sessionEnded) {
      document.querySelector('.reactions-container').style.top = `${document.querySelector('#zoomMeetingContainer').offsetHeight - 50}px`
      document.querySelector('.reactions-container').style.display = 'block'
    }
  }
};

function setChatWindow() {
  console.log('Chat Window Ready')
  document.querySelector('.zoom-wrapper').append(document.querySelector('[role="dialog"][aria-label="Chat"]'))
  document.querySelector('#zoomMeetingContainer > div > div > div').append(document.querySelector('.cta-wrapper'))
  document.querySelectorAll('.init-hidden').forEach((el) => {
    el.classList.remove('init-hidden')
  })
  document.querySelector('html').style.overflow = 'auto'
  if (window.innerWidth < 1240) {
    document.querySelector('.zoom-wrapper').insertBefore(document.querySelector('.meeting-sidebar'), document.querySelector('[role="dialog"][aria-label="Chat"]'))
  }
  if (window.innerWidth < 680 && !document.querySelector('.meeting-sidebar .cta-wrapper')) {
    document.querySelector('.meeting-sidebar').append(document.querySelector('.cta-wrapper'))
  }
}
document.querySelector('.reactions-container').addEventListener('click', (e) => {
    if (document.querySelector("button:has(h6)")) {
      document.querySelector("button:has(h6)").click()
      document.querySelector(".lower-hand-label").style.display = 'none'
      document.querySelector(".rise-hand-label").style.display = 'block'
    } else {
      if(document.querySelector('button[title="Reactions"]')) {
        document.querySelector('button[title="Reactions"]').click()
        setTimeout(() => { 
          document.querySelector("button:has(h6)").click()
        }, 100)
      } else {
        document.querySelector("button[aria-label='More']").click()
        setTimeout(() => { 
          document.querySelector("#menu-list-icon-more > li:nth-child(2)").click()
          document.querySelector(".lower-hand-label").style.display = 'block'
          document.querySelector(".rise-hand-label").style.display = 'none'
          setTimeout(() => { 
          document.querySelector("button:has(h6)").click()
          }, 0)
        }, 0)
      }
    }
})

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

document.querySelectorAll('.cta-btn').forEach((el) => {
  el.addEventListener('click', (e) => {
    document.querySelector('.checkout-wrapper').style.display = 'block'
    e.target.closest('.cta-btn-wrapper').style.display = 'none'
  })
})

/* function setBackground() {
const client = ZoomMtgEmbedded.createClient();
const imageUrl = `http://localhost:3000/images/Elite.png`;
    const vbList = [{
      displayName: 'Fondo Elite',
      fileName: 'Elite',
      id: 'customprogram',
      url: imageUrl
    }]
console.log(client.getVirtualBackgroundStatus())
client.updateVirtualBackgroundList(vbList).then(() => {
    setTimeout(() => {
    client.setVirtualBackground('customprogram')
        }, 100)
})
document.querySelector('[title="Settings"]').click()
document.querySelector("#setting-tab-background").click()
document.querySelector("#suspension-view-tabpanel-background > div > div.zoom-MuiBox-root.css-1yuhvjn > div > div").click()
document.querySelector('[aria-label="Settings"] [aria-label="Close"]').click()
client.updateVirtualBackgroundList(vbList).then(() => {
    setTimeout(() => {
    client.setVirtualBackground('customprogram')
        }, 100)
})
} */


window.onresize = (event) => {
  if (window.innerWidth < 1240 && !document.querySelector('.zoom-wrapper .meeting-sidebar') && clientReady) {
    document.querySelector('.zoom-wrapper').insertBefore(document.querySelector('.meeting-sidebar'), document.querySelector('[role="dialog"][aria-label="Chat"]'))
  } else if (window.innerWidth > 1240 && document.querySelector('.zoom-wrapper .meeting-sidebar') && clientReady) {
    document.querySelector('.sidebar-wrapper').append(document.querySelector('.meeting-sidebar'))
  }
  if (window.innerWidth < 680 && !document.querySelector('.meeting-sidebar .cta-wrapper') && clientReady) {
    document.querySelector('.meeting-sidebar').append(document.querySelector('.cta-wrapper'))
  } else if (window.innerWidth > 680 && document.querySelector('.meeting-sidebar .cta-wrapper') && clientReady) {
    document.querySelector('#zoomMeetingContainer > div > div > div').append(document.querySelector('.cta-wrapper'))
  }
};


async function setAttendedTag() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlQ0bHhiVWdxVFhlaWRRZ1pDV0NkIiwiY29tcGFueV9pZCI6IlgzaGdlNFFxbUVRYmdiNGcxWTE4IiwidmVyc2lvbiI6MSwiaWF0IjoxNzA2NzQ0NjU0NDE1LCJzdWIiOiJ1c2VyX2lkIn0._ke4US2bIL2MNsdMm9GYTGQ8wQtbBBLW0UAFjcr6M78");
  const raw = JSON.stringify({
    "tags": ['has_attended']
  });

  const req_options = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  const hasAttended = await fetch(`https://rest.gohighlevel.com/v1/contacts/${getCookie('msid')}/tags`, req_options);

  if (!hasAttended.ok) {
    throw new Error('Error al aplicar asistencia');
  } else {
    console.log('Asistencia Confirmada')
    meetingStartTime = Date.now();
    startMeetingTimer()
  }
  const res = await hasAttended.json();
}

// Solicitar permisos para cámara y micrófono
async function requestPermissions() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    //document.getElementById('status').innerText = "Permisos concedidos: ✅";
    
    stream.getTracks().forEach(track => track.stop());
  } catch (error) {
    //document.getElementById('status').innerText = "Permisos denegados: ❌";
    console.error("Error al obtener permisos:", error);
  }
}

window.onload = requestPermissions;

// Función para iniciar el conteo cuando el usuario entra a la pestaña
function startMeetingTimer() {
  if (!startTime) startTime = Date.now(); // Guardar el tiempo de inicio
  console.log("Corre Tiempo de Sesion")
}

// Función para pausar el conteo cuando el usuario deja la pestaña
function stopMeetingTimer() {
  if (startTime) {
    timeInMeeting += Math.floor((Date.now() - startTime) / 1000); // Calcular segundos transcurridos
    startTime = 0; // Resetear el tiempo de inicio
    console.log("Tiempo en Sesion terminado")
  }
}

// Detectar cuándo el usuario cambia de pestaña
/* window.addEventListener("focus", startMeetingTimer);
window.addEventListener("blur", stopMeetingTimer); */

// Detectar cuándo el usuario cierra la pestaña
window.addEventListener("beforeunload", () => {
  meetingEndTime = Date.now();
  stopMeetingTimer();
  sendReportToGHL(true); // Enviar reporte cuando el usuario salga
});
/* document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    sendReportToGHL(true);
  }
}); */
// Evento para cuando el usuario se una al Meeting


// Función para enviar el reporte de tiempo al servidor
function sendReportToGHL(sync = false) {
  const totalTime = timeInMeeting + (startTime ? Math.floor((Date.now() - startTime) / 1000) : 0);
  /* const report = {
    userName: "Nombre del Usuario", // Puedes obtenerlo del Zoom SDK
    meetingId: "ID del Meeting",
    timeInMeeting: totalTime, // Tiempo total en segundos
    meetingStartTime: meetingStartTime ? new Date(meetingStartTime).toISOString() : null,
    meetingEndTime: meetingEndTime ? new Date(meetingEndTime).toISOString() : null,
  }; */

  console.log("Enviando reporte:", totalTime);
  const url = "https://services.leadconnectorhq.com/hooks/T4lxbUgqTXeidQgZCWCd/webhook-trigger/da5ec4f8-f5be-41a8-93e7-3801675c6d3a";
  
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlQ0bHhiVWdxVFhlaWRRZ1pDV0NkIiwiY29tcGFueV9pZCI6IlgzaGdlNFFxbUVRYmdiNGcxWTE4IiwidmVyc2lvbiI6MSwiaWF0IjoxNzA2NzQ0NjU0NDE1LCJzdWIiOiJ1c2VyX2lkIn0._ke4US2bIL2MNsdMm9GYTGQ8wQtbBBLW0UAFjcr6M78");
  const raw = JSON.stringify({
    "email": decodeURIComponent(email),
    "time": totalTime
  });

  if(sync && navigator.sendBeacon) {
    const blob = new Blob([raw], { type: "application/json" });
    navigator.sendBeacon(url, blob);
  } else {
    fetch(url, {
      method: "POST",
      headers: myHeaders,
      body: raw,
    })
      .then((response) => response.json())
      .then((data) => console.log("Reporte enviado con éxito:", data))
      .catch((error) => console.error("Error al enviar el reporte:", error));
  }
}