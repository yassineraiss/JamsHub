import { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom' 
import { TextField, Button, CircularProgress } from '@mui/material'

function RegisterPage() {

    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [cpassword, setCpassword] = useState(null)
    const [error, setError] = useState(false)
    const [label, setLabel] = useState('Confirm your password')
    const [loading, setLoading] = useState(null)

    const navigate = useNavigate()

    const handleRegister = async () => {
        if(username && password && cpassword) {
            if(password != cpassword) {
                setError(true)
                setLabel('Passwords did not match')
            } else {
                setLoading(true)
                try {
                    const response = await api.post("/api/user/create/", {
                        username: username,
                        password: password
                    })
                    navigate('/login')
                } catch(error) {
                    throw(error)
                }
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
            background: 'linear-gradient(to bottom, hsl(0, 0%, 12%), hsl(199, 37%, 33%), hsl(0, 0%, 12%))'
        }}>
            <div style={{
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                padding: '1.4rem',
                backgroundColor: 'hsl(0, 0%, 12%)',
                borderRadius: '20px'
            }}>
                <h1 style={{
                        color: 'white', 
                        fontFamily: 'Dosis',
                        marginTop: 0,
                        marginBottom: '2rem'
                    }}>
                    Register to JamsHub
                </h1>
                <TextField 
                    color='primary'
                    label='Enter a username'
                    type='text'
                    sx={{mb: '1rem'}}
                    onChange={(e) => {setUsername(e.target.value)}}
                />
                <TextField 
                    color='primary'
                    label='Enter a password'
                    type='password'
                    sx={{mb: '1rem'}}
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <TextField 
                    color='primary'
                    label={label}
                    type='password'
                    sx={{mb: '2rem'}}
                    error={error}
                    onChange={(e) => {setCpassword(e.target.value)}}
                />
                {
                    loading ?
                    <CircularProgress color='primary' />
                    :
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={handleRegister}
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
                            Register
                        </h3>
                    </Button>
                }
            </div>
        </div>
    )
}

export default RegisterPage