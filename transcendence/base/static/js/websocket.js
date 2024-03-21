
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
        this.websocket.onmessage = this.onmessage;
    }

    get socket(){
        return this.websocket;
    }

    onmessage(e) {
        console.log("Get message " + e.data + " from websocket")

        let data = JSON.parse(e.data);
        let username = data.message.username;
        let spans = document.querySelectorAll("ul > li > span");
        let target_span = Array.from(spans).find(span => {
            return span.parentNode.textContent.includes(username);
        });

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
                console.log(username + " Is logging out.🔴")
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

