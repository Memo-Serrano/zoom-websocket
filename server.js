const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const crypto = require('crypto');
const KJUR = require('jsrsasign')

const app = express();
const server = http.createServer(app);

// Servir archivos estáticos desde 'src/public'
app.use(express.static('src/public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Middleware para configurar COOP y COEP
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // COOP
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // COEP
  next();
});

// Zoom SDK credentials
const SDK_KEY = 'UEEbOouT0wWC14opf66w';
const SDK_SECRET = 'WV10DUSHL059A9FWoYIbgu35MFmXF5Zv';

// Endpoint para generar la signature de Zoom
app.get('/signature', (req, res) => {
  const meetingNumber = req.query.meetingNumber;
  const role = 0; // guest

  if (!meetingNumber) {
    return res.status(400).send('Meeting number is required');
  }

/*   const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(`${SDK_KEY}${meetingNumber}${timestamp}${role}`).toString('base64');
  const hash = crypto.createHmac('sha256', SDK_SECRET).update(msg).digest('base64');
  const signature = Buffer.from(`${SDK_KEY}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64'); */

  const iat = Math.round(new Date().getTime() / 1000) - 30
  const exp = iat + 60 * 60 * 2
  const oHeader = { alg: 'HS256', typ: 'JWT' }

  const oPayload = {
    sdkKey: SDK_KEY,
    appKey: SDK_KEY,
    mn: meetingNumber,
    role: role,
    iat: iat,
    exp: exp,
    tokenExp: exp
  }

  const sHeader = JSON.stringify(oHeader)
  const sPayload = JSON.stringify(oPayload)
  const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, SDK_SECRET)
  
  res.json({ signature: sdkJWT.toString() });
});


// WebSocket server
const wss = new WebSocket.Server({ server });

// Estado inicial de los elementos
const elementStates = {
  cta1: false, // Botón 1 (hiddenButton)
  cta2: false, // Botón 2 (anotherButton)
  timer1: false,
  timer2: false,
  timer3: false,
  timer4: false,
  timer5: false
};

//NEW ADDED V
const timers = {
  timer1: { remainingTime: 1800, running: false }, // 30 minutos
  timer2: { remainingTime: 180, running: false }, // 3 minutos
  timer3: { remainingTime: 180, running: false }, // 3 minutos
  timer4: { remainingTime: 180, running: false }, // 3 minutos
  timer5: { remainingTime: 180, running: false } // 3 minutos
};

// Función para iniciar un temporizador
function startTimer(timerId) {
  if (!timers[timerId].running) {
    timers[timerId].running = true;
    const interval = setInterval(() => {
      if (timers[timerId].remainingTime > 0) {
        timers[timerId].remainingTime--;
        broadcast({
          action: 'updateTimer',
          timerId,
          remainingTime: timers[timerId].remainingTime,
        });
      } else {
        clearInterval(interval);
        timers[timerId].running = false;
      }
    }, 1000);
  }
}

// Emitir actualizaciones de temporizadores cada segundo
setInterval(() => {
  Object.keys(timers).forEach((timerId) => {
    if (timers[timerId].running) {
      broadcast({
        action: 'updateTimer',
        timerId,
        remainingTime: timers[timerId].remainingTime,
      });
    }
  });
}, 1000);
// Función para enviar mensajes a todos los clientes
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

//NEW ADDED A

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Enviar el estado inicial al nuevo cliente
  ws.send(
    JSON.stringify({
      action: 'initialize',
      states: elementStates,
      timers,
    })
  );

  // Manejar mensajes entrantes
  ws.on('message', (message) => {
    const msg = JSON.parse(message);

    if (msg.action === 'toggleElement') {
      elementStates[msg.element] = msg.visible;
      broadcast({ action: 'updateElement', element: msg.element, visible: msg.visible });

      if (msg.element.startsWith('timer') && msg.visible) {
        startTimer(msg.element);
      }
    }
  });
});

/* // Manejar conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Enviar el estado actual de los elementos al nuevo cliente
  ws.send(JSON.stringify({ action: 'updateElements', states: elementStates }));

  // Manejar mensajes entrantes
  ws.on('message', (message) => {
    const msg = JSON.parse(message);

    // Actualizar el estado de los elementos en el servidor
    if (msg.action === 'toggleElement') {
      elementStates[msg.element] = msg.visible;

      // Reenviar el estado actualizado a todos los clientes
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ action: 'updateElement', element: msg.element, visible: msg.visible}));
        }
      });
    }
  });
}); */

/* app.get('/join', (req, res) => {
  const email = req.query.email;
  const meetingId = req.query.meeting_id;

  if (!email || !meetingId) {
    return res.status(400).send('Faltan parámetros: email y/o meeting_id');
  }
  initializeZoomMeeting(meetingId);//generateSignature(meetingId, role); // Asegúrate de tener esta función definida
}); */

// Escuchar en el puerto asignado por Render o localhost
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
