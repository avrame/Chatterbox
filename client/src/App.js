import React, { useState } from 'react';
import {
  AnchorButton,
  ButtonGroup,
  Dialog,
} from '@blueprintjs/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/pages/Home';
import Room from './components/pages/Room';

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

  async function handleLogout(e) {
    e.preventDefault();
    // log out user
    const response = await fetch('/users/logout', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();
    console.log(json)
    if (json.success) {
      localStorage.clear();
      setLoggedIn(false);
    }
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

  return (
    <Router>
      <div className="app">
        <header>
          <h1>Chatterbox</h1>
          <ButtonGroup className="account-buttons">
            {
              loggedIn
              ? <AnchorButton onClick={handleLogout}>Logout</AnchorButton>
              : (
                <>
                  <AnchorButton onClick={showLogin}>Login</AnchorButton>
                  <AnchorButton onClick={showSignup}>Sign Up</AnchorButton>
                </>
              )
            }
          </ButtonGroup>
        </header>
        <div className="content">      
          <Route path="/" exact render={() => <Home loggedIn={loggedIn} />} />
          <Route path="/room/:roomName" component={Room} />
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
