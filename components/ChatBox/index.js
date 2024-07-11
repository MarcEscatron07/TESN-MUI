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

export default function ChatBox(props) {
    const theme = useTheme();

    const [chatMessage, setChatMessage] = useState('');

    useEffect(() => {
        console.log('ChatBox > props', props)
    }, [])

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
            <Paper sx={{ height: '100%' }} elevation={5}>
                <Card sx={{ height: '100%' }}>
                    <Paper elevation={2}>
                        <CardHeader
                            sx={{
                                height: '12%',
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: theme.palette.light.dark,
                                padding: 1,
                                "& .MuiCardHeader-avatar": {
                                    height: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                },
                                "& .MuiCardHeader-content": {
                                    height: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                },
                                "& .MuiCardHeader-action": {
                                    height: 48,
                                    display: 'flex',
                                    alignItems: 'center',
                                }
                            }}
                            avatar={<Avatar alt="Chat Avatar" src={props?.data?.owner?.image ?? `/images/avatars/avatar_male_${props?.instance + 1}.png`} />}
                            title={<span style={{ fontWeight: 'bold', fontSize: '.95rem' }}>{props?.data?.owner?.name ?? ['Jerson Albit', 'Joel Buena', 'Rommel Digal', 'Junjie Bautista'][(props?.instance - 1) ?? 0]}</span>}
                            action={
                                <>
                                    <IconButton aria-label="minimize">
                                        <RemoveIcon />
                                    </IconButton>
                                    <IconButton aria-label="close">
                                        <CloseIcon />
                                    </IconButton>
                                </>
                            }
                        />
                    </Paper>

                    <CardContent sx={{ height: '76%', px: 2, overflowX: 'hidden', overflowY: 'auto' }} className="chatbox-content">
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <LinkIcon />
                            <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                                You are now connected on chat
                            </Typography>
                        </Box>                        
                    </CardContent>

                    <CardActions sx={{ height: '12%', display: 'flex', justifyContent: 'space-between', backgroundColor: theme.palette.secondary.main }} disableSpacing>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton aria-label="attachment">
                                <AttachmentIcon />
                            </IconButton>
                            <IconButton aria-label="emoji">
                                <AddReactionIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Input
                                multiline
                                variant="filled"
                                maxRows={1}
                                value={chatMessage}
                                onChange={onChatInputChange}
                                onKeyDown={onChatInputKeyDown}
                                onFocus={onChatInputFocus}
                                sx={{p: 1, overflow: 'hidden', backgroundColor: theme.palette.light.main, borderRadius: '0px 0px 0px 4px'}}
                            />
                            <Button variant="contained" color="primary" sx={{ borderRadius: '0px 4px 4px 0px' }}>
                                <SendIcon sx={{ color: theme.palette.light.main }} />
                            </Button>
                        </Box>
                    </CardActions>
                </Card>
            </Paper>
        </div>
    )
}