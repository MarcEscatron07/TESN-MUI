"use client";

import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import { Loader, TopAppBar, LeftDrawer, RightDrawer, ChatBox, ChatList } from '@/components';
import { GLOBAL } from "@/app/styles";

export default function GlobalLayout(props) {
    const [isLoading, setIsLoading] = useState(props.isLoading);
    const [sessionUser, setSessionUser] = useState({
        id: -1,
        name: '',
        image: ''
    });
    const [sessionNav, setSessionNav] = useState('');
    
    const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(true);

    useEffect(() => {
        fetchSession();
    }, [])

    useEffect(() => {
        setIsLoading(props.isLoading);
    }, [props.isLoading])

    useEffect(() => {
        console.log('GlobalLayout > sessionUser', sessionUser)
    }, [sessionUser])

    useEffect(() => {
        console.log('GlobalLayout > sessionNav', sessionNav)
    }, [sessionNav])

    async function fetchSession() {
        sessionStorage.getItem('authuser_data') ? setSessionUser(JSON.parse(sessionStorage.getItem('authuser_data'))) : null;
        sessionStorage.getItem('nav_data') ? setSessionNav(sessionStorage.getItem('nav_data')) : null;
    }

    const onDrawerToggleClick = (value) => {
        setIsLeftDrawerOpen(value);
    }

    return (
        <Box component="main" sx={GLOBAL.globalMainContainer}>
            {isLoading ? <Loader /> : null}

            <CssBaseline />

            <TopAppBar sessionUser={sessionUser} onDrawerToggleClick={onDrawerToggleClick} isLeftDrawerOpen={isLeftDrawerOpen} />

            <LeftDrawer sessionNav={sessionNav} onDrawerToggleClick={onDrawerToggleClick} isLeftDrawerOpen={isLeftDrawerOpen} />

            {props.children}

            <RightDrawer />

            {/* <ChatList /> */}

            {/* MULTIPLE INSTANCES OF CHATBOX HERE */}

            {/* <ChatBox instance={1} />
            <ChatBox instance={2} /> */}
            {/* <ChatBox instance={3} />
            <ChatBox instance={4} /> */}

            {/* MULTIPLE INSTANCES OF CHATBOX HERE */}
        </Box>
    )
}