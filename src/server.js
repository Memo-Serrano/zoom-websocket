require('dotenv').config();
const express = require('express');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir los archivos estáticos desde la carpeta 'public'
app.use(express.static('src/public'));

// Crear el servidor HTTP
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Configurar WebSocket
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  ws.on('message', (message) => {
    if (message === 'showButton') {
      // Enviar mensaje a todos los clientes conectados
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send('showButton');
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});
