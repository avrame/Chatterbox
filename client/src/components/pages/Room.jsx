import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, FormGroup, InputGroup } from '@blueprintjs/core';

let messageSocket = new WebSocket("ws://localhost:8080");

function Room({ match }) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const [socketOpen, setSocketOpen] = useState(false);

  useEffect(() => {
    getRoom();
    getMessages();
    messageSocket.addEventListener('open', (event) => {
      console.log('socket open', event)
      setSocketOpen(true);
    });
    messageSocket.addEventListener('message', event => {
      console.log('message', event.data)
    });
  }, []);

  async function getRoom() {
    try {
      const response = await fetch(`/rooms/${match.params.roomName}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      const json = await response.json();
      if (json && json.room) {
        setRoomName(json.room.name);
        setRoomDesc(json.room.description);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getMessages() {
    try {
      const response = await fetch(`/messages/${match.params.roomName}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      const json = await response.json();
      if (json && json.messages) {
        setMessages(json.messages);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function updateMessageText(e) {
    setMessageText(e.target.value);
  }

  async function sendMessage(e) {
    e.preventDefault();

    if (socketOpen) {
      messageSocket.send(JSON.stringify({
        action: 'postMessage',
        data: {
          text: messageText,
          room: roomName,
        }
      }));
    }

    setMessageText('');
  }

  return (
    <div className="room">
      <Link to='/'>&lt; Back</Link>
      <h2>{ roomName }</h2>
      <p>{ roomDesc }</p>
      <ol>
        {
          messages.map((message, idx) => {
            return <li key={idx}>{ message.text }</li>;
          })
        }
      </ol>
      <form onSubmit={sendMessage}>
        <FormGroup>
          <InputGroup value={messageText} onChange={updateMessageText} />
        </FormGroup>
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}

export default Room;
