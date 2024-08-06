"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Popover from '@mui/material/Popover';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CancelIcon from '@mui/icons-material/Cancel';
import RemoveIcon from '@mui/icons-material/Remove';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { StyledBadge } from "@/components/function";
import { CHAT_LIST } from '@/components/styles';

export default function ChatList(props) {
  const theme = useTheme();

  const [pasChatList, setPasChatList] = useState([]);
  const [fabAvatarIdx, setFabAvatarIdx] = useState(-1);
  const [popoverAnchor, setPopoverAnchor] = useState(null);

  const chatListBotPos = props.isMobileView ? props.isRightDrawerMobileOpen ? 83 : (83-50) : 0;
  const chatListLeftPos = props.isMobileView ? 5 : 285;

  useEffect(() => {
  }, [])

  useEffect(() => {
  }, [props.isRightDrawerMobileOpen])

  useEffect(() => {
    setPasChatList(props.passiveChatList);
  }, [props.passiveChatList])

  const onChatClick = (event, value) => {
    if (props.onListChatClick) {
      props.onListChatClick(value);
    }
  }

  const onRemoveClick = (event, value) => {
    if (props.onChatListRemoveClick) {
      props.onChatListRemoveClick(value);
    }
  }

  const onOptionClick = (event) => {
    setPopoverAnchor(event.target);
  }

  const onOptionCloseClick = () => {
    setPopoverAnchor(null);

    if (props.onChatListCloseClick) {
      props.onChatListCloseClick();
    }
  }

  const onOptionMinimizeClick = () => {
    setPopoverAnchor(null);

    if (props.onChatListMinimizeClick) {
      props.onChatListMinimizeClick();
    }
  }

  return (
    <div 
      className="chat-list" 
      style={{ 
        bottom: chatListBotPos, 
        left: chatListLeftPos 
      }}
    >
      {pasChatList.map((item, idx) => (
        <Fab
          key={idx}
          sx={{ 
            ...CHAT_LIST.chatListFabAvatar, 
            backgroundColor: 'none',
            height: props.isMobileView ? '35px' : '55px', width: props.isMobileView ? '35px' : '55px'
          }}
          onMouseEnter={() => setFabAvatarIdx(idx)}
          onMouseLeave={() => setFabAvatarIdx(-1)}
        >
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            sx={{
              "& .MuiBadge-badge": {
                color: item.isOnline ? "lightgreen" : "lightgray",
                backgroundColor: item.isOnline ? "green" : "gray"
              }
            }}
            onClick={(event) => onChatClick(event, item)}
          >
            <Avatar alt={item.name} src={item.image} sx={{height: props.isMobileView ? '35px' : '55px', width: props.isMobileView ? '35px' : '55px'}} />
          </StyledBadge>

          {fabAvatarIdx == idx ? (
            <span 
              aria-label="fab-avatar-close" 
              style={{ ...CHAT_LIST.chatListFabClose, top: props.isMobileView ? -8 : -2, backgroundColor: theme.palette.secondary.main }} 
              onClick={(event) => onRemoveClick(event, item)}
            >
              <FontAwesomeIcon icon={faTimes} size="md" />
            </span>
          ) : null}
        </Fab>
      ))}

      {pasChatList.length >= 2 ? (
        <IconButton
          aria-label="chat-icon-option"
          sx={{ 
            ...CHAT_LIST.chatListOption,
            "&:hover": {
              backgroundColor: theme.palette.secondary.dark
            },
            backgroundColor: theme.palette.secondary.main,
            height: props.isMobileView ? '25px' : '40px', 
            width: props.isMobileView ? '25px' : '40px'
          }}
          onClick={onOptionClick}
        >
          <MoreHorizIcon />
        </IconButton>
      ) : null}

      <Popover
        id={popoverAnchor ? 'chatlist-popover' : undefined}
        open={popoverAnchor ? true : false}
        anchorEl={popoverAnchor}
        onClose={() => setPopoverAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        disablePortal
      >
        <Box
          sx={CHAT_LIST.chatListPopoverBox}
        >
          <Button
            sx={{
              ...CHAT_LIST.chatListPopoverOptionClose,
              color: theme.palette.dark.main
            }}
            startIcon={<CancelIcon />}
            onClick={onOptionCloseClick}
          >
            Close all chats
          </Button>
          {props.activeChatList && props.activeChatList.length > 0 ? (
            <Button
              sx={{
                ...CHAT_LIST.chatListPopoverOptionMinimize,
                color: theme.palette.dark.main
              }}
              startIcon={<RemoveIcon />}
              onClick={onOptionMinimizeClick}
            >
              Minimize open chats
            </Button>
          ) : null}
        </Box>
      </Popover>
    </div>
  );
}
