"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";

import EditNoteIcon from "@mui/icons-material/EditNote";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { StyledBadge } from "@/components/function";
import { CHAT_LIST } from '@/components/styles';

export default function ChatList(props) {
  const theme = useTheme();

  const [pasChatList, setPasChatList] = useState([]);
  const [fabAvatarIdx, setFabAvatarIdx] = useState(-1);

  useEffect(() => {
  }, [])

  useEffect(() => {
    setPasChatList(props.passiveChatList);
  }, [props.passiveChatList])

  const onChatClick = (event, value) => {
    if(props.onListChatClick) {
      props.onListChatClick(value);
    }
  }

  const onRemoveClick = (event, value) => {
    if(props.onChatListRemoveClick) {
      props.onChatListRemoveClick(value);
    }
  }

  return (
    <div className="chat-list">
      {/* <Fab sx={CHAT_LIST.chatListFabNewChat} color="secondary" size="medium">
        <EditNoteIcon fontSize="large" />
      </Fab> */}

      {pasChatList.map((item, idx) => (
        <Fab 
          key={idx} 
          color="light" 
          sx={{...CHAT_LIST.chatListFabAvatar, backgroundColor: theme.palette.light.dark}} 
          onMouseEnter={() => setFabAvatarIdx(idx)} 
          onMouseLeave={() => setFabAvatarIdx(-1)}
        >
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            sx={CHAT_LIST.chatListStyledBadgeAvatarOnline}
            onClick={(event) => onChatClick(event, item)}
          >
            <Avatar alt={item.name} src={item.image} />
          </StyledBadge>

          {fabAvatarIdx == idx ? (
            <span style={{...CHAT_LIST.chatListFabClose, backgroundColor: theme.palette.secondary.main}} aria-label="fab-avatar-close" onClick={(event) => onRemoveClick(event, item)}>
              <FontAwesomeIcon icon={faTimes} size="md" />
            </span>
          ) : null}
        </Fab>
      ))}
    </div>
  );
}
