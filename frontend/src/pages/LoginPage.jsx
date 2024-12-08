import { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom' 
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import { TextField, Button, CircularProgress } from '@mui/material'

function LoginPage() {

    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(false)
    const [label, setLabel] = useState('Enter your password')

    const navigate = useNavigate()

    const handleLogin = async () => {
        if(username && password ) {
            setLoading(true)
            try {
                const response = await api.post("/api/token/", {
                    username: username,
                    password: password
                })
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate("/")
            } catch(error) {
                setLoading(false)
                setError(true)
                setLabel('password or username are not valid.')
                throw(error)
            }
        }
    }

    return (
        <div style={{
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            width: '100%',
            height: '100vh',
            background: 'linear-gradient(to bottom, hsl(0, 0%, 12%), hsl(295, 26%, 49%), hsl(0, 0%, 12%))'
        }}>
            <div style={{
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                padding: '1.4rem',
                backgroundColor: 'hsl(0, 0%, 12%)',
                borderRadius: '20px',
                maxWidth: '400px'
            }}>
                <h1 style={{
                        color: 'white', 
                        fontFamily: 'Dosis',
                        marginTop: 0,
                        marginBottom: '2rem'
                    }}>
                    Login to JamsHub
                </h1>
                <TextField 
                    color='secondary'
                    label='Enter a username'
                    type='text'
                    sx={{mb: '1rem'}}
                    onChange={(e) => {setUsername(e.target.value)}}
                />
                <TextField 
                    color='secondary'
                    label={label}
                    error={error}
                    type='password'
                    sx={{mb: '2rem'}}
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                {
                    loading ?
                    <CircularProgress color='secondary' />
                    :
                    <Button
                        variant='contained'
                        color='secondary'
                        onClick={handleLogin}
                        style={{
                            width: '100%',
                            borderRadius: '20px',
                        }}
                    >
                        <h3 style={{
                            fontFamily: 'Dosis',
                            margin: 0,
                            color: 'inherit'
                        }}>
                            Login
                        </h3>
                    </Button>
                }
                <Button
                    variant='contained'
                    color='inherit'
                    onClick={() => {navigate('/register')}}
                    style={{
                        width: '100%',
                        borderRadius: '20px',
                        marginTop: '1rem'
                    }}
                >
                    <h3 style={{
                        fontFamily: 'Dosis',
                        margin: 0
                    }}>
                        Sign in here if you're new.
                    </h3>
                </Button>
                <h3 style={{textAlign: 'center', marginTop: '1rem'}}>⚠️Disclaimer:</h3>
                <h3 style={{textAlign: 'center'}}>To use this app, you must have a valid Spotify Premium account🎵. Some features and functionalities require access to Spotify's Premium services</h3>
            </div>
        </div>
    )
}

export default LoginPage