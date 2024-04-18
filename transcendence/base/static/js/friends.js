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

window.loadFriends = loadFriends