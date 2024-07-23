"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";

import EditNoteIcon from "@mui/icons-material/EditNote";

import { StyledBadge } from "@/components/function";
import { CHAT_LIST } from '@/components/styles';

export default function ChatList(props) {
  const theme = useTheme();

  const [pasChatList, setPasChatList] = useState([]);

  useEffect(() => {
  }, [])

  useEffect(() => {
    setPasChatList(props.passiveChatList);
  }, [props.passiveChatList])

  return (
    <div className="chat-list">
      {/* <Fab sx={CHAT_LIST.chatListFabNewChat} color="secondary" size="medium">
        <EditNoteIcon fontSize="large" />
      </Fab> */}

      {pasChatList.map((item, idx) => (
        <Fab key={idx} sx={CHAT_LIST.chatListFabAvatar}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            sx={CHAT_LIST.chatListStyledBadgeAvatarOnline}
          >
            <Avatar alt={item.name} src={item.image} />
          </StyledBadge>
        </Fab>
      ))}
    </div>
  );
}
