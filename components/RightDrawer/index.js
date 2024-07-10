"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';

import CakeIcon from '@mui/icons-material/Cake';

import {
  DrawerHeader,
  Drawer,
  StyledBadge,
} from "@/components/function";

export default function RightDrawer(props) {
  const theme = useTheme();

  const birthdaysList = [
    {
      name: 'Jerson Albit',
      office: 'TICTO'
    },
    {
      name: 'Beverly Malima',
      office: 'CHO'
    },
  ];

  const friendConvoList = [
    {
      id: 2,
      name: "Jerson Albit",
      image: "/images/avatars/avatar_male_2.png",
      type: "single",
      unread: 0,
      isOnline: true
    },
    {
      id: 3,
      name: "Joel Buena",
      image: "/images/avatars/avatar_male_3.png",
      type: "single",
      unread: 0,
      isOnline: false
    },
    {
      id: 4,
      name: "Rommel Digal",
      image: "/images/avatars/avatar_male_4.png",
      type: "single",
      unread: 0,
      isOnline: true
    },
    {
      id: 5,
      name: "Junjie Bautista",
      image: "/images/avatars/avatar_male_5.png",
      type: "single",
      unread: 0,
      isOnline: false
    },
    {
      id: 6,
      name: "Ian Tambis",
      image: "/images/avatars/avatar_male_6.png",
      type: "single",
      unread: 0,
      isOnline: true
    },
  ];

  const groupConvoList = [
    {
      id: 7,
      name: "TICTO",
      image: "/images/avatars/avatar_ticto_seal.png",
      type: "multiple",
      userIds: [1, 2, 3, 4, 5, 6],
      unread: 0,
      isOnline: true
    }
  ];

  useEffect(() => { }, []);

  return (
    <Drawer
      anchor="right"
      variant="permanent"
      open={true}
      elevation={3}
      PaperProps={{
        style: {
          backgroundColor: theme.palette.dark.light,
          color: theme.palette.light.main,
        },
      }}
    >
      <DrawerHeader
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.primary.light,
        }}
      >
      </DrawerHeader>

      <Divider sx={{backgroundColor: theme.palette.dark.main}} />

      <List
        subheader={
          <ListSubheader component="div" sx={{ backgroundColor: theme.palette.dark.light, color: theme.palette.light.main, textTransform: 'uppercase', fontWeight: 'bold' }}>
            Birthdays Today
          </ListSubheader>
        }
      >
        {birthdaysList.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: "initial",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: "center",
                  color: theme.palette.light.main,
                }}
              >
                <CakeIcon />
              </ListItemIcon>
              <ListItemText primary={`${item.name} (${item.office})`} sx={{ opacity: 1 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{backgroundColor: theme.palette.light.dark}} />

      <List
        subheader={
          <ListSubheader component="div" sx={{ backgroundColor: theme.palette.dark.light, color: theme.palette.light.main, textTransform: 'uppercase', fontWeight: 'bold' }}>
            Friend Conversations
          </ListSubheader>
        }
      >
        {friendConvoList.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: "initial",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: "center",
                  color: theme.palette.light.main,
                }}
              >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{
                    "& .MuiBadge-badge": {
                      color: item?.isOnline ? "lightgreen" : "lightgray",
                      backgroundColor: item?.isOnline ? "green" : "gray"
                    }
                  }}
                >
                  <Avatar alt="Friend Avatar" src={item.image} />
                </StyledBadge>
              </ListItemIcon>
              <ListItemText primary={item.name} sx={{ opacity: 1 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{backgroundColor: theme.palette.light.dark}} />

      <List
        subheader={
          <ListSubheader component="div" sx={{ backgroundColor: theme.palette.dark.light, color: theme.palette.light.main, textTransform: 'uppercase', fontWeight: 'bold' }}>
            Group Conversations
          </ListSubheader>
        }
      >
        {groupConvoList.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: "initial",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: "center",
                  color: theme.palette.light.main,
                }}
              >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{
                    "& .MuiBadge-badge": {
                      color: item?.isOnline ? "lightgreen" : "lightgray",
                      backgroundColor: item?.isOnline ? "green" : "gray"
                    }
                  }}
                >
                  <Avatar alt="Group Avatar" src={item.image} />
                </StyledBadge>
              </ListItemIcon>
              <ListItemText primary={item.name} sx={{ opacity: 1 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}