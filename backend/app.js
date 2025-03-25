import WebSocket from "ws"
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { WebSocketController } from './WsController.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const backendPort = 5000

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

const server = app.listen(backendPort, () => {
    console.log(`Server start at port ${backendPort}`)
})

const wsController = new WebSocketController(server)