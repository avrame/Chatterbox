import React, { useEffect, useState } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import {
  AnchorButton,
  Button,
  ButtonGroup,
  Dialog,
  FormGroup,
  InputGroup,
  HTMLTable
} from '@blueprintjs/core';
import './App.css';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}

function App() {
  const [rooms, setRooms] = useState([]);
  const [loginIsOpen, setLoginIsOpen] = useState(false);
  const [signupIsOpen, setSignupIsOpen] = useState(false);
  const lsLoggedIn = localStorage.getItem('loggedIn');
  const [loggedIn, setLoggedIn] = useState(lsLoggedIn === 'true');
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    if (loggedIn) fetchRooms();
  }, []);

  function fetchRooms() {
    fetch('rooms', {
      accept: "application/json"
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((json) => {
        if (json.rooms && json.rooms.length) {
          setRooms(json.rooms);
        }
      });
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

  function handleLoggedIn() {
    localStorage.setItem('loggedIn', 'true');
    setLoggedIn(true);
    hideLogin();
    hideSignup();
    fetchRooms();
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
    if (json.success) {
      localStorage.removeItem('loggedIn');
      setLoggedIn(false);
    }
  }

  function updateRoomName(e) {
    setRoomName(e.target.value);
  }

  function createNewRoom(e) {
    e.preventDefault();
    console.log(roomName);
    setRoomName('');
  }

  return (
    <div className="app">
      <header>
        <h1>Chatterbox</h1>
        <ButtonGroup className="account-buttons">
          {
            loggedIn
            ? <AnchorButton onClick={handleLogout}>Logout</AnchorButton>
            : <>
              <AnchorButton onClick={showLogin}>Login</AnchorButton>
              <AnchorButton onClick={showSignup}>Sign Up</AnchorButton>
            </>
          }
        </ButtonGroup>
      </header>
      <div className="content">      
        {
          loggedIn
          ? (
            <>
              <form onSubmit={createNewRoom}>
                <FormGroup label="Create a Room" className="inline" labelFor="new_room" inline={true}>
                  <InputGroup id="new_room" value={roomName} onChange={updateRoomName} />
                </FormGroup>
                <Button type="submit">Create</Button>
              </form>
              <h2>Rooms</h2>
              <HTMLTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    rooms.map((room, idx) => {
                      return (
                        <tr key={idx}>
                          <td>{ room.name }</td>
                          <td>{ room.description }</td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </HTMLTable>
            </>
          )
          : null
        }

        <Dialog title="Sign Up" isOpen={signupIsOpen} onClose={hideSignup} style={{ width: 300 }}>
          <Signup onLoggedIn={handleLoggedIn} />
        </Dialog>

        <Dialog title="Login" isOpen={loginIsOpen} onClose={hideLogin} style={{ width: 300 }}>
          <Login onLoggedIn={handleLoggedIn} />
        </Dialog>
      </div>
    </div>
  );
}

export default App;
