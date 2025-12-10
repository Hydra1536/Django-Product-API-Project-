import React, { createContext, useContext, useState } from 'react';
import api from './api';


const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }


export function AuthProvider({ children }) {
const [user, setUser] = useState(() => ({ isAuthenticated: !!localStorage.getItem('access_token') }));


async function login(username, password) {
const res = await api.post('/api/token/', { username, password });
localStorage.setItem('access_token', res.data.access);
localStorage.setItem('refresh_token', res.data.refresh);
setUser({ isAuthenticated: true });
return res;
}


function logout() {
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
setUser({ isAuthenticated: false });
window.location.href = '/login';
}


return (
<AuthContext.Provider value={{ user, login, logout }}>
{children}
</AuthContext.Provider>
);
}