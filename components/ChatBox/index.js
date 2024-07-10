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
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import SendIcon from '@mui/icons-material/Send';

export default function ChatBox(props) {
    const theme = useTheme();

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
                        sx={{ height: '12%', backgroundColor: theme.palette.light.dark, padding: 1 }}
                        avatar={<Avatar alt="Chat Avatar" src={props?.data?.owner?.image ?? '/images/avatars/avatar_male_2.png'} />}
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
                        title={<span style={{ fontWeight: 'bold', fontSize: '.95rem' }}>{props?.data?.owner?.name ?? 'Jerson Albit'}</span>}
                    />
                </Paper>

                <CardContent className="chatbox-content" sx={{ height: '76%', px: 2, overflowX: 'hidden', overflowY: 'auto' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                </CardContent>

                <CardActions sx={{ height: '12%', display: 'flex', justifyContent: 'space-between', backgroundColor: theme.palette.secondary.main }} disableSpacing>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <IconButton aria-label="attachment">
                            <AttachmentIcon />
                        </IconButton>
                        <IconButton aria-label="emoji">
                            <AddReactionIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <TextField
                            label=""
                            multiline
                            variant="filled"
                            maxRows={1}
                            InputProps={{
                                style: {paddingTop: 8, paddingBottom: 8, overflow: 'hidden'}
                            }}
                        />
                        <IconButton aria-label="send">
                            <SendIcon />
                        </IconButton>
                    </Box>
                </CardActions>
            </Card>
        </Paper>
    )
}