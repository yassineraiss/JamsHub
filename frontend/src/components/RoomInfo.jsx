import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Button } from '@mui/material';
import { Delete, Add, Settings, } from '@mui/icons-material';

function RoomInfo() {
    const navigate = useNavigate();
    const ws = useRef(null); 
    const { roomCode } = useParams();
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [votes, setVotes] =  useState(0);
    const [guests, setGuests] = useState(-1);
    const [disabled, setDisabled] = useState(false);
    const [chatSocket, setChatSocket] = useState(null);
    const [voteSocket, setVoteSocket] = useState(null);

    const deleteRoom = async () => {
        const scriptElement = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
        const iframeElement = document.querySelector('iframe[src="https://sdk.scdn.co/embedded/index.html"]'); // Ensure this is an iframe

        // Log the elements to check if they are found
        console.log('Script element:', scriptElement);
        console.log('Iframe element:', iframeElement);

        // Remove the elements if they exist
        if (scriptElement) {
            console.log('Removing script element');
            scriptElement.parentNode.removeChild(scriptElement);
        } else {
            console.error('Script element not found');
        }

        if (iframeElement) {
            console.log('Removing iframe element');
            iframeElement.parentNode.removeChild(iframeElement);
        } else {
            console.error('Iframe element not found');
        }

        try {
            const response = await api.delete(`/api/room/handle/${roomCode}/`);
            navigate('/');
        } catch (error) {
            console.error(error)
        }
    };

    const handleAddVote = async () => {
        try {
            const res = await api.post(`/api/vote/${roomCode}/`);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const response = await api.get(`/api/room/handle/${roomCode}/`);
                setRoomData(response.data);
            } catch (error) {
                setError('Error fetching room data');
                console.error('Error fetching room data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoomData();

        ws.current = new WebSocket(
            'ws://127.0.0.1:8001/ws/guest/' + roomCode + '/'
        );

        ws.current.onopen = () => {
            console.log('WebSocket connected');
            // You can send a message here if needed, e.g., ws.current.send("Hello");
        };
    
        ws.current.onmessage = (e) => {
            console.log('Received:', e.data);
            const data = JSON.parse(e.data);
            const message = data.message;
            console.log(message);
            if(message == 'connected') {
                setGuests((prevState) => prevState + 1);
            } else {
                setGuests((prevState) => prevState - 1);
            }
            // Handle incoming message here
        };
    
        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    
        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        const socket = new WebSocket(
            'ws://127.0.0.1:8001/ws/sync/' + roomCode + '/'
        );
        setChatSocket(socket);

        const socketVote = new WebSocket(
            'ws://127.0.0.1:8001/ws/vote/' + roomCode + '/'
        );
        setVoteSocket(socketVote);
    }, [roomCode]);

    if (loading) return <h3>Loading...</h3>;
    if (error) return <h3>{error}</h3>;

    const addVote = () => {
        voteSocket.send(JSON.stringify({ 'message': 'add' }));
        handleAddVote();
        setDisabled(true);
    };

    if(votes === roomData.votes_to_skip) {
        if(chatSocket) {
            chatSocket.send(JSON.stringify({ 'message': 'next' }));
        }
        setVotes(0);
        setDisabled(false);
        console.log('skip');
    }
    
    if(voteSocket){
        voteSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            const message = data.message;
            console.log(message);
            if(message == 'add') {
                setVotes((prevState) => prevState + 1);
                if(votes != 0) {
                    setDisabled(true);
                }
            }
        };
    }

    // end of websockets.

    return (
        roomData ? (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'hsl(0, 0%, 5%)',
                borderRadius: '15px',
                padding: '1.25vh'
            }}>
                   
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <h2 style={{alignSelf: 'center'}}>Room Info:</h2> 
                    <h3 style={{color: 'rgba(225, 225, 225, 0.7)', alignSelf: 'start'}}>Host:</h3>
                    <h3>{roomData.host_username}</h3>
                    <h3 style={{color: 'rgba(225, 225, 225, 0.7)', alignSelf: 'start'}}>Code:</h3>
                    <h3>{roomData.code}</h3>
                    <h3 style={{color: 'rgba(225, 225, 225, 0.7)', alignSelf: 'start'}}>Votes to Skip:</h3>
                    <h3>{roomData.votes_to_skip}</h3>
                    <h3 style={{color: 'rgba(225, 225, 225, 0.7)', alignSelf: 'start'}}>Guest Can Pause:</h3>
                    <h3>{roomData.guest_can_pause ? 'Yes' : 'No'}</h3>
                    <h3 style={{color: 'rgba(225, 225, 225, 0.7)', alignSelf: 'start'}}>Guests:</h3>
                    {guests >= 0 ? <h3>{ guests }</h3> : 0}
                    <h3 style={{color: 'rgba(225, 225, 225, 0.7)', alignSelf: 'start'}}>Votes:</h3>
                    <h3>{votes}/{roomData.votes_to_skip}</h3>
                </div>
                <div>    
                    <Button
                        onClick={addVote}
                        disabled={disabled}
                        variant="contained"
                        color="primary"
                        style={{display: 'inline-flex', borderRadius: '20px', width: '100%', alignSelf: 'center', padding: '0.3rem 0', margin: '0.3rem 0'}}
                    >
                        <Add sx={{ mr: 1 }} />
                        <h4 style={{margin: 0, color: 'inherit', fontWeight: '900'}}>Add Vote</h4>
                    </Button>
                    <Button
                        onClick={deleteRoom}
                        variant="contained"
                        color="error" 
                        style={{display: 'inline-flex', borderRadius: '20px', width: '100%', alignSelf: 'center', padding: '0.3rem 0', margin: '0.3rem 0'}}
                    >
                        <Delete sx={{ mr: 0.5 }} />
                        <h4 style={{margin: 0, fontWeight: '900'}}>Delete Room</h4>
                    </Button>
                </div> 
            </div>
        ) : (
            <div>
                <h3>No data</h3>
                <Button
                    variant='contained'
                    color='error'
                    onClick={deleteRoom} 
                    style={{
                        borderRadius: '20px', 
                        marginTop: '1.25vh',
                    }}                    
                >
                    <h3>Delete Room</h3>
                </Button>
            </div>
        )
    );
}

export default RoomInfo;