"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import moment from 'moment-timezone';

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

import { formatDateTime } from '@/lib/helpers';

export default function CardPost(props) {
    const theme = useTheme();

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ height: 'auto', width: 700, my: 2 }}>
            <CardHeader
                avatar={<Avatar alt="Owner Avatar" src={props?.data?.owner?.image ?? '/images/avatars/avatar_default.png'} />}
                action={
                    <>
                        <IconButton aria-label="options">
                            <MoreHorizIcon />
                        </IconButton>
                        <IconButton aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </>
                }
                title={props?.data?.owner?.name ?? 'Post Owner'}
                subheader={
                    <span title={formatDateTime(props?.data?.owner?.timestamp, 'dddd, MMMM DD, YYYY @ hh:mm A')}>
                        {`${formatDateTime(props?.data?.owner?.timestamp, 'MMMM DD, YYYY', { origin: 'post-timestamp', suffix: ' ago' })}`}
                    </span>
                }
            />

            <CardContent>
                <Typography variant="body2">
                    {props?.data?.title?.text ?? 'Post Caption'}
                </Typography>
            </CardContent>

            <CardActionArea>
                {props?.data?.thumbnail?.src ? (
                    <CardMedia
                        component="img"
                        image={props?.data?.thumbnail?.src ?? ''}
                        alt="Card Post"
                    />

                ) : (
                    <ImageIcon style={{ height: '100%', width: 700 }} />
                )}
            </CardActionArea>

            <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <IconButton aria-label="like">
                        <ThumbUpIcon />
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
                        {expanded ? 'Show Less' : 'Show More'}
                    </Button>
                </Box>
            </CardActions>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Divider sx={{ backgroundColor: theme.palette.primary.main }} />
                <CardContent sx={{ px: 3 }}>
                    <Typography paragraph>
                        {props?.data?.description?.text ?? 'Post Description'}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}