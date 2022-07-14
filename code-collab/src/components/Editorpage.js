import React, { useEffect } from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import logo from '../images/output-onlinepngtools.png';
import Client from './Client';
import Editor from './Editor';
import { useRef } from 'react';
import { initSocket } from '../socket.js';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import Chat from './Chat';

const Editorpage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();

  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  function handleErrors(e) {
    console.log('socket error', e);
    toast.errror('Socket Connection failed , try again later.');
    reactNavigator('/');
  }

  useEffect(() => {

    const init = async () => {

      //Connection with Socket io
      socketRef.current = await initSocket();

      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });
      console.log(clients);

      //For joining
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
          console.log(`${username} joined`);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      }
      );

      //For disconnection
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter(client => client.socketId !== socketId)
        })
      })

    }
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };

  }, [])

  if (!location.state) {
    return <Navigate to="/" />
  }
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room Id has been copied to clipboard')
    } catch (err) {
      toast.error('Could not copy Room Id');
      console.log(err);
    }
  }
  const leaveRoom = () => {
    reactNavigator('/')
  }
  return (
    <div className="minWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className='logoImage' style={{ height: '40px', width: '40px' }} src={logo} alt="logo" />
            <h3 style={{ color: 'rgb(231 11 56 / 78%)', paddingTop: '8px', paddingLeft: '10px', fontWeight: '800' }}>Code-Collab</h3>
          </div>
          <h5 style={{ paddingTop: '1.5rem', paddingBottom: '0.8rem' }}>Connected</h5>
          <div className='clientsList'>
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}

          </div>

        </div>
        <Button className='btn-copy-btn' style={{ backgroundColor: '#4d67c3', border: 'none', outline: 'none' }} onClick={copyRoomId}>COPY ROOM ID</Button>
        <Button className='btn-leave-btn' style={{ backgroundColor: 'rgb(231 11 56 / 78%)', border: 'none' }} onClick={leaveRoom}>LEAVE</Button>
      </div>
      <div className="editorWrap">
        <div className='middleTab'>
          <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => { codeRef.current = code; }} />
        </div>

        <div className='rightTab'>
          <Chat />
        </div>

      </div>
    </div>
  )
}

export default Editorpage;
