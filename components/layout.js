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
    // const [activeChatList, setActiveChatList] = useState([]); //TODO
    // const [passiveChatList, setPassiveChatList] = useState([]); //TODO

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
        sessionStorage.getItem('authuser_data') ? setSessionUser(JSON.parse(sessionStorage.getItem('authuser_data'))) : setSessionUser({
            id: -1,
            name: '',
            image: ''
        });
        sessionStorage.getItem('nav_data') ? setSessionNav(sessionStorage.getItem('nav_data')) : setSessionNav('Home');
    }

    async function fetchFriends() {
        if(sessionStorage.getItem('friends_data')) {
            setSessionFriends(JSON.parse(sessionStorage.getItem('friends_data')));
        } else {
            await getFriends(`userId=${sessionUser.id}`).then(
                (res) => {
                    console.log('fetchFriends > res', res)
    
                    res?.data ? sessionStorage.setItem('friends_data', JSON.stringify(res?.data)) : null;
                    setSessionFriends(res?.data ? res?.data : []);
                },
                (err) => {
                    console.log('fetchFriends > err', err)
                    setSessionFriends([]);
                },
            );
        }
    }

    async function fetchGroups() {
        if(sessionStorage.getItem('groups_data')) {
            setSessionGroups(JSON.parse(sessionStorage.getItem('groups_data')));
        } else {
            await getGroups(`userId=${sessionUser.id}`).then(
                (res) => {
                    console.log('fetchGroups > res', res)
    
                    res?.data ? sessionStorage.setItem('groups_data', JSON.stringify(res?.data)) : null;
                    setSessionGroups(res?.data ? res?.data : []);
                },
                (err) => {
                    console.log('fetchGroups > err', err)
                    setSessionGroups([]);
                },
            );
        }
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
            {/* <ChatBox instance={3} /> */}
            {/* <ChatBox instance={4} /> */}

            {/* MULTIPLE INSTANCES OF CHATBOX HERE */}
        </Box>
    )
}