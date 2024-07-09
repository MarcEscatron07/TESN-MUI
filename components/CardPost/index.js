"use client";

import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function CardPost() {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ maxWidth: 700 }}>
            <CardHeader
                avatar={<Avatar alt="Account Avatar" src={'/images/avatars/avatar_male_2.png'} />}
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title="Jerson Albit"
                subheader="July 09, 2024"
            />

            <CardContent>
                <Typography variant="body2">
                    TAGBILARAN OUT-OF-SCHOOL YOUTH TO GAIN BETTER EMPLOYMENT OPPORTUNITIES THROUGH NEW CAREER READINESS PROGRAM
                </Typography>
            </CardContent>

            <CardActionArea>
                <CardMedia
                    component="img"
                    image={'/images/thumbnails/thumbnail_1.jpg'}
                    alt="Card Post"
                />
            </CardActionArea>

            <CardActions disableSpacing sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Box>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                </Box>
                <Box>
                    <Button
                        onClick={handleExpandClick}
                        startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    >
                        Read more
                    </Button>
                </Box>
            </CardActions>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>
                        The out-of-school youth in Tagbilaran, Bohol will soon have better access to employment opportunities, as the local government of Tagbilaran City, key government agencies, and private sector representatives signed a memorandum of agreement to implement a career readiness program for the city’s vulnerable sector.
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}