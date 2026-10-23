import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("csrftoken="))
    ?.split("=")
    .slice(1)
    .join("=");

  if (csrfToken) {
    config.headers.set("X-CSRFToken", decodeURIComponent(csrfToken));
  }

  return config;
});

export default apiClient;