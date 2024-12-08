import { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import SpotifyLogo from '../styles/images/Spotify_Logo_RGB_White.png';
import SpotifyIcon from '../styles/images/Spotify_Icon_RGB_White.png';
import { InputBase, InputAdornment, CircularProgress, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styled from "@emotion/styled";
import AudioPlayer from "./AudioPlayer";
import MPSearch from "./MPSeaarch";
import api from '../api';

function JoinedMP() {

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
    const [search, setSearch] = useState(null);
    const [tracks, setTracks] = useState([]);

    const inputRef = useRef(null);

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

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            backgroundColor: 'hsl(0, 0%, 5%)',
            borderRadius: '15px',
            padding: '1.25vh'
        }}>
            <img src={SpotifyLogo} alt="Logo" style={{ width: '6.5rem', height: 'auto', margin: '1.25vw 0' }} />
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
                {loading ? <CircularProgress color="secondary"/> : null}
                { audioPlayer ? 
                    <AudioPlayer current_track={current_track} handleSyncPlayback={handleSyncPlayback} is_paused={is_paused} /> 
                  : null 
                }
            </div>
        </div>
    )
}

export default JoinedMP