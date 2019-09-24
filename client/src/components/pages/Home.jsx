import React, { useState, useEffect } from 'react';
import {
  Button,
  FormGroup,
  InputGroup,
  HTMLTable
} from '@blueprintjs/core';
import { Link } from 'react-router-dom';

function Home ({ loggedIn }) {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');

  useEffect(() => {
    if (loggedIn) fetchRooms();
  }, []);

  async function fetchRooms() {
    try {
      const response = await fetch('rooms', {
        accept: "application/json"
      });

      const json = await response.json();

      if (json.rooms && json.rooms.length) {
        setRooms(json.rooms);
      }
    } catch(error) {
      console.error(error);
    }
  }

  function updateRoomName(e) {
    setRoomName(e.target.value);
  }

  function updateRoomDescription(e) {
    setRoomDescription(e.target.value);
  }

  async function createNewRoom(e) {
    e.preventDefault();
    
    try {
      const response = await fetch('rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomName,
          roomDescription,
        })
      });

      const json = await response.json();
      setRooms(json.rooms);
    } catch(error) {
      console.error(error);
    }
    
    setRoomName('');
    setRoomDescription('')
  }

  return (
    <div className="home">
      {
        loggedIn
        ? (
          <>
            <form onSubmit={createNewRoom}>
              <h2>Create a Room</h2>
              <FormGroup label="Name" className="inline" labelFor="room_name" inline={true}>
                <InputGroup id="room_name" value={roomName} onChange={updateRoomName} />
              </FormGroup>
              <FormGroup label="Description" className="inline" labelFor="room_desc" inline={true}>
                <InputGroup id="room_desc" value={roomDescription} onChange={updateRoomDescription} />
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
                        <td><Link to={`/room/${room.name}/`}>{ room.name }</Link></td>
                        <td>{ room.description }</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </HTMLTable>
          </>
        )
        : <p>Log in or Sign up to see a list of chat rooms!</p>
      }
    </div>
  )
}

export default Home;
