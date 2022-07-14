import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import { initSocket } from '../socket.js';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const Chat = () => {
	const chatRef = useRef()

	const [chat, setChat] = useState([])

	//Getting name from local storage
	const localData = JSON.parse(localStorage.getItem('name'));
	const [state, setState] = useState({ name: localData, message: "" })

	useEffect(() => {
		const init = async () => {
			chatRef.current = await initSocket();
			chatRef.current.on("message", ({ name, message }) => {
				setChat([...chat, { name, message }])
			})

		}
		init()
		return () => chatRef.current.disconnect();

	}, [chat])
	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}
	const onMessageSubmit = (e) => {

		const { name, message } = state;
		console.log(name)
		chatRef.current.emit("message", { name, message })
		e.preventDefault()
		setState({ name, message: "" })

	}

	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3 className='text-name'>
					{name}: <span className='text-message'>{message}</span>
				</h3>
			</div>
		))
	}

	return (
		<>
			<div className="render-chat">
				<h3 style={{ color: 'white', textAlign: 'center', fontFamily: '\'Baloo Bhaijaan 2\' , cursive', borderBottom: '1px solid white', margin: '1rem' }}>Chat Log</h3>
				{renderChat()}
			</div>
			<div className='textbox-message'>

				<InputGroup style={{ width: '100%' }} className="mb-3">
					<Form.Control
						name="message"
						type="text"
						onChange={(e) => onTextChange(e)}
						value={state.message}
						label="Message"
						placeholder="Message"
					/>
					<Button onClick={onMessageSubmit} style={{ boxShadow: 'none', backgroundColor: '#4d67c3', border: 'none' }} id="button-addon2">
						Send
					</Button>
				</InputGroup>
			</div>
		</>
	)
}

export default Chat
