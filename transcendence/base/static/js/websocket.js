import { loadFriends } from "./friends.js";

export function test(){
    console.log("Websocket Test import")
}

export class userStatusWebSocket {
    constructor()
    {
        const wsProtocol = window.location.protocol === "https:" ? "ws" : "ws";
        this.websocket = new WebSocket(
            wsProtocol + "://"
            + window.location.host
            + "/ws/some_url/"
        );
        this.websocket.onopen = e => {console.log("[ JS ] WebSocket connection successful!")}
        this.websocket.onmessage = this.onmessage;
    }

    get socket(){
        return this.websocket;
    }

    onmessage(e) {
        console.log("[WebSocket] Got message: " + e.data);
        loadFriends();
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
}

window.webSocket = new userStatusWebSocket()