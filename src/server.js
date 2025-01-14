const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('src/public'));

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Un cliente se ha conectado');

  ws.on('message', (message) => {
    console.log('Mensaje recibido del cliente:', message);

    // Si el mensaje es "showButton", enviarlo a todos los clientes conectados
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
