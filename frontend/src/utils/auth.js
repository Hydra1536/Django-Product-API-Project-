// ==========================
// TOKEN STORAGE
// ==========================
const ACCESS_KEY = "access";
const REFRESH_KEY = "refresh";
const USER_KEY = "user";

export const setTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
};

export const getToken = () => localStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

// ==========================
// USER STORAGE
// ==========================
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// ==========================
// AUTH HELPERS
// ==========================
export const isAuthenticated = () => !!getToken();

export const logout = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = "/login";
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
};