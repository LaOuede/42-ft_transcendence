
document.addEventListener("DOMContentLoaded", function (e) {
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "settings-button") {
      console.log("Settings");
      handleSettings();
    }
    if (e.target && e.target.id === "enable-2fa-button") {
      handle2FA();
    }
  });
});

function handleSettings() {
  const profileContainer = document.querySelector(
    ".edit-profile-container .profile-container"
  );
  const settingsContainer = document.querySelector(
    ".edit-profile-container .settings-container"
  );

  if (profileContainer.style.display === "none") {
    profileContainer.style.display = "block";
    settingsContainer.style.display = "none";
  } else {
    profileContainer.style.display = "none";
    settingsContainer.style.display = "block";
  }
}

async function handle2FA() {
  window.apiHandler
    .post("users/toggle-2fa/")
    .then((data) => {
      if (data.twoFA !== undefined) {
        console.log("2FA", data.twoFA);
        const twoFA = document.querySelector("#enable-2fa-button");
        if (data.twoFA) {
          twoFA.innerHTML = "Disable 2FA";
        } else {
          twoFA.innerHTML = "Enable 2FA";
        }
      } else {
        console.error("ERROR 2FA", data);
      }
    })
    .catch((error) => console.error("ERROR TOGGLE 2FA", error));
}
