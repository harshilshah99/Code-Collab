import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import logo from '../images/web-programming.png';
import { v4 as uuidV4 } from 'uuid';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    //Creating new room using uuidV4
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('New room created');
    }
    const joinRoom = (e) => {
        e.preventDefault();
        if (!roomId || !username) {
            toast.error('Room ID and Username is required');
            return;
        }
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            }
        })
    }
    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    }
    useEffect(() => {
        localStorage.setItem('name', JSON.stringify(username))
    }, [username])

    return (
        <div style={{ backgroundColor: '#1e1e1f', display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '18rem', marginTop: '25vh' }}>
                <div style={{ display: 'flex' }}>

                    <Card.Img variant="top" style={{ height: '40px', width: '45px', paddingLeft: '10px', paddingTop: '5px' }} src={logo} />
                    <h3 style={{ paddingTop: '9px', paddingLeft: '18px', color: '#E70B38', fontFamily: '\'Baloo Bhaijaan 2\' , cursive', fontWeight: '800' }}>Code-Collab</h3>
                </div>
                <Card.Body>


                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Text className="text-muted">
                                Paste invitation Room Id
                            </Form.Text>
                            <Form.Control type="text"
                                style={{ fontFamily: '\'Baloo Bhaijaan 2\' , cursive' }}
                                value={roomId} onChange={(e) => setRoomId(e.target.value)}
                                onKeyUp={handleInputEnter}
                                placeholder="ROOM ID" 
                            />

                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">

                            <Form.Control style={{ fontFamily: '\'Baloo Bhaijaan 2\' , cursive' }}
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                onKeyUp={handleInputEnter}
                                placeholder="USERNAME" />
                        </Form.Group>
                        <Button onClick={joinRoom} style={{ backgroundColor: '#E70B38', border: 'none' }} type="submit">
                            Join Room
                        </Button>
                        <Button onClick={createNewRoom} style={{ backgroundColor: '#E70B38', border: 'none', marginLeft: '2.2rem' }} variant="primary" type="submit">
                            Create Room
                        </Button>

                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Home;
