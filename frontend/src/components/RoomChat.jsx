import React, { useState, useEffect, useRef} from 'react';
import styled from "@emotion/styled";
import { useParams } from 'react-router-dom';
import { alpha, InputBase, useTheme } from "@mui/material";

export default function RoomChat({JoinedOrCreated}) {

    const theme = useTheme();
    
    const { roomCode } = useParams();
    const [messages, setMessages] = useState([]);
    const [chatSocket, setChatSocket] = useState(null);

    const LiveChat = styled('div')({
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'hsl(0, 0%, 5%)',
        borderRadius: '15px',
        width: '100%',
        height: '100%'
    });

    const InputField = styled('div')({
        position: 'relative',
        borderRadius: '20px',
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        margin: '0.5rem',
        width: '94%',
        maxWidth: '100%'
    });

    const StyledInputBase = styled(InputBase)({
        height: '100%',
        color: 'white',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
            width: '20ch',
            },
        },
    });

    useEffect(() => {
        const socket = new WebSocket(
            'ws://127.0.0.1:8001/ws/chat/' + roomCode + '/'
        );
        setChatSocket(socket);
    }, []);
    
    if(chatSocket){
        chatSocket.onmessage = (e) => {
            const newMessage = JSON.parse(e.data);
            setMessages(prevMessages => [...prevMessages, newMessage]);
        };
    }

    const inputRef = useRef(null);
    const messageListRef = useRef(null);

    const user = localStorage.getItem('username');

    const handleSendMessage = () => {
        if(chatSocket){
            const inputValue = inputRef.current.value;
            chatSocket.send(JSON.stringify({ 'message': user + ': ' + inputValue }));
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (messageListRef.current) {
          messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <LiveChat id='live_chat'>
            <h2 style={{fontFamily: 'Dosis', margin: '0.5rem auto'}}>
                Live Chat
            </h2>
            <div
                className={
                    JoinedOrCreated === 'create' ? 'create-list-container' : 'join-list-container'
                }
                ref={messageListRef}
            >
                {messages.map((item, index) => (
                    <h4 
                        style={{color: 'white', fontFamily: 'Dosis', margin: 0, maxWidth: '90%'}} 
                        key={index}
                    >
                        {item.message}
                    </h4>
                ))}
            </div>
            <InputField>
                <StyledInputBase
                    placeholder="Send a chat..." 
                    inputProps={{ 'aria-label': 'search' }}
                    inputRef={inputRef}
                    onKeyDown={handleKeyDown}
                />
            </InputField>
        </LiveChat>
    );
}