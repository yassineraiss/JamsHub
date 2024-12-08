import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import SpotifyLogo from '../styles/images/Spotify_Logo_RGB_White.png';
import SpotifyIcon from '../styles/images/Spotify_Icon_RGB_White.png';
import { CircularProgress, Button } from '@mui/material';
import AudioPlayer from "./AudioPlayer";
import api from '../api';
import { Box, Paper } from "@mui/material";
import RoomChat from "./RoomChat";
import JoinedRoomInfo from "./JoinedRoomInfo";

function MonileJoinedMP() {

    const track = {
        name: "",
        album: {
            images: [
                { url: "" }
            ]
        },
        artists: [
            { name: "" }
        ]
    };

    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(true);
    const [current_track, setTrack] = useState(track); 
    const [switchToSDK, setSwitchToSDK] = useState(null);
    const [audioPlayer, setAudipPlayer] = useState(null);

    const token = localStorage.getItem('spotify_token');

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
    
        document.body.appendChild(script);
    
        window.onSpotifyWebPlaybackSDKReady = () => {
    
            const player = new window.Spotify.Player({
                name: 'JamsHub Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });
    
            setPlayer(player);
            console.log(player);

            player.on('authentication_error', ({ message }) => {
                console.error('Failed to authenticate', message);
            });

            player.on('account_error', ({ message }) => {
                console.error('Failed to validate Spotify account', message);
            });
    
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setConnecting(false);
                setLoading(false);
                setSwitchToSDK(true);
            });
    
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });
    
            player.addListener('player_state_changed', ( state => {
                if (!state) {
                    return;
                }
                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => { 
                    if (!state) {
                        setActive(false);
                    } else {
                        setActive(true);
                        setSwitchToSDK(false);
                    } 
                });
            }));            

            player.connect();
    
        };
    }, []);

    /* web socket session */
    const { roomCode } = useParams();
    const [chatSocket, setChatSocket] = useState(null);

    useEffect(() => {
        const socket = new WebSocket(
            'ws://127.0.0.1:8001/ws/sync/' + roomCode + '/'
        );
        setChatSocket(socket);
    }, []);

    const handleSyncPlayback = () => {
        if(chatSocket) {
            chatSocket.send(JSON.stringify({ 'message': 'toggle' }));
            console.log('print tog')
        } else {
            console.log('WS is not established');
        }
    };

    const startSong = async (message) => {
        try {
            const response = await api.get(`/api/start/${message}/`);
            setLoading(false);
            setAudipPlayer(true);
            setSearch(false);
        } catch (error) {
            console.error(error)
        }
    };

    if(chatSocket){
        chatSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            const message = data.message;
            console.log(message);
            if(message == 'toggle') {
                player.togglePlay();
            } else if(message == 'next') {
                player.nextTrack();
            } else {
                startSong(message);
            }
        };
    }
    /* end of web socket*/

    const [infoIsOpen, setInfoIsOpen] = useState(null);
    const [chatIsOpen, setChatIsOpen] = useState(null);



    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            backgroundColor: 'hsl(0, 0%, 5%)',
            borderRadius: '15px',
            padding: '1.25vh' 
        }}>
            <img src={SpotifyLogo} alt="Logo" style={{ width: '6.5rem', height: 'auto', margin: '1.25vh 0' }} />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {
                    switchToSDK ?
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <h2 style={{color: '#17fa22e3'}}>✅ Connected to spotify.</h2>
                        <h2>Few more steps left:</h2>
                        <h3 style={{alignSelf: 'start', marginBottom: '1.25vh'}}>step 1: Open Spotify </h3>
                        <h3 style={{alignSelf: 'start', marginBottom: '1.25vh'}}>step 2: Click on the Spotify connect button </h3>
                        <h3 style={{alignSelf: 'start', marginBottom: '1.25vh'}}>step 3: Switch to JamsHub Playback SDK </h3>
                        <Button
                            href='https://open.spotify.com/' target='_blank'
                            variant="contained" 
                            color="inherit" 
                            style={{ margin: '1.25vh', padding: '1.25vh', borderRadius: '20px', width: '50%'}}
                        >
                            <h3 style={{display: 'flex', alignItems: 'center', color: 'white', marginBottom: 0, fontWeight: 750}}>
                                Open Spotify <img src={SpotifyIcon} alt='icon' style={{height: '1.5rem', width: '1.5rem'}}/> 
                            </h3>
                        </Button>
                    </div>
                    :
                    null
                }
                { is_active && !audioPlayer ? 
                    <h2 style={{
                        color: 'hsl(295, 100%, 76%)',
                        marginInline: '10%'
                    }}>
                        No jam is played at the moment, waiting for the host to choose a jam
                    </h2>
                    :
                    null
                }
                {connecting ? <h2>Connecting to Spotify</h2> : null}
                { audioPlayer ? 
                    <AudioPlayer current_track={current_track} handleSyncPlayback={handleSyncPlayback} is_paused={is_paused} /> 
                  : null 
                }
                {loading ? <CircularProgress color="primary"/> : null}
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: '100%'
            }}>
                <Button
                    onClick={() => {setInfoIsOpen(!infoIsOpen)}}
                    variant="contained"
                    style={{borderRadius: '20px', width: '40%', padding: '0.3rem 0', margin: '0.3rem 0', backgroundColor:'silver'}}
                >
                    <h4 style={{margin: 0, color: 'inherit', fontWeight: '900'}}>Room Info</h4>
                </Button>
                <Button
                    onClick={() => {setChatIsOpen(!chatIsOpen)}}
                    variant="contained"
                    style={{borderRadius: '20px', width: '40%', padding: '0.3rem 0', margin: '0.3rem 0', backgroundColor:'silver'}}
                >
                    <h4 style={{margin: 0, color: 'inherit', fontWeight: '900'}}>Live Chat</h4>
                </Button>
            </div>
            <Box
                component={Paper}
                elevation={3}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: infoIsOpen ? 0 : '-60%', // Adjust based on drawer width
                    width: '40%',
                    height: '90%',
                    zIndex: 1,
                    overflow: 'hidden',
                    borderRadius: '15px',
                    opacity: infoIsOpen ? 1 : 0,
                    visibility: infoIsOpen ? 'visible' : 'hidden', 
                    transition: 'opacity 0.3s ease, visibility 0.3s ease, left 0.3s ease',
                }}
            >
                <JoinedRoomInfo />
            </Box>
            <Box
                component={Paper}
                elevation={3}
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: '90%',
                    zIndex: 2,
                    overflow: 'hidden',
                    borderRadius: '15px',
                    opacity: chatIsOpen ? 1 : 0, // Smooth fade effect
                    visibility: chatIsOpen ? 'visible' : 'hidden', // Prevent interaction
                    transition: 'opacity 0.3s ease, visibility 0.3s ease, right 0.3s ease',
                }}
            >
                <RoomChat JoinedOrCreated={'join'} />
            </Box>
        </div>
    )
}

export default MonileJoinedMP