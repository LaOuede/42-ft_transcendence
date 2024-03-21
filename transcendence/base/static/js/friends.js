import {userStatusWebSocket} from "./websocket.js"

let socket = new userStatusWebSocket()

// const loginBtn = document.getElementById("login")
// const logoutBtn = document.getElementById("logout")
// document.querySelector(".logbutton")

// logoutBtn.onclick = (e) => {
//     let user = "Dave";
//     let status = "OF";
//     socket.change_user_status(user, status);
// }

// loginBtn.onclick = (e) => {
//     let user = "Dave";
//     let status = "ON";
//     socket.change_user_status(user, status);
// }