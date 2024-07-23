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
    const [activeChatList, setActiveChatList] = useState([]);
    const [passiveChatList, setPassiveChatList] = useState([]);

    const maxActiveChatCount = 2;
    const maxPassiveChatCount = 4;

    useEffect(() => {
        fetchSession();
    }, [])

    useEffect(() => {
        setIsLoading(props.isLoading);
    }, [props.isLoading])

    useEffect(() => {
        // console.log('GlobalLayout > sessionUser', sessionUser)
        if(sessionUser.id != -1) {
            fetchFriends();
            fetchGroups();
        }
    }, [sessionUser])

    useEffect(() => {
        // console.log('GlobalLayout > sessionNav', sessionNav)
    }, [sessionNav])

    useEffect(() => {
        // console.log('GlobalLayout > sessionFriends', sessionFriends)
    }, [sessionFriends])

    useEffect(() => {
        // console.log('GlobalLayout > activeChatList', activeChatList)
    }, [activeChatList])

    useEffect(() => {
        // console.log('GlobalLayout > passiveChatList', passiveChatList)
    }, [passiveChatList])

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

    const onDrawerChatClick = (value) => {
        console.log('onDrawerChatClick > value', value)

        let aChatIdx = activeChatList.map((i) => i?.id).indexOf(value?.id);
        /** LOGIC FOR activeChatList **/
        if(value?.id != -1) {
            let activeChatArr = [...activeChatList];

            if(aChatIdx == -1) {
                activeChatArr.unshift(value);
                
                if(activeChatList.length >= maxActiveChatCount) {
                    /** LOGIC FOR passiveChatList **/
                    let passiveChatArr = [...passiveChatList].filter((i) => i.id != value?.id);
        
                    if(passiveChatList.length < maxPassiveChatCount) {
                        passiveChatArr.unshift(activeChatArr[activeChatArr.length-1]);
                    } else {
                        passiveChatArr.pop();
                        passiveChatArr.unshift(activeChatArr[activeChatArr.length-1]);
                    }
    
                    setPassiveChatList(passiveChatArr);
                    /** LOGIC FOR passiveChatList **/
    
                    activeChatArr.pop();
                }
            } else {
                aChatIdx == (activeChatArr.length-1) ? activeChatArr.reverse() : null;
            }

            setActiveChatList(activeChatArr);
        }
        /** LOGIC FOR activeChatList **/
    }

    return (
        <Box component="main" sx={GLOBAL.globalMainContainer}>
            {isLoading ? <Loader /> : null}

            <CssBaseline />

            <TopAppBar sessionUser={sessionUser} onDrawerToggleClick={onDrawerToggleClick} isLeftDrawerOpen={isLeftDrawerOpen} />

            <LeftDrawer sessionNav={sessionNav} onDrawerToggleClick={onDrawerToggleClick} isLeftDrawerOpen={isLeftDrawerOpen} />

            {props.children}

            <RightDrawer sessionFriends={sessionFriends} sessionGroups={sessionGroups} onDrawerChatClick={onDrawerChatClick} />

            <ChatList passiveChatList={passiveChatList} />

            {/* MULTIPLE INSTANCES OF CHATBOX HERE */}
            {activeChatList.map((item, idx) => (
                <ChatBox key={idx} instance={(idx + 1)} activeChatData={item} />
            ))}
            {/* MULTIPLE INSTANCES OF CHATBOX HERE */}
        </Box>
    )
}