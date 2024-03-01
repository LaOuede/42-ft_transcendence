const apiHandler = {
  baseUrl: "/",

  async fetchWithAuth(url, options = {}) {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const headers = {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
      ...options.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    const fullUrl = `${this.baseUrl}${url}`;

    try {
      let response = await fetch(fullUrl, { ...options, headers });

      if (response.status === 401 && refreshToken) {
        const newTokens = await refreshAccessToken(refreshToken);
        storeTokens(newTokens);

        headers.Authorization = `Bearer ${newTokens.access}`;
        response = await fetch(fullUrl, { ...options, headers });
      }

      const data = await response.json();
      if (!response.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        redirectToLogin();
        throw new Error(data.detail || "Something went wrong");
      }

      return data;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  },

  get(url) {
    return this.fetchWithAuth(url);
  },

  post(url, body) {
    return this.fetchWithAuth(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(url, body) {
    return this.fetchWithAuth(url, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete(url) {
    return this.fetchWithAuth(url, {
      method: "DELETE",
    });
  },
};

async function refreshAccessToken(refreshToken) {
  const response = await fetch("/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token.");
  }

  return await response.json(); // This should return the new access token
}

function storeTokens({ access, refresh }) {
  localStorage.setItem("accessToken", access);
  if (refresh) {
    localStorage.setItem("refreshToken", refresh);
  }
}

function redirectToLogin() {
  document.querySelector(".is-signed-in").style.display = "none";
  document.querySelector(".not-signed-in").style.display = "flex";
  window.loadContent("login/");
}

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

window.apiHandler = apiHandler;

