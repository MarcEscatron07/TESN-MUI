"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Typography from "@mui/material/Typography";

import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import SendIcon from '@mui/icons-material/Send';
import LinkIcon from '@mui/icons-material/Link';

import { CHAT_BOX } from '@/components/styles';

export default function ChatBox(props) {
    const theme = useTheme();

    const [actChatData, setActChatData] = useState({
        id: -1,
        name: '',
        image: '',
        type: '',
        unread: 0
    });
    const [chatMessage, setChatMessage] = useState('');

    useEffect(() => {
    }, [])

    useEffect(() => {
        // console.log('ChatBox > props.activeChatData', props.activeChatData)

        setActChatData(props.activeChatData)
    }, [props.activeChatData])

    useEffect(() => {
        // console.log('ChatBox > actChatData', actChatData)
    }, [actChatData])

    const onChatInputChange = (event) => {
        setChatMessage(event.target.value);
    }

    const onChatInputKeyDown = (event) => {
        const charCode = event.keyCode || event.which;
        console.log('onChatInputKeyDown > charCode', charCode)
    }

    const onChatInputFocus = (event) => {
        console.log('onChatInputFocus > event', event)
    }

    return (
        <div className="chat-box" style={{right: props?.instance > 1 ? 285 + (320 * (props?.instance - 1)) : 285 }}>
            <Paper sx={CHAT_BOX.chatBoxPaperContainer} elevation={5}>
                <Card sx={CHAT_BOX.chatBoxCardContainer}>
                    <Paper elevation={2}>
                        <CardHeader
                            sx={{...CHAT_BOX.chatBoxCardHeader, backgroundColor: theme.palette.light.dark}}
                            avatar={<Avatar alt={actChatData.name} src={actChatData.image} />}
                            title={<span style={CHAT_BOX.chatBoxCardHeaderTitle}>{actChatData.name}</span>}
                            action={
                                <>
                                    <IconButton aria-label="chat-box-minimize">
                                        <RemoveIcon />
                                    </IconButton>
                                    <IconButton aria-label="chat-box-close">
                                        <CloseIcon />
                                    </IconButton>
                                </>
                            }
                        />
                    </Paper>

                    <CardContent sx={CHAT_BOX.chatBoxCardContent} className="chatbox-content">
                        <Box sx={CHAT_BOX.chatBoxCardContentBox}>
                            <LinkIcon />
                            <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                                You are now connected on chat
                            </Typography>
                        </Box>                        
                    </CardContent>

                    <CardActions sx={{ ...CHAT_BOX.chatBoxCardActions, backgroundColor: theme.palette.secondary.main }} disableSpacing>
                        <Box sx={CHAT_BOX.chatBoxCardActionsBox}>
                            <IconButton aria-label="chat-box-attachment">
                                <AttachmentIcon />
                            </IconButton>
                            <IconButton aria-label="chat-box-emoji">
                                <AddReactionIcon />
                            </IconButton>
                        </Box>
                        <Box sx={CHAT_BOX.chatBoxCardActionsBox}>
                            <Input
                                multiline
                                variant="filled"
                                maxRows={1}
                                value={chatMessage}
                                onChange={onChatInputChange}
                                onKeyDown={onChatInputKeyDown}
                                onFocus={onChatInputFocus}
                                sx={{...CHAT_BOX.chatBoxCardActionsBoxInput, backgroundColor: theme.palette.light.main}}
                            />
                            <Button variant="contained" color="primary" sx={CHAT_BOX.chatBoxCardActionsBoxButton}>
                                <SendIcon sx={{ color: theme.palette.light.main }} />
                            </Button>
                        </Box>
                    </CardActions>
                </Card>
            </Paper>
        </div>
    )
}