document.addEventListener("DOMContentLoaded", function (e) {
	document.addEventListener("click", function (e) {
		if (e.target && e.target.id === "button-delete-user") {
			e.preventDefault();
			showConfirmationDialog();
		}
	});
});

function showConfirmationDialog() {
	if (confirm("Are you sure you want to delete your account?")) {
		deleteAccount();
	}
}

function deleteAccount() {
	window.apiHandler
		.post("user/delete/")
		.then((data) => {
			document.querySelector(".is-signed-in").style.display = "none";
			document.querySelector(".not-signed-in").style.display = "flex";
			window.loadContent("auth/login/");
		})
		.catch((error) => console.log("Error during deletion process"));
}