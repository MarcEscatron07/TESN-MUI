"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from '@mui/material/ListSubheader';
import Typography from "@mui/material/Typography";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faBullhorn, faCalendar, faFile } from '@fortawesome/free-solid-svg-icons';

import {
  DrawerHeader,
  Drawer,
} from "@/components/function";

import { SITENAME_ABBR } from "@/lib/variables";

export default function LeftDrawer(props) {
  const theme = useTheme();

  const navigationList = [
    {
      icon: <FontAwesomeIcon icon={faHome} size="lg" /> ,
      text: 'Home',
    },
    {
      icon: <FontAwesomeIcon icon={faBullhorn} size="lg" /> ,
      text: 'Announcements',
    },
    {
      icon: <FontAwesomeIcon icon={faCalendar} size="lg" /> ,
      text: 'Calendar',
    },
    {
      icon: <FontAwesomeIcon icon={faFile} size="lg" /> ,
      text: 'Reports',
    },
  ]

  useEffect(() => {}, []);

  const handleCloseDrawerClick = () => {
    if(props.onDrawerToggleClick) {
      props.onDrawerToggleClick(false);
    }
  }

  return (
    <Drawer
      anchor="left"
      variant="permanent"
      open={props.isLeftDrawerOpen}
      elevation={3}
      PaperProps={{
        style: {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
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
        <Paper
          style={{
            width: "85%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            borderRadius: '10px 50px 20px 50px',
            backgroundColor: theme.palette.secondary.main,
          }}
        >
          <Image
            className="page-logo"
            src="/images/tagbilaran-seal.png"
            width={40}
            height={40}
            alt="Tagbilaran Seal"
          />
          <Typography
            variant="h6"
            noWrap
            component="div"
            color="light"
            style={{ marginLeft: 15, color: theme.palette.dark.main }}
          >
            {SITENAME_ABBR}
          </Typography>
        </Paper>
        <Box sx={{ width: "15%" }}>
          <IconButton
            onClick={handleCloseDrawerClick}
            sx={{ color: theme.palette.light.main }}
          >
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </Box>
      </DrawerHeader>

      <Divider sx={{backgroundColor: theme.palette.dark.main}} />

      <List 
        subheader={
          <ListSubheader component="div" sx={{backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, textTransform: 'uppercase', fontWeight: 'bold'}}>
            {props.isLeftDrawerOpen ? 'Navigation' : null}
          </ListSubheader>
        }
      >
        {navigationList.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: props.isLeftDrawerOpen ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: props.isLeftDrawerOpen ? 3 : "auto",
                  justifyContent: "center",
                  color: theme.palette.light.main,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: props.isLeftDrawerOpen ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{backgroundColor: theme.palette.light.dark}} />

      <List 
        subheader={
          <ListSubheader component="div" sx={{backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, textTransform: 'uppercase', fontWeight: 'bold'}}>
            {props.isLeftDrawerOpen ? 'Others' : null}
          </ListSubheader>
        }
      >
        {["Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: props.isLeftDrawerOpen ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: props.isLeftDrawerOpen ? 3 : "auto",
                  justifyContent: "center",
                  color: theme.palette.light.main,
                }}
              >
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ opacity: props.isLeftDrawerOpen ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}