import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  AnchorButton,
  ButtonGroup,
} from '@blueprintjs/core';

function AccountButtons ({ onLogout, showLogin, showSignup, loggedIn, history }) {
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
      history.push('/');
      onLogout();
    }
  }

  return (
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
  )
}

export default withRouter(AccountButtons);
