import React, { useState } from 'react';
import {  Grid } from "@mui/material";
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

function MPSearch({tracks, handleClick}) {

    // pagination:

    const itemsPerPage = 2; // Number of items per page
    const [page, setPage] = useState(1);

    // Calculate the indexes of the items to display on the current page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the array of tracks to display only the items for the current page
    const displayedTracks = tracks.slice(startIndex, endIndex);
 
    // Function to handle page change
    const handlePageChange = (event, value) => {
        setPage(value);
    };
 
    const truncateTrackName = (name) => {
        if (name.length > 10) {
        return name.slice(0, 10) + '...';
        }
        return name;
    };

    return (
        <div>
            <Grid container direction="row" spacing={1}>
                {displayedTracks.map((track, index) => (
                    <Grid item key={index} sx={{width: '50%'}}>
                        <Card>
                            <CardActionArea onClick={() => {
                                handleClick(track.album.id, track.id);
                            }}>
                                <CardMedia
                                    component="img"
                                    image={track.album.images[1].url}
                                    alt="track name"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {truncateTrackName(track.name)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {track.artists[0].name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination count={Math.ceil(tracks.length / itemsPerPage)} page={page} onChange={handlePageChange} />
            </div>
        </div>
    )

}

export default MPSearch