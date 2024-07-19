"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import HomeIcon from "@mui/icons-material/Home";
import CampaignIcon from "@mui/icons-material/Campaign";
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import BookmarkIcon from '@mui/icons-material/Bookmark';

import { DrawerHeader, Drawer } from "@/components/function";
import { LEFT_DRAWER } from '@/components/styles';
import { SITENAME_ABBR } from "@/lib/variables";

export default function LeftDrawer(props) {
  const router = useRouter();
  const theme = useTheme();

  const [activeNav, setActiveNav] = useState(localStorage.getItem('nav_data') ?? 'Home');

  const navigationList = [
    {
      icon: <HomeIcon />,
      text: 'Home',
    },
    {
      icon: <CampaignIcon />,
      text: 'Announcements',
    },
    {
      icon: <EventIcon />,
      text: 'Calendar',
    },
    {
      icon: <DescriptionIcon />,
      text: 'Reports',
    },
  ];

  const othersList = [
    {
      icon: <PeopleIcon />,
      text: 'Friends',
    },
    {
      icon: <GroupsIcon />,
      text: 'Groups',
    },
    {
      icon: <BookmarkIcon />,
      text: 'Saved',
    },
  ];

  useEffect(() => {
    if(localStorage.getItem('nav_data')) {
      setActiveNav(localStorage.getItem('nav_data'));
    }
  }, []);

  useEffect(() => {
    router.push(`/${activeNav.toLowerCase()}`);
  }, [activeNav])

  const handleCloseDrawerClick = () => {
    if (props.onDrawerToggleClick) {
      props.onDrawerToggleClick(false);
    }
  }

  const handleNavItemClick = (value) => {
    localStorage.setItem('nav_data', value);
    setActiveNav(value);
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
          ...LEFT_DRAWER.leftDrawerHeader,
          backgroundColor: theme.palette.primary.light,
        }}
      >
        <Paper
          style={{
            ...LEFT_DRAWER.leftDrawerHeaderPaper,
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
            style={{ ...LEFT_DRAWER.leftDrawerSitename, color: theme.palette.dark.main }}
          >
            {SITENAME_ABBR}
          </Typography>
        </Paper>
        <Box sx={{ width: "15%" }}>
          <IconButton aria-label="left-drawer-toggle" onClick={handleCloseDrawerClick} sx={{ color: theme.palette.light.main }}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </Box>
      </DrawerHeader>

      <Divider sx={{ backgroundColor: theme.palette.dark.main }} />

      <List
        subheader={
          <ListSubheader component="div" sx={{ ...LEFT_DRAWER.leftDrawerList, backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
            {props.isLeftDrawerOpen ? 'Navigation' : null}
          </ListSubheader>
        }
      >
        {navigationList.map((item, index) => (
          <ListItem key={index}
            disablePadding
            sx={{
              ...LEFT_DRAWER.leftDrawerListItem,
              backgroundColor: activeNav == item.text ? theme.palette.secondary.main : null,
              color: activeNav == item.text ? theme.palette.secondary.contrastText : null
            }}
            onClick={() => handleNavItemClick(item.text)}
          >
            <ListItemButton
              sx={{
                ...LEFT_DRAWER.leftDrawerListItemButton,
                justifyContent: props.isLeftDrawerOpen ? "initial" : "center",
              }}
            >
              <ListItemIcon
                sx={{
                  ...LEFT_DRAWER.leftDrawerListItemIcon,
                  mr: props.isLeftDrawerOpen ? 3 : "auto",
                  color: activeNav == item.text ? theme.palette.secondary.contrastText : theme.palette.light.main,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ style: { fontWeight: 'bold ' } }} sx={{ opacity: props.isLeftDrawerOpen ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ backgroundColor: theme.palette.light.dark }} />

      <List
        subheader={
          <ListSubheader component="div" sx={{ ...LEFT_DRAWER.leftDrawerList, backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
            {props.isLeftDrawerOpen ? 'Others' : null}
          </ListSubheader>
        }
      >
        {othersList.map((item, index) => (
          <ListItem key={index} disablePadding sx={LEFT_DRAWER.leftDrawerListItem}>
            <ListItemButton
              sx={{
                ...LEFT_DRAWER.leftDrawerListItemButton,
                justifyContent: props.isLeftDrawerOpen ? "initial" : "center",
              }}
            >
              <ListItemIcon
                sx={{
                  ...LEFT_DRAWER.leftDrawerListItemIcon,
                  mr: props.isLeftDrawerOpen ? 3 : "auto",
                  color: theme.palette.light.main,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ style: { fontWeight: 'bold ' } }} sx={{ opacity: props.isLeftDrawerOpen ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}