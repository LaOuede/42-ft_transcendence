// logout function

let friends_list_btn = document.getElementById("add-friend-btn");
friends_list_btn.addEventListener("click", function (e) {
    e.preventDefault();
    window.apiHandler
        .get("friends/add/")
        .then(async (data) => {
            console.log("HERE")
            await test(data);
        })
        .catch((error) => console.error("ERROR LOGOUT", error));
});

async function test(data) {
    window.loadContent("friends/add/");
}



// friends_list.onclick = function(e) {
// 	return
// 	let username = document.getElementById('add-friend-input').value;
//     if (!username) {
//         alert('Please enter a username.');
//         return;
//     }

// 	let formData = new FormData();
//     formData.append('sender_id', '{{user_data.pk}}');
// 	formData.append('reciever', username)
//     formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');

// 	fetch('{% url "add-friend-request" %}', {
//         method: 'POST',
//         body: formData,
//         credentials: 'same-origin',
//     })
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         }
//         throw new Error('Network response was not ok.');
//     })
// 	.then(data => {
// 		console.log(data)
//         // Refresh using web socket
//     })
// 	.catch(error => {
//         console.error('There has been a problem with your fetch operation:', error);
//     });
// }