import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import HomePage from './pages/HomePage'
import RegisterPage from "./pages/RegisterPage"
import LoginPage from './pages/LoginPage'
import ErrorPage from './pages/ErrorPage'
import ProtectedRoute from './components/PotectedRoute'
import RoomCreated from './pages/RoomCreatedPage'
import RoomJoined from "./pages/RoomJoinedPage"

function Logout() {
    localStorage.clear()
    return <Navigate to="/login" />
}

function RegisterAndLogout() {
    localStorage.clear()
    return <RegisterPage />
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<RegisterAndLogout />} />
                <Route path="/created-room/:roomCode" element={<RoomCreated />} />
                <Route path="/join-room/:roomCode" element={<RoomJoined />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
