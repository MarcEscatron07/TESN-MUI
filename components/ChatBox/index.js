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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import EmojiPicker from 'emoji-picker-react';

import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import SendIcon from '@mui/icons-material/Send';
import LinkIcon from '@mui/icons-material/Link';
import PreviewIcon from '@mui/icons-material/Preview';
import MoreIcon from "@mui/icons-material/MoreVert";
import ReplyIcon from '@mui/icons-material/Reply';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faRectangleXmark, faFile, faEdit, faAnglesRight } from "@fortawesome/free-solid-svg-icons";

import { StyledBadge } from "@/components/function";
import { CHAT_BOX } from '@/components/styles';
import { parseStringToHtml, formatDateTime, formatFilesize, clearObjectUrl, checkIfEmojiOnly } from '@/lib/helpers';

export default function ChatBox(props) {
    const theme = useTheme();

    const chatBoxContentRef = useRef();
    const chatBoxAttachmentRef = useRef();
    const chatBoxInputRef = useRef();

    const chatBoxMoreItems = {
        sender: [
            {
                icon: faEdit,
                label: 'Edit',
                value: 'edit'
            },
            // {
            //     icon: faAnglesRight,
            //     label: 'Forward',
            //     value: 'forward'
            // },
            {
                icon: faTimes,
                label: 'Remove',
                value: 'remove'
            },
        ],
        receiver: [
            // {
            //     icon: faAnglesRight,
            //     label: 'Forward',
            //     value: 'forward'
            // },
            {
                icon: faTimes,
                label: 'Remove',
                value: 'remove'
            },
        ],
    };

    const [isChatBoxLoading, setIsChatBoxLoading] = useState(false);
    const [isChatBoxScrolling, setIsChatBoxScrolling] = useState(false);
    const [emojiPopover, setEmojiPopover] = useState(null);
    const [actChatData, setActChatData] = useState({
        id: -1,
        name: '',
        image: '',
        type: '',
        isOnline: false,
    });
    const [actThreadData, setActThreadData] = useState([]);

    const [chatMessage, setChatMessage] = useState('');
    const [chatAttachments, setChatAttachments] = useState([]);

    const [chatHoverIdx, setChatHoverIdx] = useState(-1);
    const [chatReplyState, setChatReplyState] = useState({
        isOpen: false,
        data: null
    });
    const [chatMoreState, setChatMoreState] = useState({
        isOpen: false,
        active: null
    });
    const [chatEditState, setChatEditState] = useState({
        isEditing: false,
        data: null,
        message: ''
    });

    const chatBoxHeight = props.isMobileView ? props.isMobilePortrait ? '395px' : '365px' : '450px';
    const chatBoxWidth = props.isMobileView ? '265px' : '310px';
    const chatBoxBotPos = props.isMobileView ? props.isRightDrawerMobileOpen ? 63 : (63-52) : 0;
    const chatBoxRightPos = props.isMobileView ? 5 : 285;

    useEffect(() => {
    }, [])

    useEffect(() => {
    }, [props.isMobileView])

    useEffect(() => {
    }, [props.isMobilePortrait])

    useEffect(() => {
    }, [props.isRightDrawerMobileOpen])

    useEffect(() => {
        // console.log('ChatBox > props.userData', props.userData)
    }, [props.userData])

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
        // console.log('ChatBox > props.userData', props.userData)
        // console.log('ChatBox > actChatData', actChatData)

        if(props.selectedChat && props.selectedChat?.id == actChatData.id) {
            setIsChatBoxLoading(true);
            setTimeout(() => {
                setIsChatBoxLoading(false);
                // chatBoxInputRef?.current?.focus();
                
                if(props.onResetSelectedChat) {
                    props.onResetSelectedChat();
                }
                if(props.onResetChatThread){
                    props.onResetChatThread();
                }
            }, 1000)
        }
    }, [props.selectedChat, props.userData, actChatData])

    useEffect(() => {
        if(props.userData?.id != -1 && actChatData.id != -1 && !isChatBoxLoading) {
            chatBoxContentRef?.current?.lastElementChild?.scrollIntoView();
            chatBoxInputRef?.current?.focus();
        }
    }, [props.userData, actChatData, isChatBoxLoading])

    useEffect(() => {
        console.log('ChatBox > actThreadData', actThreadData)

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

    useEffect(() => {
        // console.log('ChatBox > chatHoverIdx', chatHoverIdx)

        if(chatHoverIdx == -1) {
            setChatMoreState({
                ...chatMoreState,
                isOpen: false
            });
        }
    }, [chatHoverIdx])

    useEffect(() => {
        // console.log('ChatBox > chatReplyState', chatReplyState)

        if(chatReplyState.isOpen) {
            chatBoxInputRef?.current?.focus();
        } else {
            chatBoxInputRef?.current?.blur();
        }
    }, [chatReplyState])

    useEffect(() => {
        // console.log('ChatBox > chatMoreState', chatMoreState)
    }, [chatMoreState])

    useEffect(() => {
        // console.log('ChatBox > chatEditState', chatEditState)

        if(chatEditState.isEditing) {
            setChatMessage(chatEditState.message);
        } else {
            setChatMessage('');
        }
    }, [chatEditState])

    const onAttachFileChange = (event) => {
        const filesArr = event?.target?.files ? [...event?.target?.files] : [];
        setChatAttachments(filesArr);
        chatBoxInputRef?.current?.focus();
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
        setEmojiPopover(event.target);
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
        
        if(props.onChatBoxInputFocus) {
            props.onChatBoxInputFocus(actChatData);
        }
    }

    const onChatInputSendClick = (event) => {
        setIsChatBoxScrolling(false);

        if(chatMessage.trim().length > 0 || chatAttachments.length > 0) {
            if(chatEditState.isEditing) {
                if(props.onChatBoxUpdateMessage) {
                    const dataObj = {
                        ...chatEditState.data,
                        message: chatMessage,
                        isMessageEdited: true,
                    }
                    props.onChatBoxUpdateMessage(actChatData, dataObj, chatAttachments);
                }
            } else {
                if(props.onChatBoxSendInput) {
                    props.onChatBoxSendInput(
                        actChatData,
                        {
                            threadId: actThreadData.length + 1, // temporary code
                            sender: props.userData?.name,
                            senderImage: props.userData?.image,
                            receiver: actChatData.name,
                            receiverImage: actChatData.image,
                            receiverType: actChatData.type,
                            isReceiverOnline: actChatData.isOnline,
                            message: chatMessage,
                            isMessageEdited: false,
                            isMessageRemoved: false,
                            isMessageHidden: false,
                            timestamp: moment().toISOString(),
                            status: 'unread',
                            attachments: null,
                            reply: { 
                                threadId: chatReplyState?.data?.threadId, 
                                message: chatReplyState?.data?.message, 
                                attachments: chatReplyState?.data?.attachments, 
                                isMessageEdited: chatReplyState?.data?.isMessageEdited, 
                                isMessageRemoved: chatReplyState?.data?.isMessageRemoved,
                                isMessageHidden: chatReplyState?.data?.isMessageHidden, 
                            },
                        },
                        chatAttachments
                    );
                }
            }
        }

        setChatMessage('');
        setChatReplyState({
            isOpen: false,
            data: null
        });
        setChatEditState({
            isEditing: false,
            data: null,
            message: ''
        });

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
        
        // setIsChatBoxScrolling(true); // temporarily commented
        // chatBoxInputRef?.current?.blur();
    }

    const onChatBoxChatHover = (event, type, value) => {
        switch(type) {
            case 'mouseenter':
                setChatHoverIdx(value);
                break;
            case 'mouseleave':
                setChatHoverIdx(value);
                setChatMoreState({...chatMoreState, isOpen: false});
                break;
        }
    }

    const onChatBoxReplyClick = (event, value) => {
        const element = value && value.threadId ? document.getElementById(`chat_message_${value.threadId}`) : null;

        if(element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                element.querySelector('.chat-box-message').classList.add('chat-box-highlight');
                setTimeout(() => {
                    element.querySelector('.chat-box-message').classList.remove('chat-box-highlight');
                }, 2500);
            }, 500);
        }
    }

    const onChatBoxMessageOptionsClick = (event, type, value) => {
        switch(type) {
            case 'reply':
                setChatReplyState(value);
                setChatEditState({
                    isEditing: false,
                    data: null,
                    message: ''
                });
                break;
            case 'more':
                setChatMoreState({...chatMoreState, ...value});
                break;
        }
    }
    
    const onChatBoxMoreListItemsClick = (event, type, valueObj) => {
        switch(type) {
            case 'edit':
                setChatReplyState({
                    isOpen: false,
                    data: null
                });
                setChatEditState({
                    isEditing: valueObj.isEditing,
                    data: valueObj.data,
                    message: valueObj.data?.message ?? ''
                });
                break;
            case 'remove':
                if(props.onChatBoxUpdateMessage) {
                    const dataObj = { ...valueObj.data };

                    if(valueObj.data?.sender == props.userData?.name) {
                        dataObj['isMessageRemoved'] = true;
                    }
                    
                    if(valueObj.data?.receiver == props.userData?.name) {
                        dataObj['isMessageHidden'] = true;
                    }

                    props.onChatBoxUpdateMessage(actChatData, dataObj, null);
                }
                break;
        }
    }

    const checkCondition = (key) => {
        switch(key) {
            case 'attachment-reply':
                return chatAttachments.length > 0 && chatReplyState.isOpen ? true : false;
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
        const source = item.sender == props.userData?.name ? 'sender' : 'receiver';
        
        return (
            <div key={idx}>
                {source == 'receiver' && item.isMessageHidden ? null : (
                    <Box
                        id={`chat_message_${item.threadId ? item.threadId : 0}`}
                        sx={{...CHAT_BOX.chatBoxCardContentDefaultBox, marginTop: item.reply?.message ? '65px' : 2}} 
                        className={`chat-box-${source}`} 
                        onMouseEnter={(event) => onChatBoxChatHover(event, 'mouseenter', idx)} 
                        onMouseLeave={(event) => onChatBoxChatHover(event, 'mouseleave', -1)}
                    >
                        {source == 'receiver' ? (
                            <Box className="chat-box-avatar">
                                    <Image
                                        title={item.sender}
                                        src={item.senderImage}
                                        width={40}
                                        height={40}
                                        alt={item.sender}
                                    />
                            </Box>
                        ) : null}

                        {item.reply?.message ? (
                            <Box className="chat-box-reply" sx={{width: source == 'receiver' ? '80%' : '82%', marginLeft: source == 'receiver' ? '45px' : 'unset'}}>
                                <Box className="chat-box-reply-wrapper" onClick={(event) => onChatBoxReplyClick(event, item.reply)}>
                                    <Box className="chat-box-reply-target"><b>{source == 'sender' ? 'You' : item.sender}</b>&nbsp;replied to:</Box>
                                    {item.reply?.isMessageRemoved ? (
                                        <Box className="chat-box-reply-message"><i>Message removed</i></Box>
                                    ) : (
                                        <Box className="chat-box-reply-message">{item.reply?.attachments?.length > 0 ? '[Attachment] ' + item.reply.message : item.reply?.message}</Box>
                                    )}
                                </Box>
                            </Box>
                        ) : null}

                        <Box 
                            className="chat-box-message" 
                            sx={{
                                maxWidth: item.isMessageRemoved ? '100%' : source == 'sender' ? '65%' : '58%',
                                backgroundColor: source == 'receiver' ? theme.palette.dark.main : theme.palette.primary.main,
                                color: source == 'receiver' ? theme.palette.light.main : theme.palette.primary.contrastText,
                            }}
                        >
                            {item.isMessageRemoved ? (
                                <>
                                    <Box className="chat-box-message-text">{<i>{source == 'sender' ? 'You' : item.sender} unsent a message</i>}</Box>
                                </>
                            ) : (
                                <>
                                    {chatHoverIdx == idx ? (
                                        <List className="chat-box-message-options">
                                            <ListItem
                                                disablePadding
                                                onClick={(event) => onChatBoxMessageOptionsClick(event, 'reply', {isOpen: true, data: item})}
                                                sx={{ 
                                                    cursor: 'pointer', 
                                                    display: 'flex',
                                                    width: '100%'
                                                }}
                                            >
                                                <IconButton
                                                    color="dark.light"
                                                    sx={{ width: 15, px: 2 }}
                                                    title="Reply"
                                                >
                                                    <ReplyIcon />
                                                </IconButton>
                                            </ListItem>
                                            <ListItem
                                                disablePadding
                                                onClick={(event) => onChatBoxMessageOptionsClick(event, 'more', {isOpen: !chatMoreState.isOpen})}
                                                sx={{ 
                                                    position: 'relative',
                                                    cursor: 'pointer', 
                                                    display: 'flex',
                                                    width: '100%'
                                                }}
                                            >
                                                <IconButton
                                                    color="dark.light"
                                                    sx={{ width: 12, px: 2 }}
                                                    title="More"
                                                >
                                                    <MoreIcon />
                                                </IconButton>

                                                {chatMoreState.isOpen ? (
                                                    <List 
                                                        sx={{
                                                            position: 'absolute',
                                                            top: source == 'sender' ? '-72px' : '-42px',
                                                            left: '-32px',
                                                            backgroundColor: theme.palette.light.main,
                                                            color: theme.palette.dark.main,
                                                            borderRadius: '10px',
                                                            padding: '.5rem',
                                                            zIndex: 20,
                                                        }}
                                                    >
                                                        {chatBoxMoreItems[source] ? chatBoxMoreItems[source].map((mItem, mIdx) => {
                                                            return (
                                                                <ListItem
                                                                    key={mIdx}
                                                                    disablePadding
                                                                    onClick={(event) => onChatBoxMoreListItemsClick(
                                                                        event, 
                                                                        mItem.value,
                                                                        {
                                                                            isEditing: mItem.value == 'edit' ? true : false,
                                                                            data: item
                                                                        }
                                                                    )}
                                                                    sx={{ 
                                                                        "&:hover": {
                                                                            backgroundColor: theme.palette.light.dark,
                                                                            borderRadius: '10px',
                                                                        },
                                                                        cursor: 'pointer', 
                                                                        display: 'flex',
                                                                        width: '100%',
                                                                        padding: '.2rem .5rem'
                                                                    }}
                                                                >
                                                                    <span style={{minWidth: '25px'}}><FontAwesomeIcon icon={mItem.icon} size="lg" /></span> {mItem.label}
                                                                </ListItem>
                                                            )
                                                        }) : null}
                                                    </List>
                                                ) : null}
                                            </ListItem>
                                        </List>
                                    ) : null}

                                    {item.attachments && item.attachments.length > 0 ? (
                                        <Box className="chat-box-message-attachments">
                                            {item.attachments.map((atchItem, atchIdx) => (
                                                <div key={idx}>
                                                    {renderAttachmentActionByType(atchItem, atchIdx, atchItem?.type)}
                                                    {renderAttachmentItemByType(atchItem, atchIdx, atchItem?.type)}
                                                </div>
                                            ))}
                                        </Box>
                                    ) : null}

                                    <Box className="chat-box-message-text" sx={{fontSize: checkIfEmojiOnly(item.message) ? '1.8rem' : '.95rem'}}>
                                        {parseStringToHtml(item.message)}
                                    </Box>
                                    <Box 
                                        className="chat-box-message-timestamp" 
                                        title={formatDateTime(item.timestamp, 'dddd, MMMM DD, YYYY @ hh:mm A', { origin: 'chat-timestamp' })}
                                        sx={{
                                            backgroundColor: theme.palette.dark.light,
                                            color: theme.palette.light.main
                                        }}
                                    >
                                        {formatDateTime(item.timestamp, 'h:mm A')} {item.isMessageEdited ? '(Edited)' : null}
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Box>
                )}
            </div>
        );
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

    function renderAttachmentActionByType(item, idx, type) {
        if (type && (type.includes('image') || type.includes('video'))) {
            return (
                <>
                    {props.isMobileView ? (
                        <span key={idx} className="attachment-thumbnail-action" onClick={(event) => onMessageAttachmentClick(event, item)}>
                            <PreviewIcon />
                        </span>
                    ) : null}
                </>
            )
        }
    }

    function renderAttachmentItemByType(item, idx, type) {
        if (type && type.includes('image')) {
            return (
                <>
                    <img key={idx} className="attachment-thumbnail-item" src={`./attachments/${item?.name}`} onClick={(event) => !props.isMobileView ? onMessageAttachmentClick(event, item) : null} />
                </>
            );
        }
        if (type && type.includes('video')) {
            return (
                <>
                    <video key={idx} className="attachment-thumbnail-item" onClick={(event) => !props.isMobileView ?onMessageAttachmentClick(event, item) : null} autoPlay controls muted>
                        <source src={`./attachments/${item?.name}`} />
                    </video>
                </>
            )
        }

        return item?.name ? (
            <a key={idx} href={`./attachments/${item?.name}`} className="attachment-thumbnail-default" target='_blank'>
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
        <div 
            className="chat-box" 
            style={{
                height: chatBoxHeight,
                width: chatBoxWidth, 
                bottom: chatBoxBotPos, 
                right: props.instance > 1 ? chatBoxRightPos + (320 * (props.instance - 1)) : chatBoxRightPos 
            }}
        >
            <Paper sx={CHAT_BOX.chatBoxPaperContainer} elevation={5}>
                <Card sx={{...CHAT_BOX.chatBoxCardContainer, backgroundColor: theme.palette.muted.main}}>
                    <Paper elevation={2}>
                        <CardHeader
                            sx={{ 
                                ...CHAT_BOX.chatBoxCardHeader, 
                                backgroundColor: theme.palette.dark.light, 
                                color: theme.palette.light.main, 
                                height: '12%' 
                            }}
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
                                        sx={{color: theme.palette.light.main}}
                                        onClick={(event) => onMinimizeClick(event, actChatData)}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <IconButton
                                        sx={{color: theme.palette.light.main}}
                                        onClick={(event) => onCloseClick(event, actChatData)}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </>
                            }
                        />
                    </Paper>

                    <CardContent 
                        ref={chatBoxContentRef} 
                        sx={{ 
                            ...CHAT_BOX.chatBoxCardContent, 
                            height: !checkCondition('attachment-reply') ? '76%' : '60%'
                        }} 
                        className="chat-box-content" 
                        onScroll={onChatBoxContentScroll}
                    >
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

                    <CardActions 
                        sx={{ 
                            ...CHAT_BOX.chatBoxCardActions, 
                            backgroundColor: theme.palette.secondary.main, 
                            height: !checkCondition('attachment-reply') ? '12%' : '28%'
                        }} 
                        disableSpacing
                    >
                        {chatReplyState.isOpen ? (
                            <>
                                <Box className="chat-reply-container">
                                    <Box className="chat-reply-content">
                                        <Box className="chat-reply-target">Replying to&nbsp;<b>{chatReplyState?.data?.sender == props.userData?.name ? 'yourself' : chatReplyState?.data?.sender}</b>:</Box>
                                        <Box className="chat-reply-message">{chatReplyState?.data?.attachments?.length > 0 ? '[Attachment] ' + chatReplyState?.data?.message : chatReplyState?.data?.message}</Box>
                                    </Box>
                                    <Box className="chat-reply-action">
                                        <IconButton
                                            sx={{color: theme.palette.dark.main}}
                                            onClick={(event) => onChatBoxMessageOptionsClick(event, 'reply', {isOpen: false, data: null})}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </>
                        ) : null}
                        {chatEditState.isEditing ? (
                            <>
                                <Box className="chat-edit-container">
                                    <Box className="chat-edit-content">Edit Message</Box>
                                    <Box className="chat-edit-action">
                                        <IconButton
                                            sx={{color: theme.palette.dark.main}}
                                            onClick={(event) => onChatBoxMoreListItemsClick(event, 'edit', {isEditing: false, data: null})}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </>
                        ) : null}
                        <Box sx={CHAT_BOX.chatBoxCardActionsBox}>
                            <input key={chatAttachments} type="file" ref={chatBoxAttachmentRef} accept="*/*" multiple hidden onChange={onAttachFileChange} />
                            <IconButton onClick={onAttachFileClick}>
                                <AttachmentIcon />
                            </IconButton>
                            <IconButton onClick={onEmojiPickerClick}>
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
                                                    onClick={onAttachFileCancel}
                                                >
                                                    <FontAwesomeIcon icon={faRectangleXmark} size="lg" />
                                                </span>
                                            </Box>

                                            {chatAttachments.map((item, idx) => (
                                                <Box key={idx} className="chat-attachment-thumbnail" title={item?.name}>
                                                    <span 
                                                        className="chat-attachment-remove"
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
                    open={emojiPopover ? true : false}
                    anchorEl={emojiPopover}
                    onClose={() => setEmojiPopover(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    disablePortal
                >
                    <Box className="emoji-container">
                        <EmojiPicker 
                            className="emoji-picker" 
                            emojiStyle="native" 
                            defaultSkinTone="neutral" 
                            suggestedEmojisMode="recent" 
                            open={emojiPopover ? true : false} 
                            onEmojiClick={onEmojiClick} 
                            skinTonesDisabled 
                        />
                    </Box>
                </Popover>
            </Paper>
        </div>
    )
}