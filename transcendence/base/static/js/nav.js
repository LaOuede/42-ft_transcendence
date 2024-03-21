import { playGameV4, playDemo, playGameV2, playGame } from "./pong/pongvs4.js";
import { tournament } from "./pong/tournament.js";
// function to load the appropriate content on the base page
function loadContent(path) {
  const headers = {
    "X-Requested-With": "XMLHttpRequest",
  };

  fetch("/" + path, { headers, credentials: "include" })
    .then((response) => {
      if (!response.ok && response.status === 401) {
        console.log(response.status, response.statusText);
        redirectToLogin();
        alert("Your session has expired. Please log in again.");
      }
      return response.text();
    })
    .then((html) => {
      document.querySelector(".main").innerHTML = html;
      if (path === "pong/playonevsone/") {
        // playGame([1, 1, 0, 0]);
      } else if (path === "pong/playrumble/") {
        // playGame([1, 1, 1, 1]);
      } else if (path === "pong/tournaments/") {
        tournament()
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

async function handleOAuthCallback() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const accessToken = urlParams.get("access_token");
  const refreshToken = urlParams.get("refresh_token");

  if (accessToken && refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("accessToken", accessToken);
  }
}

async function checkToken() {
  let signedInNavbar = document.querySelector(".is-signed-in");
  let notSignedInNavbar = document.querySelector(".not-signed-in");

  try {
    const response = await fetch("/auth/check-session/", {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      if (data.isAuthenticated) {
        console.log("Authenticated");
        signedInNavbar.style.display = "flex";
        notSignedInNavbar.style.display = "none";
        if (history.state && history.state.path) {
          loadContent(history.state.path);
        } else {
          loadContent("");
        }
      } else {
        throw new Error("Not authenticated");
      }
    } else {
      throw new Error(
        "Failed to validate session",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Authentication check failed:", error);
    signedInNavbar.style.display = "none";
    notSignedInNavbar.style.display = "flex";
    loadContent("auth/login/");
  }
}

// Add an "active" class to the current page's link
document.addEventListener("DOMContentLoaded", async function () {
  const currentPath = window.location.pathname;
  await handleOAuthCallback();
  await checkToken();
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
