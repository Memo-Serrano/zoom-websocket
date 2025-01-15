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

let isButtonVisible = false;

// WebSocket server
const wss = new WebSocket.Server({ server });

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Enviar el estado actual del botón al nuevo cliente
  ws.send(JSON.stringify({ action: 'updateButton', visible: isButtonVisible }));

  // Manejar mensajes entrantes
  ws.on('message', (message) => {
    const msg = JSON.parse(message);
    console.log('Mensaje recibido del cliente:', msg);

    if (msg === 'showButton') {
      // Cambiar el estado del botón a visible
      isButtonVisible = true;

      // Reenviar el mensaje a todos los clientes conectados
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ action: 'showButton' }));
        }
      });
    }
  });
});

// Escuchar en el puerto asignado por Render o localhost
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
