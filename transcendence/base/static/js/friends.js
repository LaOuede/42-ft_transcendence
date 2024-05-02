// logout function
import { showNotification } from "./notifications.js";

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

function make_friend_request(context)
{
    return window.apiHandler
    .post(
        "friends/request/",
        context
    )
    .then((response) =>{
        console.log(response)
        if (response.error)
            showNotification("Error: " + response.error)
    })
    .catch((error) => {        
        showNotification("Can't add this user")
        return false;
    })
}

function add_friend(user_name)
{
    return make_friend_request({
        action: "add",
        "friend_username": user_name
    })
}

function delete_friend(friend_id)
{
    return make_friend_request({
        action: "delete",
        friend_id,
    })
}

function accept_invite(friend_id)
{
    return make_friend_request({
        action: "accept",
        friend_id,
    })
}

function cancel_invite(friend_id)
{
    return make_friend_request({
        action: "cancel",
        friend_id,
    })
}

function decline_invite(friend_id)
{
    return make_friend_request({
        action: "decline",
        friend_id,
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
        input.value = "";
    }

    // Delete friend


    // Accept invite
    if (event.target.classList.contains("friend-btn"))
    {
        let friend_id = event.target.parentElement.parentElement.dataset.id

        if(event.target.classList.contains("accept-invite"))
        {
            console.log("Accept Invite ... ", friend_id)
            accept_invite(friend_id);
        }

        if(event.target.classList.contains("decline-invite"))
        {
            console.log("Decline Invite ...", friend_id)
            decline_invite(friend_id);
        }

        if(event.target.classList.contains("cancel-invite"))
        {
            console.log("Cancel Invite ...", friend_id)
            cancel_invite(friend_id);
        }

        if (event.target.classList.contains("delete-friend-btn"))
        {
            console.log(friend_id)
            if (!(friend_id && delete_friend(friend_id)))
                alert("Cant delete Friend")
        }
    }
    return false;
})

window.loadFriends = loadFriends