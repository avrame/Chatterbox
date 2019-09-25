import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button, FormGroup, InputGroup } from '@blueprintjs/core';

import styles from './index.module.css';

let messageSocket;

function Room({ match }) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const [socketOpen, setSocketOpen] = useState(false);

  const bottomOfChat = useRef(null);

  useEffect(() => {
    getRoom();
    getMessages();
  }, []);

  useEffect(() => {
    messageSocket = new WebSocket("ws://localhost:8080");
    return () => {
      messageSocket.close();
    }
  }, []);

  useEffect(() => {
    messageSocket.onopen = (event) => {
      setSocketOpen(true);
    };
    
    messageSocket.onmessage = event => {
      const json = JSON.parse(event.data);
      if (json && json.data) {
        if (json.data.room === roomName && json.data.text) {
          setMessages([...messages, { text: json.data.text }]);
        }
      }
    };
  }, [messages, roomName]);

  useEffect(() => {
    bottomOfChat.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className={styles.room}>
      <Link to='/'>&lt; Back</Link>
      <h2>{ roomName }</h2>
      <p className={styles.description}>{ roomDesc }</p>
      <div className={styles.messagesContainer}>
        <div className={styles.messages}>
          {
            messages.map((message, idx) => {
              return <div key={idx}>{ message.text }</div>;
            })
          }
          <p ref={bottomOfChat} className={styles.bottom}></p>
        </div>
      </div>
      <form onSubmit={sendMessage}>
        <div className={styles.form}>
          <FormGroup className={styles.formGroup} contentClassName={styles.formContent} inline={true}>
            <InputGroup value={messageText} onChange={updateMessageText} fill={true} />
          </FormGroup>
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  )
}

export default Room;