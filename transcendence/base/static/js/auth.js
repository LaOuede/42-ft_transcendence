// -------------------------------------------------//
// LOGIN
// -------------------------------------------------//
document.addEventListener("DOMContentLoaded", function (e) {
  document.body.addEventListener("submit", function (e) {
    if (e.target && e.target.id === "login-form") {
      handleLogin(e);
    }
  });
});

// login function
function handleLogin(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const user = formData.get("user");
  const password = formData.get("password");
  fetch("/login/", {
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
      if (data?.tokens?.access && data?.tokens?.refresh) {
        localStorage.setItem("refreshToken", data.tokens.refresh);
        localStorage.setItem("accessToken", data.tokens.access);

        // to switch navbar
        document.querySelector(".is-signed-in").style.display = "flex";
        document.querySelector(".not-signed-in").style.display = "none";

        window.loadContent("");
      } else {
        handleWrongCredentials(data.error);
        console.log("FAILED TO READ DATA", data);
      }
    });
}

function handleWrongCredentials(error) {
  let formInputs = document.querySelectorAll(".signup-form .input-group input");
  let loginErrorMessage = document.querySelector(
    ".signup-form .login-error-message"
  );
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].value = "";
    formInputs[i].style.borderColor = "#ff000066";
    formInputs[i].blur();
    loginErrorMessage.innerHTML = error || "Invalid username or password.";
    setTimeout(() => {
      loginErrorMessage.innerHTML = "";
      formInputs[i].style.borderColor = "";
    }, 3000);
  }
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
    .post("logout/")
    .then((data) => {
      console.log("Logged out", data);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      document.querySelector(".is-signed-in").style.display = "none";
      document.querySelector(".not-signed-in").style.display = "flex";
      window.loadContent("login/");
    })
    .catch((error) => console.error("ERROR LOGOUT", error));
});

// ---------------------------------------- //
// SIGNUP
// ---------------------------------------- //
document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("submit", function (e) {
    if (e.target && e.target.id === "signup-form") {
      handleSignup(e);
    }
  });
});

function handleSignup(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const password2 = formData.get("password2");
  fetch("/register/", {
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
      if (data?.tokens?.access && data?.tokens?.refresh) {
        localStorage.setItem("refreshToken", data.tokens.refresh);
        localStorage.setItem("accessToken", data.tokens.access);

        // to switch navbar
        document.querySelector(".is-signed-in").style.display = "flex";
        document.querySelector(".not-signed-in").style.display = "none";

        window.loadContent("");
      } else {
        handleSignupError(data);
        console.log("FAILED TO READ DATA", data);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function handleSignupError(data) {
  // Reset all input styles and error messages first
  const formInputs = document.querySelectorAll(
    ".signup-form .input-group input"
  );
  formInputs.forEach((input) => {
    input.style.borderColor = "";
  });

  // Target element for displaying the error message
  const errorElement = document.querySelector(".signup-form .signup-error");
  errorElement.innerHTML = ""; // Clear previous errors

  if (data.error) {
    // Display the error message
    errorElement.innerHTML = data.error;
    errorElement.style.display = "block";

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
