
export function test(){
    console.log("Websocket Test import")
}

export class userStatusWebSocket {
    constructor()
    {
        this.websocket = new WebSocket(
            'ws://'
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
        console.log("Get message " + e.data + " from websocket")

        let data = JSON.parse(e.data);
        let username = data.message.username;
        let userStatusEntries = document.querySelectorAll(".user-status-entry");
        let target_entry = Array.from(userStatusEntries).find(e => {
            return e.querySelector(".username").textContent.includes(username);
        });

        console.log("target_entry: ", target_entry);
        let target_span = target_entry.querySelector(".user-status-circle")

        switch(data.message.status) {
            case "ON":
                target_span.style.backgroundColor = 'green';
              break;
            case "OF":
                target_span.style.backgroundColor = 'red';
              break;
            case "UN":
                target_span.style.backgroundColor = 'yellow';
              break;
            case "IG":
                target_span.style.backgroundColor = 'purple';
              break;
          } 
    }

    change_user_status(username, status) {
        this.websocket.send(
            JSON.stringify({
                "message": {
                    "username": username,
                    "status": status
                }
            })
        )
    }
}

let socket = new userStatusWebSocket()