// logout function

export function loadFriends() {

    console.log("[DEBUG] Getting Friends");
    fetch(window.location.origin + "/friends/list/")
    .then(res => res.text())
    .then(data => {
        let friendsDiv = document.querySelector("#friends-div")
        if (friendsDiv)
            friendsDiv.innerHTML = data;
    })
}

function add_friend(user_name)
{
    return window.apiHandler
        .post("friends/add/", {
            "friend_username": user_name
        })
        .then((response) => {
        })
        .catch((error) => {
            alert("Cant add user")
            return false
        })
}

document.addEventListener("click", function(event) {

    // Add friend request
    if (event.target && event.target.id === "add-friend-btn")
    {
        event.preventDefault();
        let user_name = document.getElementById("add-friend-input").value;
        if (add_friend(user_name) === false)
            alert(`User: ${user_name} not found!`);
        window.webSocket.ping();
    }
    return false;
})

window.loadFriends = loadFriends