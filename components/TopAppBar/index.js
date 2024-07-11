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
    const theme = useTheme();
    const router = useRouter();

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

    const menuId = "topappbar-menu";
    const mobileMenuId = "topappbar-menu-mobile";

    const isMenuOpen = Boolean(menuAnchorEl);
    const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);

    useEffect(() => { }, []);

    const handleOpenDrawerClick = () => {
        if (props.onDrawerToggleClick) {
            props.onDrawerToggleClick(true);
        }
    };

    const handleProfileMenuOpen = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuAnchorEl(null);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMenuAnchorEl(event.currentTarget);
    };

    const handleLogoutClick = () => {
        handleMenuClose();
        router.push("/");
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
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
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
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new chat messages" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <ChatIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="topappbar-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
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
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleOpenDrawerClick}
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
                            size="large"
                            aria-label="show 4 new chat messages"
                            color="inherit"
                            sx={TOP_APP_BAR.topAppBarNotificationButtons}
                        >
                            <Badge badgeContent={4} color="error">
                                <ChatIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                            sx={TOP_APP_BAR.topAppBarNotificationButtons}
                        >
                            <Badge badgeContent={17} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                            sx={TOP_APP_BAR.topAppBarAvatar}
                        >
                            <Stack direction="row" spacing={1}>
                                <Chip
                                    avatar={<Avatar alt="User" src="/images/avatars/avatar_default.png" />}
                                    label="Marc Escatron"
                                    sx={{...TOP_APP_BAR.topAppBarAvatarChip, backgroundColor: theme.palette.secondary.main}}
                                />
                            </Stack>
                        </IconButton>
                    </Box>
                    <Box sx={TOP_APP_BAR.topAppBarMobileMenuToggle}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
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