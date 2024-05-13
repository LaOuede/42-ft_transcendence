import { loadFriends } from "./friends.js";
import { showNotification } from "./notifications.js";

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
        }
    }

    get socket(){
        return this.websocket;
    }
    
    onopen(e) {
        this.reconnection_attempts = 0;
    }

    onmessage(e) {
        refreshUI(JSON.parse(e.data));
    }

    send(obj){
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
            setTimeout(this.connect.bind(this), delay);
            return
        }
        else {
        }
    }

    onerror(event) {
        // this.attemptReconnection();

    }

    onclose(event) {
        if (event.wasClean) {
          } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
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
        loadFriends()
    }
}

let instance = new userStatusWebSocket()
window.ws = instance