import { Button } from "@mui/material";

function CreateOrJoin({activeCreate, activeJoin}) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center', 
            borderRadius: '15px'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
            }}>
                <h2 style={{marginBottom: '0.5rem'}}>Share your Jam with your favorite people 🌟</h2>
                <p>
                    Create or join a room where you can gather your friends 
                    to consume your favorite auditive content and engage 
                    with each other through the live chat
                </p>
                <Button
                    variant="contained" 
                    color="primary" 
                    onClick={activeCreate}
                    style={{ padding: '1.25vh', borderRadius: '20px', width: '50%', alignSelf: 'center', marginBottom: '2.5vh', marginTop: '2.5vh'}}
                >
                    <h4 style={{color: 'inherit', marginBottom: 0, fontWeight: 750}}>Create Room</h4>
                </Button>
                <Button
                    variant="contained" 
                    color="secondary" 
                    onClick={activeJoin}
                    style={{padding: '1.25vh', borderRadius: '20px', width: '50%', alignSelf: 'center'}}
                >
                    <h4 style={{color: 'inherit', marginBottom: 0, fontWeight: 750}}>Join Room</h4>
                </Button>
            </div>
        </div>
    )
}

export default CreateOrJoin