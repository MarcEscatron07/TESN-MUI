"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import moment from 'moment-timezone';
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
import CircularProgress from '@mui/material/CircularProgress';
import Popover from '@mui/material/Popover';

import EmojiPicker from 'emoji-picker-react';

import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import SendIcon from '@mui/icons-material/Send';
import LinkIcon from '@mui/icons-material/Link';

import { StyledBadge } from "@/components/function";
import { CHAT_BOX } from '@/components/styles';
import { getThread } from "@/lib/api";
import { parseStringToHtml, formatDateTime, clearObjectUrl } from '@/lib/helpers';

export default function ChatBox(props) {
    const theme = useTheme();

    const [isChatBoxLoading, setIsChatBoxLoading] = useState(false);
    const [popoverAnchor, setPopoverAnchor] = useState(null);
    const [userData, setUserData] = useState({
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
    const [chatAttachments, setChatAttachments] = useState([]);

    useEffect(() => {
    }, [])

    useEffect(() => {
        // console.log('ChatBox > props.instance', props.instance)
    }, [props.instance])

    useEffect(() => {
        // console.log('ChatBox > props.sessionUser', props.sessionUser)

        setUserData(props.sessionUser);
    }, [props.sessionUser])

    useEffect(() => {
        // console.log('ChatBox > props.activeChatData', props.activeChatData)

        setActChatData(props.activeChatData)
    }, [props.activeChatData])

    useEffect(() => {
        // console.log('ChatBox > chatMessage', chatMessage)
    }, [chatMessage])

    useEffect(() => {
        // console.log('ChatBox > chatAttachments', chatAttachments)
    }, [chatAttachments])

    useEffect(() => {
        // console.log('ChatBox > userData', userData)
        // console.log('ChatBox > actChatData', actChatData)

        if(userData.id != -1 && actChatData.id != -1) {
            props.selectedChat?.id == actChatData.id ? setIsChatBoxLoading(true) : null;
            fetchThread(() => {
                setTimeout(() => {
                    props.selectedChat?.id == actChatData.id ? setIsChatBoxLoading(false) : null
                }, 1000)
            });
        }
    }, [userData, actChatData, props.selectedChat])

    async function fetchThread(callback) {
        await getThread(`userId=${userData.id}&chatId=${actChatData.id}&chatType=${actChatData.type}`).then(
            (res) => {
                // console.log('fetchThread > res', res)

                setActThreadData(res?.status == 200 && res?.data ? res?.data : []);
            },
            (err) => {
                console.log('fetchThread > err', err)
                setActThreadData([]);
            },
        )

        callback ? callback() : null;
    }

    const onEmojiPickerClick = (event) => {
        setPopoverAnchor(event.target);
    }

    const onEmojiClick = (emojiData, event) => {
        if (emojiData && emojiData.emoji) {
            setChatMessage((prevState) => prevState + emojiData.emoji);
        }
    }

    const onChatInputChange = (event) => {
        setChatMessage(event.target.value);
    }

    const onChatInputKeyDown = (event) => {
        const charCode = event.keyCode || event.which;
        // console.log('onChatInputKeyDown > charCode', charCode)

        switch (charCode) {
            case 13: // ENTER
                if (!event.shiftKey) {
                    event.preventDefault();
                    onChatInputSendClick(null);
                } else {
                    // setChatMessage((prevState) => prevState + ' <br/> '); // ISSUE: <br> is displaying in <textarea> while typing. Will need to find an alternative solution.
                }
                break;
            case 27: // ESC
                onCloseClick(event, actChatData);
                break;
        }
    }

    const onChatInputFocus = (event) => {
        // console.log('onChatInputFocus > event', event)
    }

    const onChatInputSendClick = (event) => {
        if(chatMessage.trim().length > 0) {
            if(props.onChatBoxSendInput) {
                props.onChatBoxSendInput(
                    actChatData,
                    {
                        sender: userData.name,
                        receiver: actChatData.name,
                        message: chatMessage,
                        timestamp: moment().toISOString(),
                        status: 'unread',
                        image: userData.image,
                        attachments: null
                    },
                    null
                );

                setChatMessage('');
            }
        }
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

    function renderSystemChatView(idx) {
        return (
            <Box key={idx} sx={CHAT_BOX.chatBoxCardContentSystemBox}>
                <LinkIcon />
                <Typography variant="body2" sx={CHAT_BOX.chatBoxCardContentSystemBoxText}>
                    You are now connected on chat
                </Typography>
            </Box>
        )
    }

    function renderDefaultChatView(item, idx) {
        const source = item.sender == userData.name ? 'sender' : 'receiver';

        return (
            <Box key={idx} sx={CHAT_BOX.chatBoxCardContentDefaultBox} className={`chat-box-${source}`}>
                <Box className="chat-box-avatar">
                    {source == 'receiver' ? (
                        <Image
                            title={item.sender}
                            src={item.image}
                            width={40}
                            height={40}
                            alt={item.sender}
                        />
                    ) : null}
                </Box>
                <Box 
                    className="chat-box-message" 
                    sx={{
                        backgroundColor: source == 'receiver' ? theme.palette.dark.main : theme.palette.primary.main,
                        color: source == 'receiver' ? theme.palette.light.main : theme.palette.primary.contrastText,
                    }}
                >
                    <Box className="chat-box-message-text">{parseStringToHtml(item.message)}</Box>
                    <Box 
                        className="chat-box-message-timestamp" 
                        title={formatDateTime(item.timestamp, 'MMMM DD, YYYY h:mm A', { origin: 'chat-timestamp' })}
                        sx={{
                            backgroundColor: theme.palette.dark.light,
                            color: theme.palette.light.main
                        }}
                    >
                        {formatDateTime(item.timestamp, 'h:mm A')}
                    </Box>
                </Box>
            </Box>
        )
    }

    return (
        <div className="chat-box" style={{ right: props.instance > 1 ? 285 + (320 * (props.instance - 1)) : 285 }}>
            <Paper sx={CHAT_BOX.chatBoxPaperContainer} elevation={5}>
                <Card sx={CHAT_BOX.chatBoxCardContainer}>
                    <Paper elevation={2}>
                        <CardHeader
                            sx={{ ...CHAT_BOX.chatBoxCardHeader, backgroundColor: theme.palette.dark.light, color: theme.palette.light.main }}
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
                                    <IconButton 
                                        aria-label="chat-box-minimize" 
                                        sx={{color: theme.palette.light.main}}
                                        onClick={(event) => onMinimizeClick(event, actChatData)}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <IconButton 
                                        aria-label="chat-box-close" 
                                        sx={{color: theme.palette.light.main}}
                                        onClick={(event) => onCloseClick(event, actChatData)}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </>
                            }
                        />
                    </Paper>

                    <CardContent sx={CHAT_BOX.chatBoxCardContent} className="chat-box-content">
                        {isChatBoxLoading? (
                            <Box sx={{
                                ...CHAT_BOX.chatBoxCardLoaderBox,
                                backgroundColor: theme.palette.light.main
                            }}>
                                <CircularProgress color="primary" />
                            </Box>
                        ) : actThreadData ? actThreadData.map((item, idx) => {
                            switch(item.sender) {
                                case 'system':
                                    return renderSystemChatView(idx);
                                default:
                                    return renderDefaultChatView(item, idx);
                            }
                        }) : null}
                    </CardContent>

                    <CardActions sx={{ ...CHAT_BOX.chatBoxCardActions, backgroundColor: theme.palette.secondary.main }} disableSpacing>
                        <Box sx={CHAT_BOX.chatBoxCardActionsBox}>
                            <IconButton aria-label="chat-box-attachment">
                                <AttachmentIcon />
                            </IconButton>
                            <IconButton aria-label="chat-box-emoji" onClick={onEmojiPickerClick}>
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
                                sx={{ ...CHAT_BOX.chatBoxCardActionsBoxInput, backgroundColor: theme.palette.light.main }}
                            />
                            <Button variant="contained" color="primary" sx={CHAT_BOX.chatBoxCardActionsBoxButton} onClick={onChatInputSendClick}>
                                <SendIcon sx={{ color: theme.palette.light.main }} />
                            </Button>
                        </Box>
                    </CardActions>
                </Card>

                <Popover
                    id={popoverAnchor ? 'simple-popover' : undefined}
                    open={popoverAnchor ? true : false}
                    anchorEl={popoverAnchor}
                    onClose={() => setPopoverAnchor(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    disablePortal
                >
                    <Box className="emoji-container">
                        <EmojiPicker 
                            className="emoji-picker" 
                            emojiStyle="native" 
                            defaultSkinTone="neutral" 
                            suggestedEmojisMode="recent" 
                            open={popoverAnchor ? true : false} 
                            onEmojiClick={onEmojiClick} 
                            skinTonesDisabled 
                        />
                    </Box>
                </Popover>
            </Paper>
        </div>
    )
}