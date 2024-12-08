import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import JoinRoomForm from "../components/JoinRoomForm";
import CreateOrJoin from "../components/CreateOrJoin";
import CreateRoomForm from "../components/CreateRoomForm";
import RoomFeatures from "../components/RoomFeartures";
import Picture from "../components/Picture";
import api from "../api";
import MobileDrawer from "../components/Drawer";
import { Sync, Chat, Add } from "@mui/icons-material";

function HomePage() {
    console.log('home');
    const [create, setCreate] = useState(null)
    const [join, setJoin] = useState(null)
    
    const authenticate_spotify = async () => {
        try {
            const authResponse = await api.get('/api/is_authenticated/');
            if (authResponse.status === 200) {
                const authData = authResponse.data;
                console.log(authData);
                localStorage.setItem('spotify_token', authData.access_token);
            } else {
                SpotifyLogin();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const SpotifyLogin = async () => {
        try {
            const authUrlResponse = await api.get('/api/get-auth-url/');
            const authUrlData = authUrlResponse.data;
            window.location.replace(authUrlData.url);
        } catch (error) {
            console.error(error);
        }
    }

    const getUsername = async () => {
        try {
            const response = await api.get('/api/username/');
            localStorage.setItem('username', response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        authenticate_spotify();
        getUsername();
    }, []);

    return (
        <>
            <div className="grid">
                <SideBar />
                <div className="main">
                    <div className="main__home-grid">     
                        {
                        create ? <CreateRoomForm goBack={() => setCreate(false)} /> : 
                        join ? <JoinRoomForm goBack={() => setJoin(false)} /> : 
                        <CreateOrJoin 
                            activeCreate={() => setCreate(true)}
                            activeJoin={() => setJoin(true)} 
                        />
                        }
                        <Picture />
                        <RoomFeatures />
                    </div>
                </div>
            </div>
            <div className="mobile-flex">
                <div className="mobile-flex-header">
                    <MobileDrawer />
                    <h1 className="title" style={{margin: '0 auto'}}>JamsHub</h1>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '1.25vh',
                    height: '100%',
                    width: '100%'
                }}>
                    {
                    create ? <CreateRoomForm goBack={() => setCreate(false)} /> : 
                    join ? <JoinRoomForm goBack={() => setJoin(false)} /> : 
                    <CreateOrJoin 
                        activeCreate={() => setCreate(true)}
                        activeJoin={() => setJoin(true)} 
                    />
                    }
                    <RoomFeatures />
                </div>
            </div>
        </>
    )
}

export default HomePage