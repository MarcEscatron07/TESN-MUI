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
import TextField from '@mui/material/TextField';

import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import SendIcon from '@mui/icons-material/Send';

export default function ChatBox(props) {
    const theme = useTheme();

    const [chatMessage, setChatMessage] = useState('')

    const onChatAreaChange = (event) => {
        setChatMessage(event.target.value);
    }

    const onChatAreaKeyDown = (event) => {
        const charCode = event.keyCode || event.which;
        console.log('onChatAreaKeyDown > charCode', charCode)
    }

    const onChatAreaFocus = (event) => {

    }

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                right: 100,
                height: 450,
                width: 330,
                zIndex: 99996
            }}
            elevation={5}
        >
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
                        avatar={<Avatar alt="Chat Avatar" src={props?.data?.owner?.image ?? '/images/avatars/avatar_male_2.png'} />}
                        title={<span style={{ fontWeight: 'bold', fontSize: '.95rem' }}>{props?.data?.owner?.name ?? 'Jerson Albit'}</span>}
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
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
                        <TextField
                            multiline
                            variant="filled"
                            maxRows={1}
                            value={chatMessage}
                            onChange={onChatAreaChange}
                            onKeyDown={onChatAreaKeyDown}
                            onFocus={onChatAreaFocus}
                            InputProps={{
                                style: { paddingTop: 8, paddingBottom: 8, overflow: 'hidden', backgroundColor: theme.palette.light.main, borderRadius: '4px 0px 0px 4px' }
                            }}
                        />
                        <Button variant="contained" color="primary" sx={{ borderRadius: '0px 4px 4px 0px' }}>
                            <SendIcon sx={{ color: theme.palette.light.main }} />
                        </Button>
                    </Box>
                </CardActions>
            </Card>
        </Paper>
    )
}