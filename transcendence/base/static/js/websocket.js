import { loadFriends } from "./friends.js";
import { showNotification } from "./notifications.js";

export function test(){
    console.log("Websocket Test import")
}

export class userStatusWebSocket {
    constructor()
    {
        const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
        this.websocket = new WebSocket(
            wsProtocol + "://"
            + window.location.host
            + "/ws/some_url/"
        );
        this.websocket.onopen = e => {console.log("[ JS ] WebSocket connection successful!")}
        this.websocket.onmessage = this.onmessage;
        this.websocket.onclose = this.ondisconnect;
    }

    get socket(){
        return this.websocket;
    }

    onmessage(e) {
        console.log("[WebSocket] Got message: " + e.data);
        refreshUI(JSON.parse(e.data));
    }

    send(obj){
        this.websocket.send(
            JSON.stringify(obj)
        )
    }

    ping(){
        this.send({"message": "ping"})
    }

    change_user_status(username, status) {
        this.send({
            "message": {
                "username": username,
                "status": status
            }
        })
    }

    ondisconnect(e) {
        console.error("[WebSocket] unexpected disconnect")
    }
}

function refreshUI(data)
{
    console.log( data);
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

window.webSocket = new userStatusWebSocket()