import { initializeZoomMeeting } from './zoom.js';

// Detectar si está en local o en producción
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const socketUrl = isProduction ? 'wss://evento.conmemo.com' : 'ws://localhost:3000';

const socket = new WebSocket(socketUrl);

let timerIntervals = {};

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

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if(document.querySelector('#zoom-sdk-video-canvas ~ ul>li')) clientReady = true //Checks if there are users added in meeting

    if (!document.querySelector('[role="dialog"][aria-label="Chat"]') && clientReady) {
      console.log('Enabling Chat Window...')
      if (document.querySelector("button[aria-label='More']")) {
        document.querySelector("button[aria-label='More']").click()
        document.querySelector("#menu-list-icon-more > li").click()
        /* document.querySelector("button[aria-label='More']").click()
        document.querySelector("#menu-list-icon-more > li:nth-child(2)").click() */
      }
    }
    if (!document.querySelector('.zoom-wrapper [role="dialog"][aria-label="Chat"]') && document.querySelector('[role="dialog"][aria-label="Chat"]') && clientReady) {
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
    if (document.querySelector('#zoomMeetingContainer').innerHTML == '<div></div><div></div>' && clientReady) {
      document.querySelector('body').innerHTML = '<h1>La Sesion ha terminado</h1>';
    }
    if(clientReady) {
      document.querySelector('.reactions-container').style.top = `${document.querySelector('#zoomMeetingContainer').offsetHeight - 50}px`
      document.querySelector('.reactions-container').style.display = 'block'
    }
  }
};

document.querySelector('.reactions-container').addEventListener('click', (e) => {
  if(document.querySelector("button:has(h6)")) {
    document.querySelector("button:has(h6)").click()
    document.querySelector(".lower-hand-label").style.display = 'none'
    document.querySelector(".rise-hand-label").style.display = 'block'
  } else {
    document.querySelector("button[aria-label='More']").click()
    document.querySelector("#menu-list-icon-more > li:nth-child(2)").click()
    document.querySelector(".lower-hand-label").style.display = 'block'
    document.querySelector(".rise-hand-label").style.display = 'none'
    document.querySelector("button:has(h6)").click()
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


// Solicitar permisos para cámara y micrófono
async function requestPermissions() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    //document.getElementById('status').innerText = "Permisos concedidos: ✅";
    // Detener el stream para no usar la cámara y el micrófono innecesariamente
    stream.getTracks().forEach(track => track.stop());
  } catch (error) {
    //document.getElementById('status').innerText = "Permisos denegados: ❌";
    console.error("Error al obtener permisos:", error);
  }
}

// Ejecutar la función al cargar la página
window.onload = requestPermissions;