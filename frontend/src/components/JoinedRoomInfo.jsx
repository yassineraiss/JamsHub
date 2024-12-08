import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { Button } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';

function JoinedRoomInfo() {
    const navigate = useNavigate();
    const guestWS = useRef(null);
    const voteWS = useRef(null);
    const { roomCode } = useParams();
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [votes, setVotes] =  useState(0);
    const [guests, setGuests] = useState(0);
    const [disabled, setDisabled] = useState(false);
 
    const leaveRoom = () => {

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

        guestWS.current.close();
        voteWS.current.close();
        deleteGuest();
        navigate('/');
    };

    const handleAddVote = async () => {
        try {
            const res = await api.post(`/api/vote/${roomCode}/`);
        } catch (error) {
            console.error(error);
        }
    };

    const addGuest = async () => {
        try {
            const res = await api.post(`/api/guest/${roomCode}/`);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteGuest = async () => {
        try {
            const res = await api.delete(`/api/guest/${roomCode}/`);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const response = await api.get(`/api/room/handle/${roomCode}/`);
                setRoomData(response.data);
                setVotes(response.data.room_votes);
                setGuests(response.data.room_guests);
                console.log(response.data);
            } catch (error) {
                setError('Error fetching room data');
                console.error('Error fetching room data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoomData();
    }, [roomCode]);

    useEffect(() => {

        if (!roomData) return;

        voteWS.current = new WebSocket(
            'ws://127.0.0.1:8001/ws/vote/' + roomCode + '/'
        );

        voteWS.current.onopen = () => {
            console.log('Votes WebSocket connected');
        };

        voteWS.current.onmessage = (e) => {
            console.log('Votes WebSocket Received:', e.data);
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

        voteWS.current.onerror = (error) => {
            console.error('Votes WebSocket error:', error);
        };

        voteWS.current.onclose = () => {
            console.log('Votes WebSocket disconnected');
        };
    
        // WebSocket connection after the state is updated with room data
        guestWS.current = new WebSocket(
            'ws://127.0.0.1:8001/ws/guest/' + roomCode + '/'
        );
    
        guestWS.current.onopen = () => {
            console.log('Guests WebSocket connected');
            addGuest();
        };
    
        guestWS.current.onmessage = (e) => {
            console.log('Guests WebSocket Received:', e.data);
            const data = JSON.parse(e.data);
            const message = data.message;
            console.log(message);
            if(message === 'connected') {
                setGuests((prevState) => prevState + 1);
            } else {
                setGuests((prevState) => prevState - 1);
            }
        };
    
        guestWS.current.onerror = (error) => {
            console.error('Guests WebSocket error:', error);
        };
    
        guestWS.current.onclose = () => {
            console.log('Guests WebSocket disconnected');
        };

    }, [roomData]);

    if (loading) return <h3>Loading...</h3>;
    if (error) return <h3>{error}</h3>;


    if(votes == roomData.votes_to_skip) {
        setVotes(0);
        setDisabled(false);
        console.log('skip');
    }

    const addVote = () => {
        voteWS.current.send(JSON.stringify({ 'message': 'add' }));
        handleAddVote();
        setDisabled(true);
    };

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
                    <h3>{ guests }</h3>
                    <h3 style={{color: 'rgba(225, 225, 225, 0.7)', alignSelf: 'start'}}>Votes:</h3>
                    <h3>{votes}/{roomData.votes_to_skip}</h3>
                </div>
                <div>              
                    <Button
                        onClick={addVote}
                        disabled={disabled}
                        variant="contained"
                        color="secondary"
                        style={{display: 'inline-flex', borderRadius: '20px', width: '100%', alignSelf: 'center', padding: '0.3rem 0', margin: '0.3rem 0'}}
                    >
                        <Add sx={{ mr: 1 }} />
                        <h4 style={{margin: 0, color: 'inherit', fontWeight: '900'}}>Add Vote</h4>
                    </Button>
                    <Button
                        onClick={leaveRoom}
                        variant="contained"
                        color="error" 
                        style={{display: 'inline-flex', borderRadius: '20px', width: '100%', alignSelf: 'center', padding: '0.3rem 0', margin: '0.3rem 0'}}
                    >
                        <Delete sx={{ mr: 0.5 }} />
                        <h4 style={{margin: 0, fontWeight: '900'}}>Leave Room</h4>
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

export default JoinedRoomInfo;