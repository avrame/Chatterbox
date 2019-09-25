import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { H2, Button, InputGroup, ControlGroup } from '@blueprintjs/core';
import gravatar from 'gravatar';
import EmojiPicker from 'react-emojipicker';

import styles from './index.module.css';

let messageSocket;
let user;

function Room({ match }) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const [socketOpen, setSocketOpen] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const bottomOfChat = useRef(null);
  const messageField = useRef(null);

  useEffect(() => {
    getRoom();
    getMessages();
    user = JSON.parse(localStorage.getItem('user'));
  }, []);

  useEffect(() => {
    const websocketURL = (window.location.host === 'localhost:3000')
    ? 'ws://localhost:3001' : 'wss://chatter-box.herokuapp.com';
    messageSocket = new WebSocket(websocketURL);
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
        if (json.data.room === match.params.roomSlug && json.data.text) {
          setMessages([...messages, json.data]);
        }
      }
    };
  }, [messages, roomName]);

  useEffect(() => {
    bottomOfChat.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function getRoom() {
    try {
      const response = await fetch(`/rooms/${match.params.roomSlug}`, {
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
      const response = await fetch(`/messages/${match.params.roomSlug}`, {
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

    if (messageText.length === 0) return;

    if (socketOpen) {
      messageSocket.send(JSON.stringify({
        action: 'postMessage',
        data: {
          user_id: user._id,
          text: messageText,
          room: match.params.roomSlug,
        }
      }));
    }

    setMessageText('');
  }

  function showEmojiPicker() {
    setEmojiPickerVisible(true);
  }

  function insertEmoji(emoji) {
    setEmojiPickerVisible(false);
    setMessageText(messageText + emoji.unicode);
    messageField.current.focus();
  }

  return (
    <div className={styles.room}>
      <Link to='/'>&lt; Back</Link>
      <H2>{ roomName }</H2>
      <p className={styles.description}>{ roomDesc }</p>
      <div className={styles.messagesContainer}>
        <div className={styles.messages}>
          {
            messages.map((message, idx) => {
              let gravURL = gravatar.url(message.user.email)
              return (
                <div key={idx}>
                  <img src={gravURL} />
                  { message.text }
                </div>
              );
            })
          }
          <p ref={bottomOfChat} className={styles.bottom}></p>
        </div>
      </div>
      <form onSubmit={sendMessage}>
        { emojiPickerVisible ? <div className={styles.emojiWrapper}><EmojiPicker onEmojiSelected={insertEmoji} modal={true} /></div> : null }
        <ControlGroup fill={true}>
          <Button onClick={showEmojiPicker}>😀</Button>
          <InputGroup inputRef={messageField} value={messageText} onChange={updateMessageText} fill={true} />
          <Button type="submit">Send</Button>
        </ControlGroup>
      </form>
    </div>
  )
}

export default Room;
