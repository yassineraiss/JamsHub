import { PlayArrow, Pause } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import SpotifyIcon from '../styles/images/Spotify_Icon_RGB_White.png';

function AudioPlayer({current_track, handleSyncPlayback, is_paused}) {

    const truncateTrackName = (name) => {
        if (name.length > 17) {
          return name.slice(0, 17) + '...';
        }
        return name;
    };

    const truncateArtistName = (name) => {
        if (name.length > 30) {
          return name.slice(0, 30) + '...';
        }
        return name;
    };
    
    return( 
        <Card 
            sx={{ display: 'flex', 
                flexDirection: 'column', 
                alignContent: 'center', 
                alignItems: 'center', 
                width: '90%',
                maxWidth: '260px'
            }}
        >
            <CardMedia 
                component='img'
                alt='track'
                width='100%'
                image={current_track.album.images[0].url}
                sx={{maxWidth: '260px'}}
            />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center'}}>
                <Typography component="div" variant="h5" fontFamily='Dosis' fontWeight={700}>
                    {truncateTrackName(current_track.name)}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                    {truncateArtistName(current_track.artists[0].name)}
                </Typography>
                <Box>
                    <IconButton aria-label="play/pause" onClick={handleSyncPlayback}>
                        { is_paused ? <PlayArrow sx={{fontSize: '2.5rem'}} /> : <Pause sx={{fontSize: '2.5rem'}} /> }
                    </IconButton> 
                </Box>
                <CardActionArea href='https://open.spotify.com/' target='_blank' >
                    <img src={SpotifyIcon} alt='icon' style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}/>
                    <Typography marginInline='auto' color='white' variant="p" fontFamily='Dosis' fontWeight={700}>
                        Play On Spotify
                    </Typography>
                </CardActionArea>
            </CardContent>
        </Card>
    );
}

export default AudioPlayer