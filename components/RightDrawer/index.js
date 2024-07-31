"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import CakeIcon from '@mui/icons-material/Cake';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { DrawerHeader, Drawer, StyledBadge } from "@/components/function";
import { RIGHT_DRAWER } from '@/components/styles';

export default function RightDrawer(props) {
  const theme = useTheme();

  const [friendsList, setFriendsList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);

  const birthdaysList = [ // temporary data
    {
      name: 'Jerson Albit',
      office: 'TICTO'
    },
    {
      name: 'Beverly Malima',
      office: 'CHO'
    },
  ];

  useEffect(() => {
  }, []);

  useEffect(() => {
    setFriendsList(props.sessionFriends);
  }, [props.sessionFriends]);

  useEffect(() => {
    setGroupsList(props.sessionGroups);
  }, [props.sessionGroups]);

  useEffect(() => {
  }, [props.isRightDrawerMobileOpen]);

  const onChatClick = (event, value) => {
    if (props.onDrawerChatClick) {
      props.onDrawerChatClick(value);
    }
  }
  
  const onToggleMobileDrawerClick = (event) => {
    if(props.onMobileDrawerToggleClick) {
      props.onMobileDrawerToggleClick(!props.isRightDrawerMobileOpen);
    }
  }

  function renderChatNotification(value) {
    return (
      <span 
        style={{
          position: 'absolute',
          top: props.isMobileView ? -2 : -5,
          right: props.isMobileView ? -2 : -5,
          display: 'flex',
          borderRadius: 50,
          padding: '1px 5px',
          fontSize: '.65rem',
          fontWeight: 'bold',
          zIndex: 10,
          backgroundColor: theme.palette.accent2.main, 
          color: theme.palette.accent2.contrastText
        }}
      >
        {value}
      </span>
    )
  }

  return (
    <>
      {props.isMobileView ? (
        <>
          <Paper 
            elevation={4} 
            sx={{ 
              position: 'fixed', 
              bottom: props.isRightDrawerMobileOpen ? 0 : -52, 
              height: `${props.menuBarHeight + 8}px`, 
              width: '100%', 
              zIndex: 1200, 
              borderRadius: 0, 
              py: 1.5,
              backgroundColor: theme.palette.dark.light, 
              color: theme.palette.light.main,
            }}
          >
            <Box 
              sx={{ 
                position: 'relative',
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center',
              }}
            >
              <span 
                style={{
                  cursor: 'pointer',
                  position: 'absolute', 
                  top: -24, 
                  left: 8,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                  width: '30px',
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText
                }}
                onClick={onToggleMobileDrawerClick}
              >
                {props.isRightDrawerMobileOpen ? (<ExpandMoreIcon />) : (<ExpandLessIcon />)}
              </span>

              <List
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  py: 0,
                  mr: 3
                }}
              >
                {friendsList.map((item, idx) => (
                  <ListItem key={idx}
                    disablePadding
                    onClick={(event) => onChatClick(event, item)}
                    sx={{ width: 48 }}
                  >
                    <IconButton
                      color="light"
                      sx={{ width: 48 }}
                    >
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        sx={{
                          "& .MuiBadge-badge": {
                            color: item.isOnline ? "lightgreen" : "lightgray",
                            backgroundColor: item.isOnline ? "green" : "gray"
                          },
                          position: 'relative'
                        }}
                      >
                        {item.notifs?.messages?.count > 0 ? renderChatNotification(item.notifs?.messages?.count) : null}
                        <Avatar alt={item.name} src={item.image} />
                      </StyledBadge>
                    </IconButton>
                  </ListItem>
                ))}
              </List>

              <List
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  py: 0,
                }}
              >
                {groupsList.map((item, idx) => (
                  <ListItem key={idx}
                    disablePadding
                    onClick={(event) => onChatClick(event, item)}
                    sx={{ width: 48 }}
                  >
                    <IconButton
                      color="light"
                      sx={{ width: 48 }}
                    >
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        sx={{
                          "& .MuiBadge-badge": {
                            color: item?.isOnline ? "lightgreen" : "lightgray",
                            backgroundColor: item?.isOnline ? "green" : "gray"
                          },
                          position: 'relative'
                        }}
                      >
                        {item.notifs?.messages?.count > 0 ? renderChatNotification(item.notifs?.messages?.count) : null}
                        <Avatar alt="Group Avatar" src={item.image} />
                      </StyledBadge>
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </>
      ) : (
        <Drawer
          anchor="right"
          variant="permanent"
          open={props.isRightDrawerOpen}
          elevation={3}
          PaperProps={{
            style: {
              ...RIGHT_DRAWER.rightDrawerContainer,
              backgroundColor: theme.palette.dark.light,
              color: theme.palette.light.main,
            },
          }}
        >
          <DrawerHeader
            sx={{
              ...RIGHT_DRAWER.rightDrawerHeader,
              backgroundColor: theme.palette.primary.light,
            }}
          >
          </DrawerHeader>

          <Divider sx={{ backgroundColor: theme.palette.dark.main }} />

          {/* <List
            subheader={
              <ListSubheader component="div" sx={{ ...RIGHT_DRAWER.rightDrawerList, backgroundColor: theme.palette.dark.light, color: theme.palette.light.main }}>
                {props.isRightDrawerOpen ? 'Birthdays Today' : null}
              </ListSubheader>
            }
          >
            {birthdaysList.map((item, idx) => (
              <ListItem key={idx} disablePadding sx={RIGHT_DRAWER.rightDrawerListItem}>
                <ListItemButton
                  sx={{
                    ...RIGHT_DRAWER.rightDrawerListItemButton,
                    justifyContent: props.isRightDrawerOpen ? "initial" : "center",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      ...RIGHT_DRAWER.rightDrawerListItemIcon,
                      mr: props.isRightDrawerOpen ? 3 : "auto",
                      color: theme.palette.light.main,
                    }}
                  >
                    <CakeIcon />
                  </ListItemIcon>
                  <ListItemText primary={`${item.name} (${item.office})`} sx={{ opacity: props.isRightDrawerOpen ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List> */}

          {/* <Divider sx={{ backgroundColor: theme.palette.light.dark }} /> */}

          <List
            subheader={
              <ListSubheader component="div" sx={{ ...RIGHT_DRAWER.rightDrawerList, backgroundColor: theme.palette.dark.light, color: theme.palette.light.main }}>
                {props.isRightDrawerOpen ? 'Friend Chats' : null}
              </ListSubheader>
            }
          >
            {friendsList.map((item, idx) => (
              <ListItem key={idx} 
                disablePadding 
                onClick={(event) => onChatClick(event, item)}
                sx={RIGHT_DRAWER.rightDrawerListItem} 
              >
                <ListItemButton
                  sx={{
                    ...RIGHT_DRAWER.rightDrawerListItemButton,
                    justifyContent: props.isRightDrawerOpen ? "initial" : "center",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      ...RIGHT_DRAWER.rightDrawerListItemIcon,
                      mr: props.isRightDrawerOpen ? 3 : "auto",
                      color: theme.palette.light.main,
                    }}
                  >
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      sx={{
                        "& .MuiBadge-badge": {
                          color: item.isOnline ? "lightgreen" : "lightgray",
                          backgroundColor: item.isOnline ? "green" : "gray"
                        },
                        position: 'relative'
                      }}
                    >
                      {item.notifs?.messages?.count > 0 ? renderChatNotification(item.notifs?.messages?.count) : null}
                      <Avatar alt={item.name} src={item.image} />
                    </StyledBadge>
                  </ListItemIcon>
                  <ListItemText primary={item.name} sx={{ opacity: props.isRightDrawerOpen ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ backgroundColor: theme.palette.light.dark }} />

          <List
            subheader={
              <ListSubheader component="div" sx={{ ...RIGHT_DRAWER.rightDrawerList, backgroundColor: theme.palette.dark.light, color: theme.palette.light.main }}>
                {props.isRightDrawerOpen ? 'Group Chats' : null}
              </ListSubheader>
            }
          >
            {groupsList.map((item, idx) => (
              <ListItem key={idx} 
                disablePadding 
                onClick={(event) => onChatClick(event, item)}
                sx={RIGHT_DRAWER.rightDrawerListItem} 
              >
                <ListItemButton
                  sx={{
                    ...RIGHT_DRAWER.rightDrawerListItemButton,
                    justifyContent: props.isRightDrawerOpen ? "initial" : "center",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      ...RIGHT_DRAWER.rightDrawerListItemIcon,
                      mr: props.isRightDrawerOpen ? 3 : "auto",
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
                        },
                        position: 'relative'
                      }}
                    >
                      {item.notifs?.messages?.count > 0 ? renderChatNotification(item.notifs?.messages?.count) : null}
                      <Avatar alt="Group Avatar" src={item.image} />
                    </StyledBadge>
                  </ListItemIcon>
                  <ListItemText primary={item.name} sx={{ opacity: props.isRightDrawerOpen ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      )}
    </>
  )
}