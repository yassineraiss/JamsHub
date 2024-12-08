import React, {useState} from 'react';
import { Drawer } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { List, ListItem, ListItemIcon, ListItemText, ListItemButton } from "@mui/material";
import { Home, Mail, Logout } from "@mui/icons-material";


function MobileDrawer() {

    const [isOpen, setIsOpen] = useState(false);
    const drawerList = () => {
        return (
            <List sx={{ width: '100%' }}>
                <ListItem disablePadding>
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
                <ListItem disablePadding>
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
        )
    }

    return (
        <div>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setIsOpen(true)}
            >
                <Menu sx={{color: 'white'}} />
            </IconButton>
            <Drawer
                anchor="left"
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                {drawerList()}
            </Drawer>
        </div>
    )
}

export default MobileDrawer