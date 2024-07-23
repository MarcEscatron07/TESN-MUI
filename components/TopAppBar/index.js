"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";

import { AppBar, Search, SearchIconWrapper, StyledInputBase } from "@/components/function";
import { TOP_APP_BAR } from '@/components/styles';

export default function TopAppBar(props) {
    const router = useRouter();
    const theme = useTheme();

    const [sesUser, setSesUser] = useState({
        id: -1,
        name: '',
        image: ''
    });
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

    const menuId = "topappbar-menu";
    const mobileMenuId = "topappbar-menu-mobile";

    const isMenuOpen = Boolean(menuAnchorEl);
    const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);

    useEffect(() => {
    }, []);

    useEffect(() => {
        setSesUser(props.sessionUser);
    }, [props.sessionUser]);

    useEffect(() => {
    }, [sesUser]);

    const clearSession = () => {
        sessionStorage.clear();
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
        onMenuClose();
        clearSession();
        router.push(`/`);
    };

    const renderMenu = (
        <Menu
            anchorEl={menuAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={onMenuClose}
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
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={onMobileMenuClose}
        >
            <MenuItem>
                <IconButton aria-label="topappbar-messages-mobile" size="large" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <ChatIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton aria-label="topappbar-notifications-mobile" size="large" color="inherit">
                    <Badge badgeContent={17} color="error">
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
            <AppBar position="fixed" open={props.isLeftDrawerOpen} sx={{ backgroundColor: theme.palette.primary.light }}>
                <Toolbar>
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

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={TOP_APP_BAR.topAppBarNotifications}>
                        <IconButton
                            aria-label="topappbar-messages"
                            size="large"
                            color="inherit"
                            sx={TOP_APP_BAR.topAppBarNotificationButtons}
                        >
                            <Badge badgeContent={4} color="error">
                                <ChatIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            aria-label="topappbar-notifications"
                            size="large"
                            color="inherit"
                            sx={TOP_APP_BAR.topAppBarNotificationButtons}
                        >
                            <Badge badgeContent={17} color="error">
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
                                    avatar={<Avatar alt={sesUser.name} src={sesUser.image} />}
                                    label={sesUser.name}
                                    sx={{...TOP_APP_BAR.topAppBarAvatarChip, backgroundColor: theme.palette.secondary.main}}
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
        </>
    )
}