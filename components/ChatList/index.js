"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';

import AddIcon from '@mui/icons-material/Add';

import {
    StyledBadge,
  } from "@/components/function";

export default function ChatList() {
    const theme = useTheme();

    return (
        <div
            className="chat-list"
        >
            <Fab sx={{ mt: 1 }} color="primary" size="small" aria-label="add">
                <AddIcon />
            </Fab>

            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                    position: 'relative',
                    cursor: 'pointer', 
                    mt: 1,
                    "& .MuiBadge-badge": {
                        color: "lightgreen",
                        backgroundColor: "green"
                    }
                }}
            >
                <Avatar alt="Chat Avatar" src={'/images/avatars/avatar_male_2.png'} />
            </StyledBadge>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                    position: 'relative',
                    cursor: 'pointer', 
                    mt: 1,
                    "& .MuiBadge-badge": {
                        color: "lightgray",
                        backgroundColor: "gray"
                    }
                }}
            >
                <Avatar alt="Chat Avatar" src={'/images/avatars/avatar_male_3.png'} />
            </StyledBadge>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                    position: 'relative',
                    cursor: 'pointer', 
                    mt: 1,
                    "& .MuiBadge-badge": {
                        color: "lightgreen",
                        backgroundColor: "green"
                    }
                }}
            >
                <Avatar alt="Chat Avatar" src={'/images/avatars/avatar_male_4.png'} />
            </StyledBadge>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                    position: 'relative',
                    cursor: 'pointer', 
                    mt: 1,
                    "& .MuiBadge-badge": {
                        color: "lightgray",
                        backgroundColor: "gray"
                    }
                }}
            >
                <Avatar alt="Chat Avatar" src={'/images/avatars/avatar_male_5.png'} />
            </StyledBadge>
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                    position: 'relative',
                    cursor: 'pointer', 
                    mt: 1,
                    "& .MuiBadge-badge": {
                        color: "lightgreen",
                        backgroundColor: "green"
                    }
                }}
            >
                <Avatar alt="Chat Avatar" src={'/images/avatars/avatar_male_6.png'} />
            </StyledBadge>
        </div>
    )
}