"use client";

import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import { GLOBAL } from "@/app/styles";
import { Loader, TopAppBar, LeftDrawer, RightDrawer, ChatBox, ChatList } from '@/components';
import { getFriends, getGroups } from "@/lib/api";

export default function GlobalLayout(props) {
    const [isLoading, setIsLoading] = useState(props.isLoading);
    const [sessionUser, setSessionUser] = useState({
        id: -1,
        name: '',
        image: ''
    });
    const [sessionNav, setSessionNav] = useState('');
    const [sessionFriends, setSessionFriends] = useState([]);
    const [sessionGroups, setSessionGroups] = useState([]);
    
    const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(true);

    useEffect(() => {
        fetchSession();
    }, [])

    useEffect(() => {
        setIsLoading(props.isLoading);
    }, [props.isLoading])

    useEffect(() => {
        console.log('GlobalLayout > sessionUser', sessionUser)
        if(sessionUser.id != -1) {
            fetchFriends();
            fetchGroups();
        }
    }, [sessionUser])

    useEffect(() => {
        console.log('GlobalLayout > sessionNav', sessionNav)
    }, [sessionNav])

    useEffect(() => {
        console.log('GlobalLayout > sessionFriends', sessionFriends)
    }, [sessionFriends])

    async function fetchSession() {
        sessionStorage.getItem('authuser_data') ? setSessionUser(JSON.parse(sessionStorage.getItem('authuser_data'))) : null;
        sessionStorage.getItem('nav_data') ? setSessionNav(sessionStorage.getItem('nav_data')) : setSessionNav('Home');
    }

    async function fetchFriends() {
        await getFriends(`userId=${sessionUser.id}`).then(
            (res) => {
                console.log('fetchFriends > res', res)

                if (!sessionStorage.getItem('friends_data') && res?.data) {
                    sessionStorage.setItem('friends_data', JSON.stringify(res?.data));
                }

                let friendsArr = sessionStorage.getItem('friends_data') ? JSON.parse(sessionStorage.getItem('friends_data')) : 
                    res?.data ? res?.data : [];

                setSessionFriends(friendsArr);
            },
            (err) => {
                console.log('fetchFriends > err', err)
                setSessionFriends([]);
            },
        );
    }

    async function fetchGroups() {
        await getGroups(`userId=${sessionUser.id}`).then(
            (res) => {
                console.log('fetchGroups > res', res)

                if (!sessionStorage.getItem('groups_data') && res?.data) {
                    sessionStorage.setItem('groups_data', JSON.stringify(res?.data));
                }

                let groupsArr = sessionStorage.getItem('groups_data') ? JSON.parse(sessionStorage.getItem('groups_data')) : 
                    res?.data ? res?.data : [];

                setSessionGroups(groupsArr);
            },
            (err) => {
                console.log('fetchGroups > err', err)
                setSessionGroups([]);
            },
        );
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

            <RightDrawer sessionFriends={sessionFriends} sessionGroups={sessionGroups} />

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