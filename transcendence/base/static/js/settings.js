document.addEventListener("DOMContentLoaded", function (e) {
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "settings-button") {
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

function handle2FA() {
  console.log("yoo 2fa");
}
