import { initializeZoomMeeting } from './zoom.js';

// Detectar si está en local o en producción
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const socketUrl = isProduction ? 'wss://test-boton-ptop.onrender.com' : 'ws://localhost:3000';

const socket = new WebSocket(socketUrl);


/* // Elementos del DOM
const button1 = document.getElementById('cta1');
const button2 = document.getElementById('cta2');
const timer1 = document.getElementById('timer1');
const timer2 = document.getElementById('timer2'); */

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

/* const timerElement = document.querySelector('#timer-el1'); */


/* // Manejar mensajes entrantes
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (message.action === 'updateElement') {
    const element = document.getElementById(message.element);
    element.style.display = message.visible ? 'block' : 'none';
  }

  if (message.action === 'updateElements') {
    const states = message.states;
    Object.keys(states).forEach((elementId) => {
      const element = document.getElementById(elementId);
      element.style.display = states[elementId] ? 'block' : 'none';
    });
  }
}; */

// Inicializar el Zoom Meeting
initializeZoomMeeting();

// Select the node that will be observed for mutations
const targetNode = document.getElementById("zoomMeetingContainer");

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

let pageLoaded = false
var alreadyClicked = false
var sessionStarted = false;

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (!document.querySelector('[role="dialog"][aria-label="Chat"]')) {
      console.log('chat not av')
      if (document.querySelector("button[aria-label='More']")) {
        document.querySelector("button[aria-label='More']").click()
        document.querySelector("#menu-list-icon-more > li").click()
        document.querySelector("button[aria-label='More']").click()
        document.querySelector("#menu-list-icon-more > li:nth-child(2)").click()
      }
    }
    if (!document.querySelector('.zoom-wrapper [role="dialog"][aria-label="Chat"]') && document.querySelector('[role="dialog"][aria-label="Chat"]') && document.querySelector('#zoom-sdk-video-canvas ~ ul')) {
      pageLoaded = true
      sessionStarted = true
      console.log(pageLoaded)
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
    /*    if(pageLoaded && !document.querySelector('[role="dialog"][aria-label="Reactions"]') && !alreadyClicked) {
         console.log('show reactions')
         alreadyClicked = true
         setTimeout(() => {
           document.querySelector("button[aria-label='More']").click()
           document.querySelector("#menu-list-icon-more > li:nth-child(2)").click()
         }, 1000)
       } */
    if (document.querySelector('#zoomMeetingContainer').innerHTML == '<div></div><div></div>' && sessionStarted == true) {
      console.log('no meeting')
      document.querySelector('body').innerHTML = '<h1>La Sesion ha terminado</h1>';
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
/* function disconnectChatObserer() {
  observer.disconnect();
} */

document.querySelectorAll('.cta-btn').forEach((el) => {
  el.addEventListener('click', (e) => {
    document.querySelector('.checkout-wrapper').style.display = 'block'
    e.target.closest('.cta-btn-wrapper').style.display = 'none'
  })
})

window.onresize = (event) => {
  if (window.innerWidth < 1240 && !document.querySelector('.zoom-wrapper .meeting-sidebar')) {
    document.querySelector('.zoom-wrapper').insertBefore(document.querySelector('.meeting-sidebar'), document.querySelector('[role="dialog"][aria-label="Chat"]'))
  } else if (window.innerWidth > 1240 && document.querySelector('.zoom-wrapper .meeting-sidebar')) {
    document.querySelector('.sidebar-wrapper').append(document.querySelector('.meeting-sidebar'))
  }

  if (window.innerWidth < 680 && !document.querySelector('.meeting-sidebar .cta-wrapper')) {
    document.querySelector('.meeting-sidebar').append(document.querySelector('.cta-wrapper'))
  } else if (window.innerWidth > 680 && document.querySelector('.meeting-sidebar .cta-wrapper')) {
    document.querySelector('#zoomMeetingContainer > div > div > div').append(document.querySelector('.cta-wrapper'))
  }
};

/* // Tiempo inicial en minutos y segundos
let minutes = 30;
let seconds = 0;

let mins2 = 3
let secs2 = 0;

const countdown = setInterval(() => {
  if (minutes === 0 && seconds === 0) {
    clearInterval(countdown);
    //timerElement.innerHTML = "Time's up!";
  } else {
    // Reducir el tiempo
    if (seconds === 0) {
      seconds = 59;
      minutes--;
    } else {
      seconds--;
    }

    // Formatear el tiempo como MM:SS
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    timerElement.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
  }
}, 1000);

const timerElement2 = document.querySelector('#timer-el2');
const countdown2 = setInterval(() => {
  if (mins2 === 0 && secs2 === 0) {
    clearInterval(countdown2);
    //timerElement2.innerHTML = "Time's up!";
  } else {
    // Reducir el tiempo
    if (secs2 === 0) {
      secs2 = 59;
      mins2--;
    } else {
      secs2--;
    }

    // Formatear el tiempo como MM:SS
    const formattedMinutes = String(mins2).padStart(2, '0');
    const formattedSeconds = String(secs2).padStart(2, '0');

    timerElement2.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
  }
}, 1000); */

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