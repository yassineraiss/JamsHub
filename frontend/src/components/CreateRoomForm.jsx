import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import CircularProgress from '@mui/material/CircularProgress';
import {Radio, RadioGroup, FormControlLabel, TextField, Button} from "@mui/material";

function CreateRoomForm({goBack}) {

    const [votes_to_skip, setVotes] = useState(2)
    const [guest_can_pause, setGuests] = useState(false)
    const [back, setBack] = useState(true)
    const navigate = useNavigate()

    const handleCreateRoom = async () => {
        setBack(false)
        try {
            const response = await api.post('/api/room/create-list/', { guest_can_pause, votes_to_skip })
            console.log(response)
            navigate(`/created-room/${response.data.code}`)
        } catch(error) {
            throw(error)
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
            background: 'linear-gradient(to bottom, hsl(0, 0%, 10%), hsl(199, 33%, 52%), hsl(0, 0%, 10%))'
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
                <h3>Guest can pause?</h3>
                <RadioGroup
                    row
                    name="radio-buttons-group"
                    value={guest_can_pause}
                    onChange={(e) => setGuests(e.target.value) }
                >
                    <FormControlLabel value="false" control={<Radio color='primary' />} label="No" style={{ color: 'white', fontWeight: '600'}} />
                    <FormControlLabel value="true" control={<Radio color='primary'/>} label="Yes" style={{ color: 'white', fontWeight: '600'}} />
                </RadioGroup>
                <h3 style={{marginBottom: '2.5vh'}}>Votes required to skip</h3>
                <TextField
                    id="outlined-number"
                    type="number"
                    color='primary'
                    sx={{mb: '2.5vh'}}
                    defaultValue={votes_to_skip}
                    onChange={(e) => setVotes(e.target.value) }
                />
                <Button
                    variant="contained" 
                    color="primary" 
                    onClick={handleCreateRoom}
                    style={{ padding: '1.25vh', borderRadius: '20px', width: '50%', marginBottom: '2.5vh'}}
                >
                    <h4 style={{color: 'inherit', marginBottom: 0, fontWeight: 750}}>Create Room</h4>
                </Button>
                {
                    back ?
                    <Button
                        variant="contained" 
                        color="inherit" 
                        onClick={goBack}
                        style={{ padding: '1.25vh', borderRadius: '20px', width: '50%'}}
                    >
                        <h4 style={{color: 'white', marginBottom: 0, fontWeight: 750}}>Back</h4>
                    </Button>
                    :
                    <CircularProgress color="primary"/>
                }
            </div>
        </div>
    )
}

export default CreateRoomForm