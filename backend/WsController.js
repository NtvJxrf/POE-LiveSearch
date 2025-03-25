import WebSocket from "ws"
import { Requester } from './Requester.js'
import { WebSocketServer } from "ws";

export class WebSocketController {
    constructor(server) {
        this.wss = new WebSocketServer({ server });
        this.connections = {}
        this.requester = new Requester(this);
        this.poesessid = ''
        this.server = null
        
        this.wss.on('connection', (ws, req) => {
            this.server = ws
            const url = new URL(req.url, `http://${req.headers.host}`)
            this.poesessid = url.searchParams.get('poesessid')
            console.log('connected')
            ws.on('message', (message) => this.handleMessage(JSON.parse(message), ws));
            ws.on('close', () => this.handleClose(ws));
        });
    }

    handleMessage(message, ws) {
        switch (message.type) {
            case 'toggleWs':
                if(message.wsLive){
                    this.connections[message.searchId] && this.connections[message.searchId].close()
                }
                else{
                    const poeWsUrl = `wss://www.pathofexile.com/api/trade/live/${message.leagueName}/${message.searchId}`
                    try{
                        const connection = new WebSocket(poeWsUrl, {
                            headers: {
                                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
                                "Cookie": `POESESSID=${this.poesessid}`,
                                "Origin": "https://www.pathofexile.com"
                            }
                        })
                        connection.searchId = message.searchId
                        connection.on('message', (connectionMessage) => {
                            const parsedData = JSON.parse(connectionMessage)
                            //console.log(`Получено сообщение от searchId ${connection.searchId}`, parsedData)
                            if(parsedData.auth)
                                this.server.send(JSON.stringify({...parsedData, searchId: connection.searchId}))
                            else{
                                parsedData.new.forEach(el => this.requester.addRequest({searchId: connection.searchId, tradeId: el}))
                            }
            
                        })
                        connection.on('error', (error) => {
                            console.error(`WebSocket error for ${message.searchId}:`, error)
                            this.server.send(JSON.stringify({
                                error: `WS connection for ${message.searchId} faild, try later, or check ur poesessid or league name`,
                                searchId: message.searchId
                            }))
                        })
                        connection.on('close', (code, reason) => {
                            console.log(`Соединение ${connection.searchId} закрыто`)
                            delete this.connections[connection.searchId]
                        })
                        this.connections[message.searchId] = connection
                    }   
                    catch(error){
                        console.log(error)
                        ws.send(JSON.stringify({error: `WS connection for ${message.searchId} faild, try later, or check ur poesessid or league name`, searchId: message.searchId}))
                    }
                }
                break;

            case 'changePoeSessId':
                this.poesessid = message.poeSessionId
            break;
        }
    }

    handleClose(ws){

    }
}