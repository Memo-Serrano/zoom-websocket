// Detectar si está en local o en producción
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const socketUrl = isProduction ? 'wss://evento.conmemo.com' : 'ws://localhost:3000';

const socket = new WebSocket(socketUrl);

// Función para enviar comandos al servidor
function toggleElement(elementId, visible) {
  socket.send(JSON.stringify({ action: 'toggleElement', element: elementId, visible }));
}

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.action === 'initialize') {
    Object.keys(data.states).forEach((id) => {
      updateElement(document.querySelector(`.show-${id}`), data.states[id]);
    });

    /* Object.keys(data.timers).forEach((id) => {
      updateTimerDisplay(id, data.timers[id].remainingTime);
      if (data.timers[id].running) {
        startTimer(id, data.timers[id].remainingTime);
      } 
    }); */ //******Use this section to show preview of remining time*****
  }
};
// Actualizar la visibilidad de un elemento
function updateElement(element, visible) {
  element.checked = visible;
}

// Eventos para controlar los botones
document.getElementById('toggleButton1').addEventListener('click', () => {
  if(!document.getElementById('toggleButton1').checked) {
    toggleElement('cta1', false);
  } else {
    toggleElement('cta1', true);
  }
});

/* document.getElementById('hideButton1').addEventListener('click', () => {
  toggleElement('cta1', false);
}); */

document.getElementById('toggleButton2').addEventListener('click', () => {
  if(!document.getElementById('toggleButton2').checked) {
    toggleElement('cta2', false);
  } else {
    toggleElement('cta2', true);
  }
});

/* document.getElementById('hideButton2').addEventListener('click', () => {
  toggleElement('cta2', false);
}); */

document.getElementById('toggleButton3').addEventListener('click', () => {
  if(!document.getElementById('toggleButton3').checked) {
    toggleElement('timer1', false);
  } else {
    toggleElement('timer1', true);
  }
});

/* document.getElementById('hideButton3').addEventListener('click', () => {
  toggleElement('timer1', false);
}); */

document.getElementById('toggleButton4').addEventListener('click', () => {
  if(!document.getElementById('toggleButton4').checked) {
    toggleElement('timer2', false);
  } else {
    toggleElement('timer2', true);
  }
});

/* document.getElementById('hideButton4').addEventListener('click', () => {
  toggleElement('timer2', false);
}); */

document.getElementById('toggleButton5').addEventListener('click', () => {
  if(!document.getElementById('toggleButton5').checked) {
    toggleElement('timer3', false);
  } else {
    toggleElement('timer3', true);
  }
});

/* document.getElementById('hideButton5').addEventListener('click', () => {
  toggleElement('timer3', false);
}); */

document.getElementById('toggleButton6').addEventListener('click', () => {
  if(!document.getElementById('toggleButton6').checked) {
    toggleElement('timer4', false);
  } else {
    toggleElement('timer4', true);
  }
});

/* document.getElementById('hideButton6').addEventListener('click', () => {
  toggleElement('timer4', false);
}); */

document.getElementById('toggleButton7').addEventListener('click', () => {
  if(!document.getElementById('toggleButton7').checked) {
    toggleElement('timer5', false);
  } else {
    toggleElement('timer5', true);
  }
});

/* document.getElementById('hideButton7').addEventListener('click', () => {
  toggleElement('timer5', false);
}); */
