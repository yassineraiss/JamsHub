import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {TextField, Button} from "@mui/material";

function JoinRoomForm({goBack}) {

    const [roomCode, setRoomCode] = useState(null)
    const navigate = useNavigate()

    const handleJoin = () => {
        if(roomCode) {
            navigate(`/join-room/${roomCode}`)
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center', 
            borderRadius: '15px',
            padding: '2.5vh',
            background: 'linear-gradient(to bottom, hsl(0, 0%, 10%), hsl(295, 26%, 49%), hsl(0, 0%, 10%))'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center', 
                borderRadius: '15px',
                backgroundColor: 'hsl(0, 0%, 10%)',
                width: '100%',
                height: '90%'
            }}>
                <h3 style={{marginBottom: '2.5vh'}}>Enter the room code to join the room:</h3>
                <TextField
                    type="text"
                    color='secondary'
                    label='Room code'
                    sx={{mb: '2.5vh'}}
                    onChange={(e) => setRoomCode(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="secondary" 
                    onClick={handleJoin}
                    style={{ padding: '1.25vh', borderRadius: '20px', width: '50%', marginBottom: '2.5vh'}}
                >
                    <h4 style={{color: 'inherit', marginBottom: 0, fontWeight: 750}}>Join Room</h4>
                </Button>
                <Button
                    variant="contained" 
                    color="inherit"
                    onClick={goBack} 
                    style={{ padding: '1.25vh', borderRadius: '20px', width: '50%'}}
                >
                    <h4 style={{color: 'white', marginBottom: 0, fontWeight: 750}}>Back</h4>
                </Button>
            </div>
        </div>
    )
}

export default JoinRoomForm