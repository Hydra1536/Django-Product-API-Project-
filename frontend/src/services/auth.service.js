import api from "./api";

export const AuthService = {
  login: (email, password) => api.post("/api/token/", { email, password }),

  refresh: (refresh) => api.post("/api/token/refresh/", { refresh }),

  me: () => api.get("/api/accounts/users/me/"),
};
