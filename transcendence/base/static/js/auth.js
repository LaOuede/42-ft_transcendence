import { checkToken } from "./nav.js";
// -------------------------------------------------//
// LOGIN
// -------------------------------------------------//

document.addEventListener("DOMContentLoaded", function (e) {
  document.body.addEventListener("submit", function (e) {
    e.preventDefault();
    if (e.target && e.target.id === "login-form") {
      handleLogin(e);
    } else if (e.target && e.target.id === "otp-form") {
      verifyOTP(e);
    } else if (e.target && e.target.id === "signup-form") {
      handleSignup(e);
    }
  });
  document.body.addEventListener("click", function (e) {
    if (e.target && e.target.id === "oauth-login") {
      handleOAuthLogin(e);
    }
  });
});

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// login function
function handleLogin(e) {
  e.preventDefault();
  let loader = document.querySelector(".lds-default");
  loader.style.display = "inline-block";
  const formData = new FormData(e.target);
  const user = formData.get("user");
  const password = formData.get("password");

  const loginButton = document.querySelector("#login-form button");
  loginButton.disabled = true;

  fetch("/auth/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify({ user: user, password: password }),
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data?.success && !data?.session_token) {
        // to switch navbar
        document.querySelector(".is-signed-in").style.display = "flex";
        document.querySelector(".not-signed-in").style.display = "none";

        window.loadContent("");
        return;
      } else if (data?.session_token && data?.session_token !== "") {
        localStorage.setItem("sessionToken", data.session_token);
        window.loadContent("auth/otp/");
        return;
      } else {
        handleWrongCredentials(data.error);
        /* console.log("FAILED TO READ DATA", data); */
        return;
      }
    })
    .catch((error) => {
      /* console.error("Error:", error); */
    })
    .finally(() => {
      loginButton.disabled = false;
      loader.style.display = "none";
    });
}

function verifyOTP(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const otp = formData.get("otp");
  const sessionToken = localStorage.getItem("sessionToken");
  const loader = document.querySelector(".lds-default");
  loader.style.display = "inline-block";

  const otpButton = document.querySelector("#otp-form button");
  otpButton.disabled = true;

  fetch("/auth/verify-otp/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify({ otp: otp, session_token: sessionToken }),
    credentials: "include",
  })
    .then((response) => response.json())
    .then(async (data) => {
      if (data?.success) {
        document.querySelector(".is-signed-in").style.display = "flex";
        document.querySelector(".not-signed-in").style.display = "none";
        loadContent("");
      } else {
        handleWrongOtp(data);
      }
    })
    .finally(() => {
      document.querySelector("#otp-form button").disabled = false;
      loader.style.display = "none";
    });
}

function handleWrongOTPStyle(otpErrorMessage) {
  let otpInput = document.querySelector("#otp-form input");
  otpInput.value = "";
  otpInput.style.borderColor = "red";
  otpInput.blur();
  setTimeout(() => {
    otpErrorMessage.innerHTML = "";
    otpInput.style.borderColor = "";
  }, 3000);
}

function handleWrongOtp(data) {
  let loader = document.querySelector(".lds-default");
  if (data?.error === "Invalid OTP.") {
    let otpErrorMessage = document.querySelector("#otp-form .otp-error");
    otpErrorMessage.innerHTML = "Invalid OTP. Please try again.";
    handleWrongOTPStyle(otpErrorMessage);
  } else if (data?.error === "OTP expired.") {
    let otpErrorMessage = document.querySelector("#otp-form .otp-error");
    otpErrorMessage.innerHTML = "OTP expired. Please login again.";
    handleWrongOTPStyle(otpErrorMessage);
    loadContent("auth/login/");
  } else {
    loadContent("auth/login/");
  }
  loader.style.display = "none";
}

function handleWrongCredentials(error) {
  /* console.log("Error:", error); */

  let formInputs = document.querySelectorAll(".signup-form .input-group input");
  let loginErrorMessage = document.querySelector(
    ".signup-form .login-error-message"
  );
  let errorContainer = document.querySelector(".signup-form .error-container");

  // Réinitialisez tous les styles d'entrée d'abord
  formInputs.forEach((input) => {
    input.classList.remove("error");
  });

  // Affichez le message d'erreur
  loginErrorMessage.innerHTML = error || "Invalid username or password.";
  errorContainer.classList.add("show-error"); // Ajoutez la classe pour afficher le message d'erreur

  // Ajoutez la classe 'error' aux champs d'entrée
  formInputs.forEach((input) => {
    input.classList.add("error");
  });

  // Nettoyez le message d'erreur après 3 secondes
  setTimeout(() => {
    loginErrorMessage.innerHTML = "";
    errorContainer.classList.remove("show-error"); // Retirez la classe pour cacher le message d'erreur

    // Retirez la classe 'error' des champs d'entrée
    formInputs.forEach((input) => {
      input.classList.remove("error");
    });
  }, 3000);
}

// Function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// logout function
let logoutButton = document.querySelector("#logout-div");
logoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  window.apiHandler
    .post("auth/logout/")
    .then(async (data) => {
      await logout(data);
    })
    .catch((error) => console.log("ERROR LOGOUT"));
});

async function logout(data) {
  document.querySelector(".is-signed-in").style.display = "none";
  document.querySelector(".not-signed-in").style.display = "flex";
  window.loadContent("auth/login/");
}

function handleSignup(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const password2 = formData.get("password2");

  const signupButton = document.querySelector("#signup-form button");
  signupButton.disabled = true;

  fetch("/auth/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
      password2: password2,
    }),
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data?.success) {
        // to switch navbar
        document.querySelector(".is-signed-in").style.display = "flex";
        document.querySelector(".not-signed-in").style.display = "none";

        window.loadContent("");
      } else {
        handleSignupError(data);
      }
    })
    .catch((error) => {
      console.log("Error signing up!");
    })
    .finally(() => {
      signupButton.disabled = false;
    });
}

function handleSignupError(data) {
  // Reset all input styles first
  const formInputs = document.querySelectorAll(
    ".signup-form .input-group input"
  );
  formInputs.forEach((input) => {
    input.style.borderColor = "";
  });

  // Target the element for displaying the error message
  const errorElement = document.querySelector(".signup-error");
  errorElement.innerHTML = ""; // Clear previous errors

  if (data.error) {
    // Display the error message
    errorElement.innerHTML = data.error;
    errorElement.style.display = "block";

    // Highlight the corresponding input based on the error type
    if (data.error.includes("Username")) {
      const usernameInput = document.querySelector(
        ".signup-form input[name='username']"
      );
      highlightErrorInput(usernameInput);
    } else if (data.error.includes("Email")) {
      const emailInput = document.querySelector(
        ".signup-form input[name='email']"
      );
      highlightErrorInput(emailInput);
    } else if (data.error.includes("password")) {
      const passwordInputs = document.querySelectorAll(
        ".signup-form input[type='password']"
      );
      passwordInputs.forEach((input) => highlightErrorInput(input));
    } // You can add more conditions here for other fields if necessary

    // Hide the error message after a delay
    setTimeout(() => {
      errorElement.innerHTML = "";
      errorElement.style.display = "none";
      formInputs.forEach((input) => {
        input.style.borderColor = "";
      });
    }, 3000);
  }
}

// Helper function to highlight an input with an error
function highlightErrorInput(input) {
  input.style.borderColor = "#ff000066";
  input.value = ""; // Optionally clear the input
  input.focus(); // Set focus to the input with the error
}

// ------------------------------
// OAUTH
// ------------------------------

function handleOAuthLogin(e) {
  e.preventDefault();
  const url = "/auth/start";

  const oauthButton = document.querySelector("#oauth-login button");

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      // the backend redirects to the oauth provider. The frontend should not do anything with the response
      window.location.href = data.url;
    })
    .catch((error) => {
      console.log("ERROR OAUTH LOGIN!");
    })
    .finally(() => {
      oauthButton.disabled = false;
    });
}
