import { loadFriends } from "./friends.js";
import { showNotification } from "./notifications.js";

export function test(){
    console.log("Websocket Test import")
}

export class userStatusWebSocket {
    constructor(url)
    {
        const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";

        this.url = wsProtocol + "://" + window.location.host + "/ws/some_url/"
        this.reconnection_attempts = 0;
        
        this.websocket = null;
        this.connect();
    }
    
    connect() {
        try {
            this.websocket = new WebSocket(this.url);

            this.websocket.onmessage = this.onmessage.bind(this);
            this.websocket.onclose = this.onclose.bind(this);
            this.websocket.onerror = this.onerror.bind(this);
            this.websocket.onopen = this.onopen.bind(this);
        }
        catch(e) {
            console.error(`[WebSocket] Error ${e.message}`);
        }
    }

    get socket(){
        return this.websocket;
    }
    
    onopen(e) {
        console.log("[WebSocket] Connection successful!");
        this.reconnection_attempts = 0;
    }

    onmessage(e) {
        console.log("[WebSocket] Got message: " + e.data);
        if (e.data.type === "lang")
        {
            console.log("[WEBSOCKET] Got a LANG")
            const languageCode = localStorage.getItem('currentLanguage') || 'en';
            this.send({"type": 'lang', "code": languageCode})
        }
        else
            refreshUI(JSON.parse(e.data));
    }

    send(obj){
        console.log("[WEBSOCKET]SENDING", obj)

        if (this.ongoingConnection()){
            this.websocket.send(
                JSON.stringify(obj)
            )
        }
    }

    ping(){
        this.send({"type": "ping"})
    }

    ongoingConnection() {
        return (this.websocket && (this.websocket.readyState === WebSocket.OPEN || this.websocket.readyState === WebSocket.CONNECTING))
    }

    reconnect() {
        console.log("[WebSocket] Reconnecting WebSocket")
        if (this.ongoingConnection()) {
            this.websocket.close();
        }
        this.connect()
    }

    attemptReconnection() {
        const delay = Math.min(this.reconnection_attempts * 1000 + 1000, 5000);
        this.reconnection_attempts++;

        if (this.reconnection_attempts < 5)
        {
            console.log(`[WebSocket] Retrying to connect in ${delay} ms`);
            setTimeout(this.connect.bind(this), delay);
            return
        }
        else {
            console.error("[WebSocket] Connection Failed")
        }
    }

    onerror(event) {
        console.error("[WebSocket] Error: ", err.message);
        // this.attemptReconnection();

    }

    onclose(event) {
        if (event.wasClean) {
            console.log(`[WebSocket] Connection closed gracefully.`);
          } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[WebSocket] Connection died [code=${event.code}; reason=${event.reason}]');
            this.attemptReconnection();
          }
        // this.attemptReconnection();
    }
}

function refreshUI(data)
{
    if (data.type === "notification")
    {
        showNotification(data.message)
    }
    else if (data.type === "refresh")
    {
        console.log("[WEBSOCKET] Got a refresh Message")
        loadFriends()
    }
    
    else
        console.log("NO IDEA")
}

let instance = new userStatusWebSocket()
window.ws = instance