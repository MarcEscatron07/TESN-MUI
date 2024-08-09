"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

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
import Divider from "@mui/material/Divider";

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';

import { CARD_POST } from '@/components/styles';
import { formatDateTime } from '@/lib/helpers';

export default function CardPost(props) {
    const theme = useTheme();

    const [postData, setPostData] = useState({
        id: -1,
        owner: {
            name: '',
            image: '',
            timestamp: ''
        },
        thumbnail: {
            src: '',
            alt: ''
        },
        title: { text: '' },
        description: { text: '' },
        tags: []
    });
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
    }, [])

    useEffect(() => {
        props.data ? setPostData(props.data) : null;
    }, [props.data])

    const onExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{...CARD_POST.cardPostContainer, width: props.isMobileView ? '90%' : '80%'}}>
            <CardHeader
                avatar={<Avatar alt="Owner Avatar" src={postData.owner.image} />}
                action={
                    <>
                        <IconButton>
                            <MoreHorizIcon />
                        </IconButton>
                        <IconButton>
                            <CloseIcon />
                        </IconButton>
                    </>
                }
                title={postData.owner.name}
                subheader={
                    <span title={formatDateTime(postData.owner.timestamp, 'dddd, MMMM DD, YYYY @ hh:mm A')}>
                        {`${formatDateTime(postData.owner.timestamp, 'MMMM DD, YYYY', { origin: 'post-timestamp', suffix: ' ago' })}`}
                    </span>
                }
            />

            <CardContent>
                <Typography variant="body2">
                    {postData.title.text}
                </Typography>
            </CardContent>

            <CardActionArea sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {postData.thumbnail.src ? (
                    <CardMedia
                        component="img"
                        image={postData.thumbnail.src}
                        alt="Card Post"
                    />

                ) : (
                    <ImageIcon style={CARD_POST.cardPostImagePlaceholder} />
                )}
            </CardActionArea>

            <CardActions disableSpacing sx={CARD_POST.cardPostActions}>
                <Box>
                    <IconButton>
                        <ThumbUpIcon />
                    </IconButton>
                    <IconButton>
                        <ShareIcon />
                    </IconButton>
                </Box>
                <Box>
                    <Button
                        onClick={onExpandClick}
                        startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    >
                        {expanded ? 'Show Less' : 'Show More'}
                    </Button>
                </Box>
            </CardActions>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Divider sx={{ backgroundColor: theme.palette.primary.main }} />
                <CardContent sx={CARD_POST.cardPostCollapseContent}>
                    <Typography paragraph>
                        {postData.description.text}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}