"use client";

import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import { GLOBAL } from "@/app/styles";
import { Loader, TopAppBar, LeftDrawer, RightDrawer, ChatBox, ChatList } from '@/components';
import { getFriends, getGroups, getThread, postThread } from "@/lib/api";

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

    const [activeThreadList, setActiveThreadList] = useState([]);

    const maxActiveChatCount = 2;
    const maxPassiveChatCount = 4;

    useEffect(() => {
        fetchSession();
    }, [])

    useEffect(() => {
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

    useEffect(() => {
        // console.log('GlobalLayout > activeChatList', activeChatList)

        if(activeChatList.length > 0) {
            getChatThread(activeChatList);
        }
    }, [activeChatList])

    useEffect(() => {
        // console.log('GlobalLayout > activeThreadList', activeThreadList)
    }, [activeThreadList])

    useEffect(() => {
        // console.log('GlobalLayout > activeThreadList', activeThreadList)

        setIsLoading(props.isLoading);
    }, [props.isLoading, activeThreadList])

    async function fetchSession() {
        sessionStorage.getItem('authuser_data') ? setSessionUser(JSON.parse(sessionStorage.getItem('authuser_data'))) : setSessionUser({
            id: -1,
            name: '',
            image: ''
        });
        sessionStorage.getItem('nav_data') ? setSessionNav(sessionStorage.getItem('nav_data')) : setSessionNav('Home');
        sessionStorage.getItem('active_chat_data') ? setActiveChatList(JSON.parse(sessionStorage.getItem('active_chat_data'))) : setActiveChatList([]);
        sessionStorage.getItem('passive_chat_data') ? setPassiveChatList(JSON.parse(sessionStorage.getItem('passive_chat_data'))) : setPassiveChatList([]);
    }

    async function fetchFriends() {
        if(sessionStorage.getItem('friends_data')) {
            setSessionFriends(JSON.parse(sessionStorage.getItem('friends_data')));
        } else {
            await getFriends(`userId=${sessionUser.id}`).then(
                (res) => {
                    console.log('fetchFriends > res', res)
    
                    res?.status == 200 && res?.data ? sessionStorage.setItem('friends_data', JSON.stringify(res?.data)) : null;
                    setSessionFriends(res?.status == 200 && res?.data ? res?.data : []);
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
    
                    res?.status == 200 && res?.data ? sessionStorage.setItem('groups_data', JSON.stringify(res?.data)) : null;
                    setSessionGroups(res?.status == 200 && res?.data ? res?.data : []);
                },
                (err) => {
                    console.log('fetchGroups > err', err)
                    setSessionGroups([]);
                },
            );
        }
    }

    async function getChatThread(array) {
        const promisesList = array.map((item) => getThread(`userId=${sessionUser.id}&chatId=${item.id}&chatType=${item.type}`));
        const promisesResList = await Promise.all(promisesList);
        // console.log('getChatThread > promisesResList', promisesResList)

        setActiveThreadList(promisesResList.map((item) => item?.data ?? []));
    }

    async function postChatThread(formData, callback) {
        console.log('postChatThread > formData', formData)

        await postThread(formData).then(
            (res) => {
                console.log('GlobalLayout > postChatThread > res', res)
            },
            (err) => {
                console.log('GlobalLayout > postChatThread > err', err)
            },
        );

        callback ? callback() : null;
    }

    const onDrawerToggleClick = (value) => {
        setIsLeftDrawerOpen(value);
    }

    const onRemoveChatClick = (value, origin) => {
        let activeChatArr = activeChatList;
        let passiveChatArr = passiveChatList;

        switch(origin) {
            case 'chat-list':
                let pChatIdx = passiveChatList.map((i) => i.id).indexOf(value?.id ?? -1);
                passiveChatArr = [...passiveChatList].filter((_, idx) => idx != pChatIdx);

                sessionStorage.setItem('passive_chat_data', JSON.stringify(passiveChatArr));
                setPassiveChatList(passiveChatArr);
                break;
            case 'chat-box':
                let aChatIdx = activeChatList.map((i) => i.id).indexOf(value?.id ?? -1);
                activeChatArr = [...activeChatList].filter((_, idx) => idx != aChatIdx);
                
                passiveChatArr[0] ? activeChatArr = [...activeChatArr, passiveChatArr[0]] : null;
                sessionStorage.setItem('active_chat_data', JSON.stringify(activeChatArr));
                setActiveChatList(activeChatArr);

                passiveChatArr[0] ? passiveChatArr.shift() : null;
                sessionStorage.setItem('passive_chat_data', JSON.stringify(passiveChatArr));
                setPassiveChatList(passiveChatArr);
                break;
        }
    }

    const onCloseAllChatsClick = () => {
        let activeChatArr = [];
        let passiveChatArr = [];

        sessionStorage.setItem('active_chat_data', JSON.stringify(activeChatArr));
        setActiveChatList(activeChatArr);

        sessionStorage.setItem('passive_chat_data', JSON.stringify(passiveChatArr));
        setPassiveChatList(passiveChatArr);
    }

    const onMinimizeOpenChatsClick = () => {
        let activeChatArr = [];
        let passiveChatArr = [...activeChatList, ...passiveChatList];

        sessionStorage.setItem('active_chat_data', JSON.stringify(activeChatArr));
        setActiveChatList(activeChatArr);

        sessionStorage.setItem('passive_chat_data', JSON.stringify(passiveChatArr));
        setPassiveChatList(passiveChatArr);
    }

    const onMinimizeChatClick = (value) => {
        let activeChatArr = activeChatList;
        let passiveChatArr = passiveChatList;

        let aChatIdx = activeChatList.map((i) => i.id).indexOf(value?.id ?? -1);

        passiveChatArr.unshift(activeChatList[aChatIdx]);
        sessionStorage.setItem('passive_chat_data', JSON.stringify(passiveChatArr));
        setPassiveChatList(passiveChatArr);

        activeChatArr = [...activeChatList].filter((_, idx) => idx != aChatIdx);
        sessionStorage.setItem('active_chat_data', JSON.stringify(activeChatArr));
        setActiveChatList(activeChatArr);
    }

    const onSendChatInputClick = (chatObj, chatInput) => {
        const formData = new FormData();
        formData.append('userId', sessionUser.id);
        formData.append('chatId', chatObj?.id);
        formData.append('chatType', chatObj?.type);
        formData.append('chatInput', JSON.stringify(chatInput));
        
        postChatThread(formData, () => getChatThread(activeChatList));
    }

    const onSelectedChatClick = (value) => {
        // console.log('onSelectedChatClick > value', value)
        
        /** ACTIVE CHAT LIST LOGIC **/
        let aChatIdx = activeChatList.map((i) => i.id).indexOf(value?.id ?? -1);
        let activeChatArr = [...activeChatList];

        if(aChatIdx == -1) {
            activeChatArr.unshift(value);
            
            /** PASSIVE CHAT LIST LOGIC **/
            let pChatIdx = passiveChatList.map((i) => i.id).indexOf(value?.id ?? -1);
            let passiveChatArr = [...passiveChatList].filter((_, idx) => idx != pChatIdx);

            if(activeChatList.length >= maxActiveChatCount) {
                passiveChatArr.unshift(activeChatArr[activeChatArr.length-1]);
            }

            if(passiveChatList.length >= maxPassiveChatCount) {
                pChatIdx == -1 ? passiveChatArr.pop() : null;
            }

            sessionStorage.setItem('passive_chat_data', JSON.stringify(passiveChatArr));
            setPassiveChatList(passiveChatArr);
            /** PASSIVE CHAT LIST LOGIC **/

            if(activeChatList.length >= maxActiveChatCount) {
                activeChatArr.pop();
            }
        } else {
            // aChatIdx == (activeChatArr.length-1) ? activeChatArr.reverse() : null;
        }

        sessionStorage.setItem('active_chat_data', JSON.stringify(activeChatArr));
        setActiveChatList(activeChatArr);
        /** ACTIVE CHAT LIST LOGIC **/
    }

    return (
        <Box component="main" sx={GLOBAL.globalMainContainer}>
            {isLoading ? <Loader /> : null}

            <CssBaseline />

            <TopAppBar sessionUser={sessionUser} onDrawerToggleClick={onDrawerToggleClick} isLeftDrawerOpen={isLeftDrawerOpen} />

            <LeftDrawer sessionNav={sessionNav} onDrawerToggleClick={onDrawerToggleClick} isLeftDrawerOpen={isLeftDrawerOpen} />

            {props.children}

            <RightDrawer sessionFriends={sessionFriends} sessionGroups={sessionGroups} onDrawerChatClick={onSelectedChatClick} />

            <ChatList 
                passiveChatList={passiveChatList} 
                onListChatClick={onSelectedChatClick} 
                onChatListRemoveClick={(value) => onRemoveChatClick(value, 'chat-list')}
                onChatListCloseClick={onCloseAllChatsClick}
                onChatListMinimizeClick={onMinimizeOpenChatsClick}
            />

            {activeChatList.map((item, idx) => (
                <ChatBox 
                    key={idx} 
                    instance={(idx + 1)}
                    sessionUser={sessionUser}
                    activeChatData={item} 
                    activeThreadData={activeThreadList[idx] ?? []}
                    onChatBoxCloseClick={(value) => onRemoveChatClick(value, 'chat-box')} 
                    onChatBoxMinimizeClick={onMinimizeChatClick}
                    onChatBoxSendInput={onSendChatInputClick}
                />
            ))}
        </Box>
    )
}