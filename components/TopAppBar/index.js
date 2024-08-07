"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";

import { AppBar, Search, SearchIconWrapper, StyledInputBase } from "@/components/function";
import { TOP_APP_BAR } from '@/components/styles';
import { formatDateTime } from '@/lib/helpers';

export default function TopAppBar(props) {
    const router = useRouter();
    const theme = useTheme();

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
    const [messageMenuEl, setMessageMenuEl] = useState(null);
    const [notifsMenuEl, setNotifsMenuEl] = useState(null);

    const menuId = "topappbar-menu";
    const mobileMenuId = "topappbar-menu-mobile";

    const isMenuOpen = Boolean(menuAnchorEl);
    const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);

    useEffect(() => {
    }, []);

    useEffect(() => {
    }, [props.userData]);

    const clearSessionStorage = () => {
        sessionStorage.clear();
    }

    const clearLocalStorage = () => {
        localStorage.clear();
    }

    const onToggleClick = () => {
        if (props.onDrawerToggleClick) {
            props.onDrawerToggleClick(true);
        }
    };

    const onProfileMenuOpen = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const onMobileMenuClose = () => {
        setMobileMenuAnchorEl(null);
    };

    const onMenuClose = () => {
        setMenuAnchorEl(null);
        onMobileMenuClose();
    };

    const onMobileMenuOpen = (event) => {
        setMobileMenuAnchorEl(event.currentTarget);
    };

    const onLogoutClick = () => {
        props.onLoading ? props.onLoading(true) : null;

        onMenuClose();
        clearLocalStorage();
        clearSessionStorage();

        router.push(`/`);
        setTimeout(() => {
            props.onLoading ? props.onLoading(false) : null;
        }, 1000)
    };

    const onNotificationButtonClick = (event, origin) => {
        switch (origin) {
            case 'messages':
                setMessageMenuEl(event.target);
                break;
            case 'notifs':
                setNotifsMenuEl(event.target);
                break;
        }
    }

    const onNotificationItemClick = (event, origin, value) => {
        switch(origin) {
            case 'messages':
                if(props.onAppBarNotificationItemClick) {
                    setMenuAnchorEl(null);
                    setMobileMenuAnchorEl(null);
                    setMessageMenuEl(null);
                    setNotifsMenuEl(null);
                    
                    props.onAppBarNotificationItemClick(value);
                }
                break;
        }
    }

    const renderMenu = (
        <Menu
            anchorEl={menuAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={menuId}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={onMenuClose}
            keepMounted
        >
            <MenuItem onClick={onMenuClose}>Profile</MenuItem>
            <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
        </Menu>
    );

    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMenuAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={mobileMenuId}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={onMobileMenuClose}
            keepMounted
        >
            <MenuItem onClick={(event) => onNotificationButtonClick(event, 'messages')}>
                <IconButton
                    aria-label="topappbar-messages-mobile"
                    size="large"
                    color="inherit"
                >
                    <Badge badgeContent={props.notificationData?.messages.count} color="error">
                        <ChatIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem onClick={(event) => onNotificationButtonClick(event, 'notifs')}>
                <IconButton
                    aria-label="topappbar-notifications-mobile"
                    size="large"
                    color="inherit"
                >
                    <Badge badgeContent={props.notificationData?.notifs.count} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={onProfileMenuOpen}>
                <IconButton aria-label="topappbar-profile-mobile" size="large" aria-controls="topappbar-menu" aria-haspopup="true" color="inherit">
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <Paper
                elevation={4}
                sx={{
                    position: 'fixed',
                    height: props.appBarHeight,
                    width: '100%',
                    zIndex: 1200,
                    borderRadius: 0,
                    backgroundColor: theme.palette.primary.light,
                }}
            />
            <AppBar position="fixed" elevation={props.isMobileView ? 2 : 4} open={props.isLeftDrawerOpen} sx={{ height: props.appBarHeight, backgroundColor: theme.palette.primary.light }}>
                <Toolbar sx={TOP_APP_BAR.topAppBarToolbar}>
                    {!props.isMobileView ? (
                        <IconButton
                            aria-label="topappbar-left-drawer-toggle"
                            color="inherit"
                            onClick={onToggleClick}
                            edge="start"
                            sx={{
                                ...TOP_APP_BAR.topAppBarLeftDrawerToggle,
                                ...(props.isLeftDrawerOpen && { display: "none" }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : null}

                    {!props.isLeftDrawerOpen ? (
                        <Image
                            className="page-logo"
                            src="/images/tagbilaran-seal.png"
                            width={50}
                            height={50}
                            alt="Tagbilaran Seal"
                        />
                    ) : null}

                    <Search sx={TOP_APP_BAR.topAppBarSearch}>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ "aria-label": "search", style: TOP_APP_BAR.topAppBarSearchInput }}
                        />
                    </Search>

                    <Box sx={TOP_APP_BAR.topAppBarSpacer} />
                    <Box sx={TOP_APP_BAR.topAppBarNotifications}>
                        <IconButton
                            aria-label="topappbar-messages"
                            size="large"
                            color="inherit"
                            sx={TOP_APP_BAR.topAppBarNotificationButtons}
                            onClick={(event) => onNotificationButtonClick(event, 'messages')}
                        >
                            <Badge badgeContent={props.notificationData?.messages.count} color="error">
                                <ChatIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            aria-label="topappbar-notifications"
                            size="large"
                            color="inherit"
                            sx={TOP_APP_BAR.topAppBarNotificationButtons}
                            onClick={(event) => onNotificationButtonClick(event, 'notifs')}
                        >
                            <Badge badgeContent={props.notificationData?.notifs.count} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            aria-label="topappbar-profile"
                            size="large"
                            edge="end"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={onProfileMenuOpen}
                            color="inherit"
                            sx={TOP_APP_BAR.topAppBarAvatar}
                        >
                            <Stack direction="row" spacing={1}>
                                <Chip
                                    avatar={<Avatar alt={props.userData?.name} src={props.userData?.image} />}
                                    label={props.userData?.name}
                                    sx={{ ...TOP_APP_BAR.topAppBarAvatarChip, backgroundColor: theme.palette.secondary.main }}
                                />
                            </Stack>
                        </IconButton>
                    </Box>
                    <Box sx={TOP_APP_BAR.topAppBarMobileMenuToggle}>
                        <IconButton
                            aria-label="topappbar-show-more"
                            size="large"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={onMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {renderMobileMenu}
            {renderMenu}

            <Menu
                open={messageMenuEl ? true : false}
                anchorEl={messageMenuEl}
                onClose={() => setMessageMenuEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    color="dark"
                    sx={{px: 1.5}}
                >
                    Unread Messages
                </Typography>
                <Box>
                    <List
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: 340,
                            py: 1,
                            pl: 1,
                            pr: 2
                        }}
                    >
                        {props.notificationData?.messages?.data && props.notificationData?.messages?.data.length > 0 ? 
                        props.notificationData?.messages?.data.map((item, idx) => (
                            <ListItem 
                                key={idx}
                                disablePadding
                                onClick={(event) => onNotificationItemClick(event, 'messages', item?.chatObj)}
                                sx={{ 
                                    cursor: 'pointer', 
                                    display: 'flex',
                                    width: '100%',
                                    borderRadius: 1,
                                    "&:hover": {
                                        backgroundColor: theme.palette.light.light
                                    }, 
                                }}
                            >
                                <IconButton
                                    color="light"
                                    sx={{ width: 48, mr: 1 }}
                                >
                                    <Avatar alt={item?.chatInput?.name} src={item?.chatInput?.receiverType == 'single' ? item?.chatInput?.senderImage : item?.chatInput?.receiverImage} />
                                </IconButton>

                                <Box 
                                    className="notification-message"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                    }}
                                >
                                    <Box
                                        className="notification-message-name"
                                        sx={{
                                            fontSize: '1rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {item?.chatInput?.receiverType == 'single' ? item?.chatInput?.sender : item?.chatInput?.receiver}
                                    </Box>
                                    <Box
                                        className="notification-message-container"
                                        sx={{
                                            fontSize: '.75rem',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Box className="notification-message-text">
                                            {item?.chatInput?.receiverType == 'multiple' ? (<span style={{marginRight: 5}}>{item?.chatInput?.sender}:</span>) : null}
                                            <span>{item?.chatInput?.message}</span>
                                        </Box>
                                        <Box className="notification-message-timestamp">
                                            <span>{`${formatDateTime(item?.chatInput?.timestamp, 'MMMM DD, YYYY', { origin: 'notification-timestamp', suffix: ' ago' })}`}</span>
                                        </Box>
                                    </Box>
                                </Box>
                            </ListItem>
                        )) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <span style={{fontSize: '.85rem', fontWeight: 'bold'}}>You have no unread messages.</span>
                            </Box>
                        )}
                    </List>
                </Box>
            </Menu>

            <Menu
                open={notifsMenuEl ? true : false}
                anchorEl={notifsMenuEl}
                onClose={() => setNotifsMenuEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    color="dark"
                    sx={{px: 1.5}}
                >
                    New Notifications
                </Typography>
                <Box>
                    <List
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: 300,
                            py: 1,
                            pl: 1,
                            pr: 2
                        }}
                    >
                        {props.notificationData?.notifs?.data && props.notificationData?.notifs?.data.length > 0 ? (
                            <>
                            </>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <span style={{fontSize: '.85rem', fontWeight: 'bold'}}>You have no new notifications.</span>
                            </Box>
                        )}
                    </List>
                </Box>
            </Menu>
        </>
    )
}