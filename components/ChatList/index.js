"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";

import EditNoteIcon from "@mui/icons-material/EditNote";

import { StyledBadge } from "@/components/function";
import { CHAT_LIST } from '@/components/styles';

export default function ChatList() {
  const theme = useTheme();

  return (
    <div className="chat-list">
      <Fab sx={CHAT_LIST.chatListFabNewChat} color="secondary" size="medium">
        <EditNoteIcon fontSize="large" />
      </Fab>

      <Fab sx={CHAT_LIST.chatListFabAvatar}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={CHAT_LIST.chatListStyledBadgeAvatarOnline}
        >
          <Avatar alt="Chat Avatar" src={"/images/avatars/avatar_male_2.png"} />
        </StyledBadge>
      </Fab>


      <Fab sx={CHAT_LIST.chatListFabAvatar}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={CHAT_LIST.chatListStyledBadgeAvatarOffline}
        >
          <Avatar alt="Chat Avatar" src={"/images/avatars/avatar_male_3.png"} />
        </StyledBadge>
      </Fab>
      <Fab sx={CHAT_LIST.chatListFabAvatar}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={CHAT_LIST.chatListStyledBadgeAvatarOnline}
        >
          <Avatar alt="Chat Avatar" src={"/images/avatars/avatar_male_4.png"} />
        </StyledBadge>
      </Fab>
      <Fab sx={CHAT_LIST.chatListFabAvatar}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={CHAT_LIST.chatListStyledBadgeAvatarOffline}
        >
          <Avatar alt="Chat Avatar" src={"/images/avatars/avatar_male_5.png"} />
        </StyledBadge>
      </Fab>
      <Fab sx={CHAT_LIST.chatListFabAvatar}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={CHAT_LIST.chatListStyledBadgeAvatarOnline}
        >
          <Avatar alt="Chat Avatar" src={"/images/avatars/avatar_male_6.png"} />
        </StyledBadge>
      </Fab>
      <Fab sx={CHAT_LIST.chatListFabAvatar}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={CHAT_LIST.chatListStyledBadgeAvatarOffline}
        >
          <Avatar alt="Chat Avatar" src={"/images/avatars/avatar_male_7.png"} />
        </StyledBadge>
      </Fab>
    </div>
  );
}
