import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('gms_token');
    const savedStudent = localStorage.getItem('gms_student');
    if (savedToken && savedStudent) {
      setToken(savedToken);
      setStudent(JSON.parse(savedStudent));
    }
    setLoading(false);
  }, []);

  const login = (studentData, jwtToken) => {
    setStudent(studentData);
    setToken(jwtToken);
    localStorage.setItem('gms_token', jwtToken);
    localStorage.setItem('gms_student', JSON.stringify(studentData));
  };

  const logout = () => {
    setStudent(null);
    setToken(null);
    localStorage.removeItem('gms_token');
    localStorage.removeItem('gms_student');
  };

  return (
    <AuthContext.Provider value={{ student, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
