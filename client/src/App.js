import React, { useEffect, useState } from 'react';
import LoginOrRegister from './components/LoginOrRegister';
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
  const [newMessageText, setNewMessageText] = useState('');
  const [rooms, setRooms] = useState([]);
  const lsLoggedIn = localStorage.getItem('loggedIn');
  const [loggedIn, setLoggedIn] = useState(lsLoggedIn === 'true');

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

  function updateMessageText(e) {
    setNewMessageText(e.target.value);
  }

  function sendMessage(e) {
    e.preventDefault();
    console.log(newMessageText)
    setNewMessageText('');
  }

  function handleLoggedIn() {
    localStorage.setItem('loggedIn', 'true');
    setLoggedIn(true);
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

  return (
    <div className="App" onSubmit={sendMessage}>
      <header>
        <h1>Chatterbox</h1>
      </header>
      {
        loggedIn
        ? <a href="#" onClick={handleLogout}>Logout</a>
        : <LoginOrRegister onLoggedIn={handleLoggedIn} />
      }
      {
        loggedIn
        ? (
          <>
            <h2>Rooms</h2>
            <table>
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
            </table>
            <form>
              <input type="text" value={newMessageText} onChange={updateMessageText} />
              <button type="submit">Send</button>
            </form>
          </>
        )
        : null
      }
    </div>
  );
}

export default App;
