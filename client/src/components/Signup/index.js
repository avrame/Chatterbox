import React, { useState } from 'react';
import { Button, Classes, FormGroup, InputGroup } from '@blueprintjs/core';

function Signup({ onLoggedIn }) {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');


  function handleUserNameChange(e) {
    setUserName(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  async function signupUser(e) {
    e.preventDefault();
    try {
      const response = await fetch('/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
      });

      const json = await response.json();
      if (json.success) {
        onLoggedIn(json.user);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className={Classes.DIALOG_BODY}>
      <form onSubmit={signupUser}>

        { errorMessage ? <p className="error">{errorMessage}</p> : null }

        <FormGroup label="User Name" labelFor="user_name" labelInfo="(required)">
          <InputGroup id="user_name" value={username} onChange={handleUserNameChange} />
        </FormGroup>
        
        <FormGroup label="Email" labelFor="email" labelInfo="(required)">
          <InputGroup id="email" value={email} onChange={handleEmailChange} />
        </FormGroup>

        <FormGroup label="Password" labelFor="password" labelInfo="(required)">
          <InputGroup type="password" id="password" value={password} onChange={handlePasswordChange} />
        </FormGroup>

        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  )
}

export default Signup;
