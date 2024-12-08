import { List, ListItem, ListItemIcon, ListItemText, ListItemButton, Button } from "@mui/material";
import { Home, Mail, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function SideBar() {

    const navigate = useNavigate();

    return (
        <div className="side">
            <h1 className="title">JamsHub</h1>
            <List sx={{ width: '100%' }}>
                <ListItem disablePadding onClick={() => {navigate('/')}}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Home sx={{
                                fontSize: 'clamp(1rem, 1rem + 0.7vw, 2rem)',
                                color: 'white'
                            }}/>
                        </ListItemIcon>
                        <ListItemText>
                            <h3>Home</h3>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Mail sx={{
                                fontSize: 'clamp(1rem, 1rem + 0.7vw, 2rem)',
                                color: 'white'
                            }}/>
                        </ListItemIcon>
                        <ListItemText>
                            <h3>Contact us</h3>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding onClick={() => {navigate('/logout')}}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Logout sx={{
                                fontSize: 'clamp(1rem, 1rem + 0.7vw, 2rem)',
                                color: 'white'
                            }}/>
                        </ListItemIcon>
                        <ListItemText>
                            <h3>Logout</h3>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    )
}

export default SideBar