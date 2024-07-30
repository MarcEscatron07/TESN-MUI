"use client";

import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import { GLOBAL } from "@/app/styles";
import { Loader, TopAppBar, LeftDrawer, RightDrawer, ChatBox, ChatList, ViewAttachment } from '@/components';
import { socket } from '@/components/socket-client';
import { getChats, getThread, postThread, postAttachments } from "@/lib/api";

export default function GlobalLayout(props) {
    const viewBreakpoint = 992;
    const maxActiveChatCnt = 2;
    const maxPassiveChatCnt = 6
    const appBarHeight = 65;
    const menuBarHeight = 55;

    const [isLoading, setIsLoading] = useState(props.isLoading);
    const [sessionUser, setSessionUser] = useState({
        id: -1,
        name: '',
        image: ''
    });
    const [sessionNav, setSessionNav] = useState('');
    const [sessionFriends, setSessionFriends] = useState([]);
    const [sessionGroups, setSessionGroups] = useState([]);
    
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < viewBreakpoint ? true : false);
    const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(true);
    const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(true);
    const [isRightDrawerMobileOpen, setIsRightDrawerMobileOpen] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);
    const [activeChatList, setActiveChatList] = useState([]);
    const [passiveChatList, setPassiveChatList] = useState([]);
    const [activeThreadList, setActiveThreadList] = useState([]);
    const [fileAttachment, setFileAttachment] = useState(null);

    const [maxActiveChatCount, setMaxActiveChatCount] = useState(maxActiveChatCnt);
    const [maxPassiveChatCount, setMaxPassiveChatCount] = useState(maxPassiveChatCnt);

    useEffect(() => {
        checkWindowWidth();

        window.addEventListener('resize', checkWindowWidth)

        socket.on('clients_list', (clientsList) => {
            console.log('GlobalLayout > clientsList', clientsList)
        });

        socket.on('groups_list', (groupsList) => {
            console.log('GlobalLayout > groupsList', groupsList)
        });

        fetchSessionStorage();

        return () => {
            window.removeEventListener('resize', checkWindowWidth)
        }
    }, [])

    useEffect(() => {
    }, [props.isLoading])

    useEffect(() => {
        // console.log('GlobalLayout > sessionUser', sessionUser)

        if(sessionUser.id != -1) {
            socket.emit('register_client', sessionUser.name);

            fetchChats();
        }
    }, [sessionUser])

    useEffect(() => {
        // console.log('GlobalLayout > sessionNav', sessionNav)
    }, [sessionNav])

    useEffect(() => {
        // console.log('GlobalLayout > sessionFriends', sessionFriends)
    }, [sessionFriends])

    useEffect(() => {
        // console.log('GlobalLayout > sessionGroups', sessionGroups)
    }, [sessionGroups])
    
    useEffect(() => {
        console.log('GlobalLayout > sessionGroups', sessionGroups)
        console.log('GlobalLayout > sessionUser', sessionUser)

        if(sessionGroups.length > 0) {
            socket.emit('register_group', { groups: sessionGroups, clientName: sessionUser.name })
        }
    }, [sessionGroups, sessionUser])

    useEffect(() => {
        // console.log('GlobalLayout > isMobileView', isMobileView)

        if(isMobileView) {
            setMaxActiveChatCount(maxActiveChatCnt-1);
            setMaxPassiveChatCount(maxPassiveChatCnt+1);

            let activeChatArr = [...activeChatList];
            /** PASSIVE CHAT LIST LOGIC **/
            let pChatIdx = passiveChatList.map((i) => i.id).indexOf(activeChatArr[activeChatArr.length-1] ?? -1);
            let passiveChatArr = [...passiveChatList].filter((_, idx) => idx != pChatIdx);

            if(activeChatArr.length > (maxActiveChatCnt-1)) {
                passiveChatArr.unshift(activeChatArr[activeChatArr.length-1]);
            }

            if(passiveChatArr.length > (maxPassiveChatCnt+1)) {
                pChatIdx == -1 ? passiveChatArr.pop() : null;
            }

            sessionStorage.setItem('passive_chat_data', JSON.stringify(passiveChatArr));
            setPassiveChatList(passiveChatArr);
            /** PASSIVE CHAT LIST LOGIC **/

            if(activeChatArr.length > (maxActiveChatCnt-1)) {
                activeChatArr.pop();
            }
            sessionStorage.setItem('active_chat_data', JSON.stringify(activeChatArr));
            setActiveChatList(activeChatArr);
            /** ACTIVE CHAT LIST LOGIC **/

            setIsLeftDrawerOpen(false);
            setIsRightDrawerOpen(false);
        } else {
            setMaxActiveChatCount(maxActiveChatCnt);
            setMaxPassiveChatCount(maxPassiveChatCnt);

            setIsLeftDrawerOpen(true);
            setIsRightDrawerOpen(true);
        }

        if(props.onMobileView){
            props.onMobileView(isMobileView);
        }
    }, [isMobileView])

    useEffect(() => {
        // console.log('GlobalLayout > selectedChat', selectedChat)
    }, [selectedChat])

    useEffect(() => {
        // console.log('GlobalLayout > passiveChatList', passiveChatList)
    }, [passiveChatList])

    useEffect(() => {
        // console.log('GlobalLayout > activeThreadList', activeThreadList)
    }, [activeThreadList])

    useEffect(() => {
        // console.log('GlobalLayout > socket', socket)

        activeChatList.length > 0 ? getChatThread(sessionUser.id, activeChatList) : null; // on system init

        socket.on('receive_message', ({senderName, receiverName}) => {
            console.log('GlobalLayout > receive_message > senderName', senderName)
            console.log('GlobalLayout > receive_message > receiverName', receiverName)

            activeChatList.length > 0 ? getChatThread(sessionUser.id, activeChatList) : null; // on realtime chat
        });
    }, [sessionUser, activeChatList])

    useEffect(() => {
        setIsLoading(props.isLoading);
    }, [props.isLoading, activeThreadList])

    useEffect(() => {
        // console.log('GlobalLayout > maxActiveChatCount', maxActiveChatCount)
    }, [maxActiveChatCount])

    useEffect(() => {
        // console.log('GlobalLayout > maxPassiveChatCount', maxPassiveChatCount)
    }, [maxPassiveChatCount])

    function checkWindowWidth() {
        setIsMobileView(window.innerWidth < viewBreakpoint ? true : false);
    }

    async function fetchSessionStorage() {
        sessionStorage.getItem('authuser_data') ? setSessionUser(JSON.parse(sessionStorage.getItem('authuser_data'))) : setSessionUser({
            id: -1,
            name: '',
            image: ''
        });
        sessionStorage.getItem('nav_data') ? setSessionNav(sessionStorage.getItem('nav_data')) : setSessionNav('Home');
        sessionStorage.getItem('active_chat_data') ? setActiveChatList(JSON.parse(sessionStorage.getItem('active_chat_data'))) : setActiveChatList([]);
        sessionStorage.getItem('passive_chat_data') ? setPassiveChatList(JSON.parse(sessionStorage.getItem('passive_chat_data'))) : setPassiveChatList([]);
    }

    async function fetchChats() {
        if(sessionStorage.getItem('chats_data')) {
            const chatsObj = JSON.parse(sessionStorage.getItem('chats_data'));

            setSessionFriends(chatsObj?.friends ?? []);
            setSessionGroups(chatsObj?.groups ?? []);
        } else {
            await getChats(`userId=${sessionUser.id}`).then(
                (res) => {
                    // console.log('fetchChats > res', res)
    
                    res?.status == 200 && res?.data ? sessionStorage.setItem('chats_data', JSON.stringify(res?.data)) : null;
                    setSessionFriends(res?.status == 200 && res?.data?.friends ? res?.data?.friends : []);
                    setSessionGroups(res?.status == 200 && res?.data?.groups ? res?.data?.groups : []);
                },
                (err) => {
                    console.log('fetchChats > err', err)
                    setSessionFriends([]);
                    setSessionGroups([]);
                },
            );
        }
    }

    async function getChatThread(userId, data) {
        console.log('getChatThread > userId', userId)
        console.log('getChatThread > data', data)

        const promisesList = data.map((item) => getThread(`userId=${userId}&chatId=${item.id}&chatType=${item.type}`));
        const promisesResList = await Promise.all(promisesList);
        // console.log('getChatThread > multiple > res', promisesResList)

        setActiveThreadList(promisesResList.map((item) => item?.data ?? {}));
    }

    async function postChatThread(formData, chatObj, callback) {
        await postThread(formData).then(
            (res) => {
                // console.log('GlobalLayout > postChatThread > res', res)

                socket.emit('send_message', { receiverName: chatObj?.name });
            },
            (err) => {
                console.log('GlobalLayout > postChatThread > err', err)
            },
        );

        callback ? callback() : null;
    }

    async function postChatAttachments(formData, callback) {
        // console.log('postChatAttachments > formData', formData)

        let attachmentsArr = null;

        await postAttachments(formData).then(
            (res) => {
                // console.log('GlobalLayout > postChatAttachments > res', res)

                res?.data ? attachmentsArr = res?.data : null;
            },
            (err) => {
                console.log('GlobalLayout > postChatAttachments > err', err)
            },
        )

        callback ? callback(attachmentsArr) : null;
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

    const onSendChatInputClick = (chatObj, chatInput, attachmentsList) => {
        const formData = new FormData();
        formData.append('userId', sessionUser.id);
        formData.append('chatId', chatObj?.id);
        formData.append('chatName', chatObj?.name);
        formData.append('chatType', chatObj?.type);

        if(attachmentsList && attachmentsList.length > 0) {
            formData.append('userName', sessionUser.name);
            Array.from(attachmentsList).forEach((item) => {
                formData.append('attachments', item);
            })
            
            postChatAttachments(formData, (attachments) => {
                chatInput ? chatInput.attachments = attachments : null;
                formData.append('chatInput', JSON.stringify(chatInput));
                postChatThread(formData, chatObj);
            })
        } else {
            formData.append('chatInput', JSON.stringify(chatInput));
            postChatThread(formData, chatObj);
        }
    }

    const onViewChatAttachmentClick = (value) => {
        setFileAttachment(value);
    }

    const onCloseChatAttachmentClick = () => {
        setFileAttachment(null);
      }

    const onSelectedChatClick = (value) => {
        // console.log('onSelectedChatClick > value', value)
        setSelectedChat(value);
        
        /** ACTIVE CHAT LIST LOGIC **/
        let aChatIdx = activeChatList.map((i) => i.id).indexOf(value?.id ?? -1);
        let activeChatArr = [...activeChatList];

        if(aChatIdx == -1) {
            activeChatArr.unshift(value);
            
            /** PASSIVE CHAT LIST LOGIC **/
            let pChatIdx = passiveChatList.map((i) => i.id).indexOf(value?.id ?? -1);
            let passiveChatArr = [...passiveChatList].filter((_, idx) => idx != pChatIdx);

            if(activeChatArr.length > maxActiveChatCount) {
                passiveChatArr.unshift(activeChatArr[activeChatArr.length-1]);
            }

            if(passiveChatArr.length > maxPassiveChatCount) {
                pChatIdx == -1 ? passiveChatArr.pop() : null;
            }

            sessionStorage.setItem('passive_chat_data', JSON.stringify(passiveChatArr));
            setPassiveChatList(passiveChatArr);
            /** PASSIVE CHAT LIST LOGIC **/

            if(activeChatArr.length > maxActiveChatCount) {
                activeChatArr.pop();
            }
            sessionStorage.setItem('active_chat_data', JSON.stringify(activeChatArr));
            setActiveChatList(activeChatArr);
            /** ACTIVE CHAT LIST LOGIC **/
        }
    }

    const onMobileRightDrawerClick = (value) => {
        setIsRightDrawerMobileOpen(value);
    }

    return (
        <Box component="main" sx={GLOBAL.globalMainContainer}>
            {isLoading ? <Loader /> : null}
            {fileAttachment ? <ViewAttachment fileAttachment={fileAttachment} onCloseViewAttachment={onCloseChatAttachmentClick} /> : null}

            <CssBaseline />

            <TopAppBar 
                appBarHeight={appBarHeight} 
                isMobileView={isMobileView} 
                sessionUser={sessionUser} 
                isLeftDrawerOpen={isLeftDrawerOpen} 
                onDrawerToggleClick={onDrawerToggleClick} 
            />

            <LeftDrawer 
                appBarHeight={appBarHeight} 
                menuBarHeight={menuBarHeight} 
                isMobileView={isMobileView} 
                sessionNav={sessionNav} 
                isLeftDrawerOpen={isLeftDrawerOpen} 
                onDrawerToggleClick={onDrawerToggleClick} 
            />

            <Box sx={{paddingTop: isMobileView ? '55px' : 'unset'}}>
                {props.children}
            </Box>

            <RightDrawer 
                menuBarHeight={menuBarHeight} 
                isMobileView={isMobileView} 
                sessionFriends={sessionFriends} 
                sessionGroups={sessionGroups} 
                isRightDrawerOpen={isRightDrawerOpen} 
                isRightDrawerMobileOpen={isRightDrawerMobileOpen}
                onMobileDrawerToggleClick={onMobileRightDrawerClick} 
                onDrawerChatClick={onSelectedChatClick} 
            />

            <ChatList 
                isMobileView={isMobileView}
                isRightDrawerMobileOpen={isRightDrawerMobileOpen}
                passiveChatList={passiveChatList} 
                activeChatList={activeChatList} 
                onListChatClick={onSelectedChatClick} 
                onChatListRemoveClick={(value) => onRemoveChatClick(value, 'chat-list')}
                onChatListCloseClick={onCloseAllChatsClick}
                onChatListMinimizeClick={onMinimizeOpenChatsClick}
            />

            {activeChatList.map((item, idx) => (
                <ChatBox 
                    key={idx} 
                    isMobileView={isMobileView}
                    isRightDrawerMobileOpen={isRightDrawerMobileOpen}
                    instance={(idx + 1)}
                    sessionUser={sessionUser}
                    selectedChat={selectedChat}
                    activeChatData={item} 
                    activeThreadData={activeThreadList}
                    onChatBoxCloseClick={(value) => onRemoveChatClick(value, 'chat-box')} 
                    onChatBoxMinimizeClick={onMinimizeChatClick}
                    onChatBoxSendInput={onSendChatInputClick}
                    onChatBoxViewAttachment={onViewChatAttachmentClick}
                    onResetSelectedChat={() => setSelectedChat(null)}
                    onResetChatThread={() => getChatThread(sessionUser.id, activeChatList)}
                />
            ))}
        </Box>
    )
}