import React, { useState } from 'react';

function LoginOrRegister({ onLoggedIn }) {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  function handleUserNameChange(e) {
    setUserName(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function switchToRegister(e) {
    e.preventDefault();
    setShowLogin(false);
  }

  function switchToLogin(e) {
    e.preventDefault();
    setShowLogin(true);
  }

  function signUpOrLogin() {
    if (showLogin) {
      loginUser();
    } else {
      signupUser();
    }
  }

  async function loginUser() {
    try {
      const response = await fetch('/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.status === 401) {
        setErrorMessage('Incorrect credentials, please try again.');
      }

      const json = await response.json();
      if (json.success) {
        onLoggedIn();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function signupUser() {
    try {
      const response = await fetch('/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const json = await response.json();
      if (json.success) {
        onLoggedIn();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <form onSubmit={signUpOrLogin}>
      { showLogin ? <h2>Login</h2> : <h2>Register</h2> }

      { errorMessage ? <p className="error">{errorMessage}</p> : null }

      <label htmlFor="username">User Name</label>
      <input type="text" id="username" value={username} onChange={handleUserNameChange} />
      <br />

      <label htmlFor="password">Password</label>
      <input type="password" id="password" value={password} onChange={handlePasswordChange} />
      <br />

      <button type="submit">{ showLogin ? 'Login' : 'Register' }</button>
      {
        showLogin
        ? <a href="#" onClick={switchToRegister}>Create an account</a>
        : <a href="#" onClick={switchToLogin}>Login</a>
      }
    </form>
  )
}

export default LoginOrRegister;
