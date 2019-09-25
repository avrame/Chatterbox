import React, { useState } from 'react';
import { Dialog } from '@blueprintjs/core';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/pages/Home';
import Room from './components/pages/Room';
import AccountButtons from './components/AccountButtons';

import './App.css';

function App() {
  const [loginIsOpen, setLoginIsOpen] = useState(false);
  const [signupIsOpen, setSignupIsOpen] = useState(false);
  const lsLoggedIn = localStorage.getItem('loggedIn');
  const [loggedIn, setLoggedIn] = useState(lsLoggedIn === 'true');

  function handleLoggedIn(user) {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    setLoggedIn(true);
    hideLogin();
    hideSignup();
  }

  function showLogin() {
    setLoginIsOpen(true);
  }

  function hideLogin() {
    setLoginIsOpen(false);
  }

  function showSignup() {
    setSignupIsOpen(true);
  }

  function hideSignup() {
    setSignupIsOpen(false);
  }

  function handleLogout() {
    setLoggedIn(false);
  }

  return (
    <Router>
      <div className="app">
        <header>
          <h1>Chatterbox</h1>
          <AccountButtons onLogout={handleLogout}
                          showLogin={showLogin}
                          showSignup={showSignup}
                          loggedIn={loggedIn} />
        </header>
        <div className="content">      
          <Route path="/" exact render={() => <Home loggedIn={loggedIn} />} />
          <Route path="/room/:roomSlug" render={routeProps => (
            loggedIn ? (
              <Room {...routeProps} />
            ) : (
              <Redirect to="/" />
            )
          )} />
        </div>
      </div>

      <Dialog title="Sign Up" isOpen={signupIsOpen} onClose={hideSignup} style={{ width: 300 }}>
        <Signup onLoggedIn={handleLoggedIn} />
      </Dialog>

      <Dialog title="Login" isOpen={loginIsOpen} onClose={hideLogin} style={{ width: 300 }}>
        <Login onLoggedIn={handleLoggedIn} />
      </Dialog>
    </Router>
  );
}

export default App;
