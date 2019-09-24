import React, { useState } from 'react';
import { Button, Classes, FormGroup, InputGroup } from '@blueprintjs/core';

function Login({ onLoggedIn }) {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleUserNameChange(e) {
    setUserName(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function loginUser(e) {
    e.preventDefault();
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

  return (
    <div className={Classes.DIALOG_BODY}>
      <form onSubmit={loginUser}>
        { errorMessage ? <p className="error">{errorMessage}</p> : null }

        <FormGroup label="User Name" labelFor="user_name" labelInfo="(required)">
          <InputGroup id="user_name" value={username} onChange={handleUserNameChange} />
        </FormGroup>

        <FormGroup label="Password" labelFor="password" labelInfo="(required)">
          <InputGroup type="password" id="password" value={password} onChange={handlePasswordChange} />
        </FormGroup>

        <Button type="submit">Login</Button>
      </form>
    </div>
  )
}

export default Login;
