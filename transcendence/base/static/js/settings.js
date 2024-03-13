document.addEventListener("DOMContentLoaded", function (e) {
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "view-settings-button") {
      window.loadContent("settings/");
    }
    if (e.target && e.target.id === "view-profile-button") {
      window.loadContent("profile/");
    }
    if (e.target && e.target.id === "enable-2fa-button") {
      handle2FA();
    }
  });
  document.addEventListener("submit", function (e) {
    if (e.target && e.target.id === "profile-update-form") {
      e.preventDefault();
      handleUpdateProfile();
    }
  });
});

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

async function handleUpdateProfile() {
  const username = document.getElementById("username-update").value;
  const avatarFile = document.getElementById("avatar-upload").files[0];
  const email = document.getElementById("email-update").value;

  if (!avatarFile && !username && !email) {
    console.log("No changes detected. No update needed.");
    return;
  }
  const formData = new FormData();

  // Append the avatar file to formData only if a file has been uploaded
  if (avatarFile) {
    const avatarFileType = avatarFile.type;
    if (!avatarFileType.startsWith("image")) {
      handleUpdateProfileErrors("Invalid file type. Please upload an image.");
      return;
    }
    formData.append("avatar", avatarFile);
  }
  if (email) {
    formData.append("email", email);
  }
  // Append the username to formData only if it has been changed
  if (username) {
    formData.append("username", username);
  }

  try {
    await window.apiHandler.post("users/update/", formData);
  } catch (error) {
    console.error("ERROR UPDATING PROFILE", error);
    handleUpdateProfileErrors(error);
  }
  document.getElementById("profile-update-form").reset();
}

function handleUpdateProfileErrors(error) {
  const errorMessage = document.querySelector(
    ".settings-container #profile-update-errors"
  );
  errorMessage.innerHTML = error;
  errorMessage.style.display = "block";
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 3000);
}
