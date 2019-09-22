import React, { useEffect, useState } from 'react';
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
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  function fetchMessages() {
    fetch('api/messages', {
      accept: "application/json"
    })
      .then(checkStatus)
      .then(parseJSON)
      .then((json) => {
        if (json.messages && json.messages.length) {
          setMessages(json.messages);
        }
      });
  }

  function updateMessageText(e) {
    setNewMessageText(e.target.value);
  }

  function sendMessage(e) {
    e.preventDefault();
    setNewMessageText('');
    fetch('api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: newMessageText })
    })
      .then(checkStatus)
      .then(() => {
        fetchMessages();
      })
  }

  return (
    <div className="App" onSubmit={sendMessage}>
      <h1>Chatterbox</h1>
      <ul>
        {
          messages.map((message, idx) => <li key={idx}>{ message.text }</li>)
        }
      </ul>
      <form>
        <input type="text" value={newMessageText} onChange={updateMessageText} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
