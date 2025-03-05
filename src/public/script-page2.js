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
  console.log(data)
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
  if(data.action === 'attendeesList') {
    document.querySelector('.count-element').innerText = data.attendees.length;
    //console.log(data.attendees)
  }
  if(data.action === 'attendeesListInit') {
    document.querySelector('.count-element').innerText = data.attendees;
    //console.log(data.attendees)
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

document.getElementById('toggleButton2').addEventListener('click', () => {
  if(!document.getElementById('toggleButton2').checked) {
    toggleElement('cta2', false);
  } else {
    toggleElement('cta2', true);
  }
});

document.getElementById('toggleButton3').addEventListener('click', () => {
  if(!document.getElementById('toggleButton3').checked) {
    toggleElement('timer1', false);
  } else {
    toggleElement('timer1', true);
  }
});

document.getElementById('toggleButton4').addEventListener('click', () => {
  if(!document.getElementById('toggleButton4').checked) {
    toggleElement('timer2', false);
  } else {
    toggleElement('timer2', true);
  }
});

document.getElementById('toggleButton5').addEventListener('click', () => {
  if(!document.getElementById('toggleButton5').checked) {
    toggleElement('timer3', false);
  } else {
    toggleElement('timer3', true);
  }
});

document.getElementById('toggleButton6').addEventListener('click', () => {
  if(!document.getElementById('toggleButton6').checked) {
    toggleElement('timer4', false);
  } else {
    toggleElement('timer4', true);
  }
});

document.getElementById('toggleButton7').addEventListener('click', () => {
  if(!document.getElementById('toggleButton7').checked) {
    toggleElement('timer5', false);
  } else {
    toggleElement('timer5', true);
  }
});