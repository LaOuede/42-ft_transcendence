import { translate } from "./translation/translate.js";

document.addEventListener("DOMContentLoaded", function() {
    let notificationBox = document.getElementById("notificationBox");
    notificationBox.onclick = () => {
        
    }
})


export function showNotification(message) {  

    message = translate(message);

    let notification = document.createElement("div");
    notification.classList.add("notification");
    notification.classList.add("perso-grid-item");
    notification.textContent = message;
    
    document.getElementById("notificationBox").append(notification);
    setTimeout(() => {
      notification.remove();
    }, 4000)
  }