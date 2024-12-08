import { Sync, Chat, Add } from "@mui/icons-material";

function RoomFeatures() {
    return (
        <div 
            className="grid_col_span_2"
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderTop: '1.5px solid hsl(199, 100%, 76%)',
                borderBottom: '1.5px solid hsl(295, 100%, 76%)',
                borderRadius: '15px'
            }}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly'
                }}>
                    <h2 style={{alignSelf: 'center', marginBottom: 0}}>Room features:</h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Sync sx={{
                            fontSize: 'clamp(1rem, 1rem + 0.7vw, 2rem)',
                            color: 'white'
                        }}/>
                        <h3>Synchronized Play</h3>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Add sx={{
                            fontSize: 'clamp(1rem, 1rem + 0.7vw, 2rem)',
                            color: 'white'
                        }}/>
                        <h3>Adding votes</h3>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Chat sx={{
                            fontSize: 'clamp(1rem, 1rem + 0.7vw, 2rem)',
                            color: 'white'
                        }}/>
                        <h3>Live Chat</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoomFeatures