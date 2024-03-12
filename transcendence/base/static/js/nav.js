import {playGameV2, playGameV4, stopGame, playDemo} from "../js/pong/pongvs4.js";
import {tournament} from "../js/pong/tournament.js";

// function to load the appropriate content on the base page
function loadContent(path) {
  const headers = {
    "X-Requested-With": "XMLHttpRequest",
  };

  // Include the JWT in the Authorization header for authenticated requests
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

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
      if (path === "play/") {
        tournament()
        // document.querySelector("#pong").style.display = "block"
        // playGameV4()// peut aller sur un bouton pour demarrer la joute
        // playGameV2()
      } else {
        // document.querySelector("#pong").style.display = "none"
        // stopGame()
        playDemo()
      }
      if (window.location.pathname !== "/" + path) {
        history.pushState({ path: path }, "", "/" + path);
      }
    })
    .catch((error) => console.error("Error loading content:", error));
}

function initializePongGame() {
  // Check if the game script is already loaded
  if (!document.querySelector("#pong-game-script")) {
    const script = document.createElement("script");
    script.id = "pong-game-script";
    script.src = window.staticUrls.pongScript;
    script.type = "module";
    script.defer = true;
    script.onload = () => {
      window.init_pong_game;
    };
    document.body.appendChild(script);
  }
}

// Function to handle redirection to the login page
export function redirectToLogin() {
  loadContent("login/");
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
  if (!token) {
    signedInNavbar.style.display = "none";
    notSignedInNavbar.style.display = "flex";
    loadContent("login/");
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
