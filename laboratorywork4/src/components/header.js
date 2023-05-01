import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Music from './music';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user-info'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user-info')));
  const location = useLocation();

  
  const logout = () => {
    localStorage.removeItem('user-info');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/login'; 
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('user-info'));
    setUser(JSON.parse(localStorage.getItem('user-info')));
    if (location.pathname === '/main') {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn, location.pathname]); 

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('user-info'));
    setUser(JSON.parse(localStorage.getItem('user-info')));
  }, []);

  return (
    <div className="header">
      <Music />
      {isLoggedIn ? (
        <>
          <NavLink className="nav-link" to="/main">
            Main
          </NavLink>
          <NavLink className="nav-link" to="#" onClick={logout}>
            Logout
          </NavLink>
          {user && (
            <NavLink className="nav-link" to="/main">
              {user.name} {user.surname}
            </NavLink>
          )}
        </>
      ) : (
        <NavLink className="nav-link" to="/login">
          Log in
        </NavLink>
      )}
    </div>
  );
}

export default Header;
