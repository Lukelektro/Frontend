// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { buildApiUrl } from '../config/config';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  /* 1⃣  Al montar, intenta cargar el perfil con el token */
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) return;

    axios
      .get(buildApiUrl('/api/auth/me'), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        // Obtener información completa del usuario
        try {
          const profileRes = await axios.get(buildApiUrl("/api/auth/profile"), {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser({ ...res.data, ...profileRes.data });
        } catch {
          setUser(res.data);
        }
      })
      .catch(() => setUser(null));
  }, []);

  /* 2⃣  Cerrar sesión */
  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}