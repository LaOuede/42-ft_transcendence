import { playGameV4, playDemo, playGameV2 } from "./pong/pongvs4.js";
// function to load the appropriate content on the base page
function loadContent(path) {
  let accessToken = localStorage.getItem("accessToken");
  const headers = {
    "X-Requested-With": "XMLHttpRequest",
    Authorization: `Bearer ${accessToken}`,
  };

  fetch("/" + path, { headers })
    .then((response) => {
      if (!response.ok && response.status === 401) {
        redirectToLogin();
        throw new Error("Unauthorized access, please log in.");
      }
      return response.text();
    })
    .then((html) => {
      document.querySelector(".main").innerHTML = html;
      if (path === "pong/playonevsone/") {
        // document.querySelector("#pong").style.display = "block"
        // playGameV4()// peut aller sur un bouton pour demarrer la joute
        playGameV2();
      } else if (path === "pong/playrumble/") {
        playGameV4();
        // document.querySelector("#pong").style.display = "none"
        // stopGame()
      } else {
        playDemo();
      }
      if (window.location.pathname !== "/" + path) {
        history.pushState({ path: path }, "", "/" + path);
      }
    })
    .catch((error) => {
      console.error("Error loading content:", error);
      redirectToLogin();
    });
}
// Function to handle redirection to the login page
export function redirectToLogin() {
  loadContent("auth/login/");
  /* localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken"); */
  document.querySelector(".is-signed-in").style.display = "none";
  document.querySelector(".not-signed-in").style.display = "flex";
}

// attach loadContent to window
window.loadContent = loadContent;

// function  that runs when the DOM is loaded to save the history of the pages
window.onpopstate = function (event) {
  if (event.state && event.state.path) {
    loadContent(event.state.path);
  } else {
    loadContent("");
  }
};

// initial function on page load for checking token and pages history
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("accessToken");
  let signedInNavbar = document.querySelector(".is-signed-in");
  let notSignedInNavbar = document.querySelector(".not-signed-in");
  console.log(token);
  if (!token) {
    signedInNavbar.style.display = "none";
    notSignedInNavbar.style.display = "flex";
    loadContent("auth/login/");
  } else {
    notSignedInNavbar.style.display = "none";
    signedInNavbar.style.display = "flex";
    if (history.state && history.state.path) {
      loadContent(history.state.path);
    } else {
      loadContent("");
    }
  }
});

// Add an "active" class to the current page's link
document.addEventListener("DOMContentLoaded", function () {
  // Get the current path of the URL
  const currentPath = window.location.pathname;

  // Get all navigation links
  const navLinks = document.querySelectorAll(
    ".main-nav-links a, .is-signed-in a, .not-signed-in a"
  );

  // Loop through each link and add the "active" class if the href matches the current path
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
});
