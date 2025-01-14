const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);

// Servir archivos estáticos desde 'src/public'
app.use(express.static('src/public'));

// Zoom SDK credentials
const SDK_KEY = 'YOUR_SDK_KEY';
const SDK_SECRET = 'YOUR_SDK_SECRET';

// Endpoint para generar la signature de Zoom
app.get('/signature', (req, res) => {
  const meetingNumber = req.query.meetingNumber;
  const role = 0; // guest

  if (!meetingNumber) {
    return res.status(400).send('Meeting number is required');
  }

  const timestamp = new Date().getTime() - 30000;
  const msg = Buffer.from(`${SDK_KEY}${meetingNumber}${timestamp}${role}`).toString('base64');
  const hash = crypto.createHmac('sha256', SDK_SECRET).update(msg).digest('base64');
  const signature = Buffer.from(`${SDK_KEY}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');

  res.json({ signature });
});

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Un cliente se ha conectado');

  ws.on('message', (message) => {
    console.log('Mensaje recibido del cliente:', message);

    if (message === 'showButton') {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send('showButton');
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
