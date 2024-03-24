const apiHandler = {
  baseUrl: "/",

  async fetchWithAuth(url, options = {}) {
    const isFormData = options.body instanceof FormData;

    const headers = {
      // Set 'Content-Type' to 'application/json' only if the body is not FormData
      ...(!isFormData && { "Content-Type": "application/json" }),
      "X-CSRFToken": getCookie("csrftoken"),
      ...options.headers,
    };

    const fullUrl = `${this.baseUrl}${url}`;

    try {
      let response = await fetch(fullUrl, {
        ...options,
        headers: headers,
        credentials: "include",
        body: isFormData ? options.body : JSON.stringify(options.body),
      });
      const data = await response.json();
      if (!response.ok || response.status === 401) {
        /* localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        redirectToLogin(); */
        throw new Error(data.detail || "Something went wrong");
      }

      return data;
    } catch (error) {
      console.error("ERROR UPDATING PROFILE", error);
      throw error;
    }
  },

  get(url) {
    return this.fetchWithAuth(url);
  },

  post(url, body, options = {}) {
    return this.fetchWithAuth(url, {
      method: "POST",
      body: body,
      ...options,
    });
  },

  put(url, body, options = {}) {
    return this.fetchWithAuth(url, {
      method: "PUT",
      body: body,
      ...options,
    });
  },

  delete(url) {
    return this.fetchWithAuth(url, {
      method: "DELETE",
    });
  },
};

async function refreshAccessToken(refreshToken) {
  const response = await fetch("/auth/token/refresh/", {
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
  window.loadContent("auth/login/");
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "base/") {
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
