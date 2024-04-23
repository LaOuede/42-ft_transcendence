// logout function

export function loadFriends() {
    console.log("[DEBUG] loading Friends");
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
            action: "add",
            "friend_username": user_name
        })
        .then((response) => {
        })
        .catch((error) => {
            alert("Cant add user")
            return false
        })
}

function delete_friend(friend_id)
{
    return  window.apiHandler
        .post("friends/delete/", {
            action: "delete",
            friend_id,
        })
        .then((response) => {
        })
        .catch((error) => {
            alert("Cant Delete user")
            return false
        })
}

// Click event listeners
document.addEventListener("click", function(event) {

    if (!event.target)
        return false

    // Add friend request
    if (event.target.id === "add-friend-btn")
    {
        event.preventDefault();
        let input = document.getElementById("add-friend-input");
        let user_name = input.value;
        if (add_friend(user_name) === false)
            alert(`User: ${user_name} not found!`);
        window.webSocket.ping();
        input.value = "";
    }

    // Delete friend
    if (event.target.classList.contains("delete-friend-btn"))
    {
        let friend_id = event.target.dataset.id;
        if (!(friend_id && delete_friend(friend_id)))
            alert("Cant delete Friend")

    }
    return false;
})

window.loadFriends = loadFriends