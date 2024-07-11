"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";

import EditNoteIcon from "@mui/icons-material/EditNote";

import { StyledBadge } from "@/components/function";

export default function ChatList() {
  const theme = useTheme();

  return (
    <div className="chat-list">
      <Fab sx={{ my: 1 }} color="secondary" size="medium">
        <EditNoteIcon fontSize="large" />
      </Fab>

      <IconButton>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={{
            position: "relative",
            "& .MuiBadge-badge": {
              color: "lightgreen",
              backgroundColor: "green",
            },
          }}
        >
          <Avatar alt="Chat Avatar" src={"/images/avatars/avatar_male_2.png"} />
        </StyledBadge>
      </IconButton>
      <IconButton>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={{
            position: "relative",
            "& .MuiBadge-badge": {
              color: "lightgray",
              backgroundColor: "gray",
            },
          }}
        >
          <Avatar alt="Chat Avatar" src={"/images/avatars/avatar_male_3.png"} />
        </StyledBadge>
      </IconButton>
      <IconButton>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={{
            position: "relative",
            "& .MuiBadge-badge": {
              color: "lightgreen",
              backgroundColor: "green",
            },
          }}
        >
          <Avatar alt="Chat Avatar" src={"/images/avatars/avatar_male_4.png"} />
        </StyledBadge>
      </IconButton>
      <IconButton>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={{
            position: "relative",
            "& .MuiBadge-badge": {
              color: "lightgray",
              backgroundColor: "gray",
            },
          }}
        >
          <Avatar alt="Chat Avatar" src={"/images/avatars/avatar_male_5.png"} />
        </StyledBadge>
      </IconButton>
      <IconButton>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={{
            position: "relative",
            "& .MuiBadge-badge": {
              color: "lightgreen",
              backgroundColor: "green",
            },
          }}
        >
          <Avatar alt="Chat Avatar" src={"/images/avatars/avatar_male_6.png"} />
        </StyledBadge>
      </IconButton>
    </div>
  );
}
