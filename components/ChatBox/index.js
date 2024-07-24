"use client";

import React, { useState, useEffect, useRef } from "react";
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

import { StyledBadge } from "@/components/function";
import { CHAT_BOX } from '@/components/styles';
import { getThread } from "@/lib/api";

export default function ChatBox(props) {
    const theme = useTheme();

    const [sesUser, setSesUser] = useState({
        id: -1,
        name: '',
        image: ''
    });
    const [actChatData, setActChatData] = useState({
        id: -1,
        name: '',
        image: '',
        type: '',
        unread: 0
    });
    const [actThreadData, setActThreadData] = useState([]);

    const [chatMessage, setChatMessage] = useState('');

    useEffect(() => {
    }, [])

    useEffect(() => {
        // console.log('ChatBox > props.instance', props.instance)
    }, [props.instance])

    useEffect(() => {
        // console.log('ChatBox > props.sessionUser', props.sessionUser)

        setSesUser(props.sessionUser);
    }, [props.sessionUser])

    useEffect(() => {
        // console.log('ChatBox > props.activeChatData', props.activeChatData)

        setActChatData(props.activeChatData)
    }, [props.activeChatData])

    useEffect(() => {
        // console.log('ChatBox > sesUser', sesUser)
        // console.log('ChatBox > actChatData', actChatData)

        if(sesUser.id != -1 && actChatData.id != -1) {
            fetchThread();
        }
    }, [sesUser, actChatData])

    async function fetchThread() {
        await getThread(`userId=${sesUser.id}&friendId=${actChatData.id}&chatType=${actChatData.type}`).then(
            (res) => {
                console.log('fetchThread > res', res)

                setActThreadData(res?.status == 200 && res?.data ? res?.data : []);
            },
            (err) => {
                console.log('fetchThread > err', err)
            },
        )
    }

    const onChatInputChange = (event) => {
        setChatMessage(event.target.value);
    }

    const onChatInputKeyDown = (event) => {
        const charCode = event.keyCode || event.which;
        // console.log('onChatInputKeyDown > charCode', charCode)
    }

    const onChatInputFocus = (event) => {
        // console.log('onChatInputFocus > event', event)
    }

    const onMinimizeClick = (event, value) => {
        if (props.onChatBoxMinimizeClick) {
            props.onChatBoxMinimizeClick(value);
        }
    }

    const onCloseClick = (event, value) => {
        if (props.onChatBoxCloseClick) {
            props.onChatBoxCloseClick(value);
        }
    }

    function renderDefaultChatView(item, idx) {
        const source = item.sender == actChatData.name ? 'sender' : 'receiver';

        return (
            <>
            </>
        )
    }

    return (
        <div className="chat-box" style={{ right: props.instance > 1 ? 285 + (320 * (props.instance - 1)) : 285 }}>
            <Paper sx={CHAT_BOX.chatBoxPaperContainer} elevation={5}>
                <Card sx={CHAT_BOX.chatBoxCardContainer}>
                    <Paper elevation={2}>
                        <CardHeader
                            sx={{ ...CHAT_BOX.chatBoxCardHeader, backgroundColor: theme.palette.light.dark }}
                            avatar={
                                <StyledBadge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                    sx={{
                                        "& .MuiBadge-badge": {
                                            color: actChatData.isOnline ? "lightgreen" : "lightgray",
                                            backgroundColor: actChatData.isOnline ? "green" : "gray"
                                        }
                                    }}
                                >
                                    <Avatar alt={actChatData.name} src={actChatData.image} />
                                </StyledBadge>
                            }
                            title={<span style={CHAT_BOX.chatBoxCardHeaderTitle}>{actChatData.name}</span>}
                            action={
                                <>
                                    <IconButton aria-label="chat-box-minimize" onClick={(event) => onMinimizeClick(event, actChatData)}>
                                        <RemoveIcon />
                                    </IconButton>
                                    <IconButton aria-label="chat-box-close" onClick={(event) => onCloseClick(event, actChatData)}>
                                        <CloseIcon />
                                    </IconButton>
                                </>
                            }
                        />
                    </Paper>

                    <CardContent sx={CHAT_BOX.chatBoxCardContent} className="chatbox-content">
                        {/* TODO DYNAMIC CHATBOX > CONTENT */}
                        {actThreadData.map((item, idx) => {
                            switch(item.sender) {
                                case 'system':
                                    return (
                                        <Box key={idx} sx={CHAT_BOX.chatBoxCardContentBox}>
                                            <LinkIcon />
                                            <Typography variant="body2" sx={CHAT_BOX.chatBoxCardContentBoxText}>
                                                You are now connected on chat
                                            </Typography>
                                        </Box>
                                    )
                                default:
                                    return renderDefaultChatView(item, idx);
                            }
                        })}
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
                                inputRef={input => input && props.instance == 1 && input.focus()}
                                multiline
                                variant="filled"
                                maxRows={1}
                                value={chatMessage}
                                onChange={onChatInputChange}
                                onKeyDown={onChatInputKeyDown}
                                onFocus={onChatInputFocus}
                                sx={{ ...CHAT_BOX.chatBoxCardActionsBoxInput, backgroundColor: theme.palette.light.main }}
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