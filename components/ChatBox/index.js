"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import moment from 'moment-timezone';
import { useTheme } from "@mui/material/styles";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faRectangleXmark, faFile } from "@fortawesome/free-solid-svg-icons";

import { StyledBadge } from "@/components/function";
import { CHAT_BOX } from '@/components/styles';
import { parseStringToHtml, formatDateTime, formatFilesize, clearObjectUrl } from '@/lib/helpers';

export default function ChatBox(props) {
    const theme = useTheme();

    const chatBoxContentRef = useRef();
    const chatBoxAttachmentRef = useRef();
    const chatBoxInputRef = useRef();

    const [isChatBoxLoading, setIsChatBoxLoading] = useState(false);
    const [isChatBoxScrolling, setIsChatBoxScrolling] = useState(false);
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
        // console.log('ChatBox > props.sessionUser', props.sessionUser)

        setUserData(props.sessionUser);
    }, [props.sessionUser])

    useEffect(() => {
        // console.log('ChatBox > props.activeChatData', props.activeChatData)

        setActChatData(props.activeChatData);
    }, [props.activeChatData])

    useEffect(() => {
        // console.log('ChatBox > props.activeThreadData', props.activeThreadData)

        if(props.activeThreadData) {
            let actThreadIdx = props.activeThreadData.map((i) => i.chatId).indexOf(actChatData.id);

            if(actThreadIdx != -1) {
                setActThreadData(
                    props.activeThreadData[actThreadIdx] && props.activeThreadData[actThreadIdx].threads ? 
                    props.activeThreadData[actThreadIdx].threads : []
                );
            }
        }
    }, [props.activeThreadData, actChatData])

    useEffect(() => {
        // console.log('ChatBox > props.selectedChat', props.selectedChat)
        // console.log('ChatBox > userData', userData)
        // console.log('ChatBox > actChatData', actChatData)

        if(props.selectedChat && props.selectedChat?.id == actChatData.id) {
            setIsChatBoxLoading(true);
            setTimeout(() => {
                setIsChatBoxLoading(false);
                chatBoxInputRef?.current?.focus();
                
                if(props.onResetSelectedChat) {
                    props.onResetSelectedChat();
                }
                if(props.onResetChatThread){
                    props.onResetChatThread();
                }
            }, 1000)
        }
    }, [props.selectedChat, userData, actChatData])

    useEffect(() => {
        // console.log('ChatBox > actThreadData', actThreadData)

        if(actThreadData.length > 0 && !isChatBoxScrolling) {
            chatBoxContentRef?.current?.lastElementChild?.scrollIntoView();
        }
    }, [actThreadData])

    useEffect(() => {
        // console.log('ChatBox > chatMessage', chatMessage)
    }, [chatMessage])

    useEffect(() => {
        // console.log('ChatBox > chatAttachments', chatAttachments)
    }, [chatAttachments])

    const onAttachFileChange = (event) => {
        const filesArr = event?.target?.files ? [...event?.target?.files] : [];
        setChatAttachments(filesArr);
        chatBoxInputRef.current?.focus();
    }

    const onAttachFileClick = (event) => {
        clearObjectUrl(chatAttachments, () => setChatAttachments([]));
        chatBoxAttachmentRef?.current.click();
    }

    const onAttachFileCancel = () => {
        clearObjectUrl(chatAttachments, () => setChatAttachments([]));
    }

    const onAttachFileRemove = (value) => {
        setChatAttachments(chatAttachments.filter((_item, idx) => idx != value));
    }

    const onMessageAttachmentClick = (event, value) => {
        if (value.type && value.type.includes('video')) {
            // console.log('onMessageAttachmentClick > pausing video...')
        }

        if (props.onChatBoxViewAttachment) {
            props.onChatBoxViewAttachment(value);
        }
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
        setIsChatBoxScrolling(false);
        chatBoxContentRef?.current?.lastElementChild?.scrollIntoView();
        
        // logic for viewing unread chat here
    }

    const onChatInputSendClick = (event) => {
        setIsChatBoxScrolling(false);

        if(chatMessage.trim().length > 0 || chatAttachments.length > 0) {
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
                    chatAttachments
                );

                setChatMessage('');
            }
        }

        clearObjectUrl(chatAttachments, () => setChatAttachments([]));
    }

    const onMinimizeClick = (event, value) => {
        setIsChatBoxScrolling(false);
        clearObjectUrl(chatAttachments, () => setChatAttachments([]));

        if (props.onChatBoxMinimizeClick) {
            props.onChatBoxMinimizeClick(value);
        }
    }

    const onCloseClick = (event, value) => {
        setIsChatBoxScrolling(false);
        clearObjectUrl(chatAttachments, () => setChatAttachments([]));

        if (props.onChatBoxCloseClick) {
            props.onChatBoxCloseClick(value);
        }
    }

    const onChatBoxContentScroll = (event) => {
        // console.log('onChatBoxContentScroll > event', event)
        setIsChatBoxScrolling(true);
        chatBoxInputRef.current?.blur();
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
                    {item.attachments && item.attachments.length > 0 ? (
                        <Box className="chat-box-message-attachments">
                            {item.attachments.map((atchItem, atchIdx) => renderAttachmentItemByType(atchItem, atchIdx, atchItem?.type))}
                        </Box>
                    ) : null}
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

    function renderAttachmentThumbByType(item, type) {
        if (type && type.includes('image')) {
            return (<img className="chat-thumbnail-item" src={URL.createObjectURL(item)} />)
        }
        if (type && type.includes('video')) {
            return (
                <video className="chat-thumbnail-item">
                    <source src={URL.createObjectURL(item)} />
                </video>
            );
        }

        return item?.name ? (
            <Box className="chat-thumbnail-default">
                <span><FontAwesomeIcon icon={faFile} size="lg" /></span>
                <b>{item?.name}</b>
            </Box>
        ) : null;
    }

    function renderAttachmentItemByType(item, key, type) {
        if (type && type.includes('image')) {
            return (<img key={key} className="attachment-thumbnail-item" src={`./attachments/${item?.name}`} onClick={(event) => onMessageAttachmentClick(event, item)} />);
        }
        if (type && type.includes('video')) {
            return (
                <video key={key} className="attachment-thumbnail-item" onClick={(event) => onMessageAttachmentClick(event, item)} autoPlay controls muted>
                    <source src={`./attachments/${item?.name}`} />
                </video>
            )
        }

        return item?.name ? (
            <a href={`./attachments/${item?.name}`} className="attachment-thumbnail-default" target='_blank'>
                <Grid container spacing={2}>
                    <Grid item xs={2} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', pr: 0}}>
                        <span className="icon"><FontAwesomeIcon icon={faFile} size="xl" /></span>
                    </Grid>
                    <Grid item xs={10} sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                        <span className="filename">{item?.name}</span>
                        <span className="size">{formatFilesize(item?.size)}</span>
                    </Grid>
                </Grid>
            </a>
        ) : null;
    }

    return (
        <div className="chat-box" style={{ right: props.instance > 1 ? 285 + (320 * (props.instance - 1)) : 285 }}>
            <Paper sx={CHAT_BOX.chatBoxPaperContainer} elevation={5}>
                <Card sx={{...CHAT_BOX.chatBoxCardContainer, backgroundColor: theme.palette.muted.main}}>
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

                    <CardContent ref={chatBoxContentRef} sx={CHAT_BOX.chatBoxCardContent} className="chat-box-content" onScroll={onChatBoxContentScroll}>
                        {isChatBoxLoading? (
                            <Box sx={CHAT_BOX.chatBoxCardLoaderBox}>
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
                            <input key={chatAttachments} type="file" ref={chatBoxAttachmentRef} accept="*/*" multiple hidden onChange={onAttachFileChange} />
                            <IconButton aria-label="chat-box-attachment" onClick={onAttachFileClick}>
                                <AttachmentIcon />
                            </IconButton>
                            <IconButton aria-label="chat-box-emoji" onClick={onEmojiPickerClick}>
                                <AddReactionIcon />
                            </IconButton>
                        </Box>
                        <Box sx={CHAT_BOX.chatBoxCardActionsBox}>
                            <Box sx={CHAT_BOX.chatBoxCardActionsBoxInputWrapper}>
                                {chatAttachments.length > 0 ? (
                                    <Box className="chat-attachment-container">
                                        <Box className="chat-attachment-content">
                                            <Box className="chat-attachment-thumbnail" title="Cancel Attachment">
                                                <span 
                                                    className="chat-attachment-cancel"
                                                    aria-label="chat-attachment-cancel"
                                                    onClick={onAttachFileCancel}
                                                >
                                                    <FontAwesomeIcon icon={faRectangleXmark} size="lg" />
                                                </span>
                                            </Box>

                                            {chatAttachments.map((item, idx) => (
                                                <Box key={idx} className="chat-attachment-thumbnail" title={item?.name}>
                                                    <span 
                                                        className="chat-attachment-remove"
                                                        aria-label="chat-attachment-remove"
                                                        onClick={() => onAttachFileRemove(idx)}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} size="sm" />
                                                    </span>

                                                    {renderAttachmentThumbByType(item, item?.type)}
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                ) : null}

                                <Input
                                    inputRef={chatBoxInputRef}
                                    multiline
                                    variant="filled"
                                    maxRows={1}
                                    value={chatMessage}
                                    onChange={onChatInputChange}
                                    onKeyDown={onChatInputKeyDown}
                                    onFocus={onChatInputFocus}
                                    sx={{ ...CHAT_BOX.chatBoxCardActionsBoxInput, backgroundColor: theme.palette.light.main }}
                                />
                            </Box>
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