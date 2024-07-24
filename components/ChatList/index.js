"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Popover from '@mui/material/Popover';

import EditNoteIcon from "@mui/icons-material/EditNote";
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

  useEffect(() => {
  }, [])

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
    <div className="chat-list">
      {/* <Fab sx={CHAT_LIST.chatListFabNewChat} color="secondary" size="medium">
        <EditNoteIcon fontSize="large" />
      </Fab> */}

      {pasChatList.map((item, idx) => (
        <Fab
          key={idx}
          color="light"
          sx={{ ...CHAT_LIST.chatListFabAvatar, backgroundColor: theme.palette.light.dark }}
          onMouseEnter={() => setFabAvatarIdx(idx)}
          onMouseLeave={() => setFabAvatarIdx(-1)}
        >
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            sx={{
              "& .MuiBadge-badge": {
                color: item?.isOnline ? "lightgreen" : "lightgray",
                backgroundColor: item?.isOnline ? "green" : "gray"
              }
            }}
            onClick={(event) => onChatClick(event, item)}
          >
            <Avatar alt={item.name} src={item.image} />
          </StyledBadge>

          {fabAvatarIdx == idx ? (
            <span style={{ ...CHAT_LIST.chatListFabClose, backgroundColor: theme.palette.secondary.main }} aria-label="fab-avatar-close" onClick={(event) => onRemoveClick(event, item)}>
              <FontAwesomeIcon icon={faTimes} size="md" />
            </span>
          ) : null}
        </Fab>
      ))}

      {pasChatList.length >= 2 ? (
        <IconButton
          aria-label="chat-icon-close"
          sx={{ 
            "&:hover": {
              backgroundColor: theme.palette.secondary.dark
            },
            backgroundColor: theme.palette.secondary.main,
            mb: 1.5
          }}
          onClick={onOptionClick}
        >
          <MoreHorizIcon />
        </IconButton>
      ) : null}

      <Popover
        id={popoverAnchor ? 'simple-popover' : undefined}
        open={popoverAnchor ? true : false}
        anchorEl={popoverAnchor}
        onClose={() => setPopoverAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        disablePortal
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              color: theme.palette.dark.main
            }}
            startIcon={<CancelIcon />}
            onClick={onOptionCloseClick}
          >
            Close all chats
          </Button>
          <Button
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              color: theme.palette.dark.main
            }}
            startIcon={<RemoveIcon />}
            onClick={onOptionMinimizeClick}
          >
            Minimize open chats
          </Button>
        </Box>
      </Popover>
    </div>
  );
}
