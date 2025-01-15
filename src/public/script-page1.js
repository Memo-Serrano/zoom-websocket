import { initializeZoomMeeting } from './zoom.js';

// Detectar si está en local o en producción
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const socketUrl = isProduction ? 'wss://test-boton-ptop.onrender.com' : 'ws://localhost:3000';

const socket = new WebSocket(socketUrl);

// Manejar mensajes entrantes
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
};

// Inicializar el Zoom Meeting
initializeZoomMeeting();

// Select the node that will be observed for mutations
const targetNode = document.getElementById("zoomMeetingContainer");

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (!document.querySelector('[role="dialog"][aria-label="Chat"]')) {
      console.log('chat not av')
      if (document.querySelector("button[aria-label='More']")) {
      document.querySelector("button[aria-label='More']").click()
      document.querySelector("#menu-list-icon-more > li").click()
      }
    }
    if(!document.querySelector('.zoom-wrapper [role="dialog"][aria-label="Chat"]') && document.querySelector('[role="dialog"][aria-label="Chat"]') && document.querySelector('#ZOOM_WEB_SDK_SELF_VIDEO ~ ul')) {
      console.log('chat ava')
      document.querySelector('.zoom-wrapper').append(document.querySelector('[role="dialog"][aria-label="Chat"]'))
      document.querySelector('#zoomMeetingContainer > div > div > div').append(document.querySelector('.cta-wrapper'))
      if(window.innerWidth < 1240) {
        document.querySelector('.zoom-wrapper').insertBefore(document.querySelector('.meeting-sidebar'), document.querySelector('[role="dialog"][aria-label="Chat"]'))
      }
      if(window.innerWidth < 680) {
        window.innerWidth
        document.querySelector('.meeting-sidebar').append(document.querySelector('.cta-wrapper'))
      }
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
function disconnectChatObserer() {
  observer.disconnect();
}

document.querySelectorAll('.cta-btn').forEach((el) => {
  el.addEventListener('click', () => {
    document.querySelector('.checkout-wrapper').style.display = 'block'
  })
})

window.onresize = (event) => {
  if(window.innerWidth < 1240) {
    document.querySelector('.zoom-wrapper').insertBefore(document.querySelector('.meeting-sidebar'), document.querySelector('[role="dialog"][aria-label="Chat"]'))
  } else if(window.innerWidth > 1240 && document.querySelector('.zoom-wrapper .meeting-sidebar')) {
    document.querySelector('.sidebar-wrapper').append(document.querySelector('.meeting-sidebar'))
  }

  if(window.innerWidth < 680) {
    document.querySelector('.meeting-sidebar').append(document.querySelector('.cta-wrapper'))
  } else if (window.innerWidth > 680) {
    document.querySelector('#zoomMeetingContainer > div > div > div').append(document.querySelector('.cta-wrapper'))
  }
};