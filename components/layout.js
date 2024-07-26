"use client";

import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import { GLOBAL } from "@/app/styles";
import { Loader, TopAppBar, LeftDrawer, RightDrawer, ChatBox, ChatList, ViewAttachment } from '@/components';
import { getFriends, getGroups, getThread, postThread, postAttachments } from "@/lib/api";

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
    const [selectedChat, setSelectedChat] = useState(null);
    const [activeChatList, setActiveChatList] = useState([]);
    const [passiveChatList, setPassiveChatList] = useState([]);
    const [activeThreadList, setActiveThreadList] = useState([]);
    const [fileAttachment, setFileAttachment] = useState(null);

    const [fetchInterval, setFetchInterval] = useState(null);

    const maxActiveChatCount = 3;
    const maxPassiveChatCount = 5;

    useEffect(() => {
        fetchSessionStorage();
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
        // console.log('GlobalLayout > selectedChat', selectedChat)
    }, [selectedChat])

    useEffect(() => {
        // console.log('GlobalLayout > passiveChatList', passiveChatList)
    }, [passiveChatList])

    useEffect(() => {
        // console.log('GlobalLayout > activeThreadList', activeThreadList)
    }, [activeThreadList])

    useEffect(() => {
        // console.log('GlobalLayout > activeChatList', activeChatList)

        if(activeChatList.length > 0) {
            fetchInterval ? clearInterval(fetchInterval) : null;
            setFetchInterval(
                setInterval(() => {
                    getChatThread('multiple', sessionUser.id, activeChatList);
                }, 500)
            )
        }
    }, [sessionUser, activeChatList])

    useEffect(() => {
        setIsLoading(props.isLoading);
    }, [props.isLoading, activeThreadList])

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

    async function getChatThread(type, userId, data) {
        switch(type) {
            case 'multiple':
                const promisesList = data.map((item) => getThread(`userId=${userId}&chatId=${item.id}&chatType=${item.type}`));
                const promisesResList = await Promise.all(promisesList);
                // console.log('getChatThread > activeChatList > promisesResList', promisesResList)
        
                setActiveThreadList(promisesResList.map((item) => item?.data ?? {}));
                break;
            case 'single':
                await getThread(`userId=${userId}&chatId=${data.id}&chatType=${data.type}`).then(
                    (res) => {
                        // console.log('getChatThread > postChatThread > res', res)
                        
                        setActiveThreadList(activeThreadList.map((item) => {
                            if(item && item['threads'] && item['chatId'] == res?.data?.chatId) {
                                item['threads'] = res?.data?.threads ?? [];
                            }

                            return item;
                        }))
                    },
                    (err) => {
                        console.log('getChatThread > postChatThread > err', err)
                    },
                )
                break;
        }
    }

    async function postChatThread(formData, callback) {
        // console.log('postChatThread > formData', formData)

        await postThread(formData).then(
            (res) => {
                // console.log('GlobalLayout > postChatThread > res', res)
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
                console.log('GlobalLayout > postChatAttachments > res', res)

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
        formData.append('chatType', chatObj?.type);

        if(attachmentsList) {
            formData.append('userName', sessionUser.name);
            Array.from(attachmentsList).forEach((item) => {
                formData.append('attachments', item);
            })
            
            postChatAttachments(formData, (attachments) => {
                chatInput ? chatInput.attachments = attachments : null;
                formData.append('chatInput', JSON.stringify(chatInput));
                postChatThread(formData, () => getChatThread('multiple', sessionUser.id, activeChatList));
            })
        } else {
            formData.append('chatInput', JSON.stringify(chatInput));
            postChatThread(formData, () => getChatThread('multiple', sessionUser.id, activeChatList));
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
            sessionStorage.setItem('active_chat_data', JSON.stringify(activeChatArr));
            setActiveChatList(activeChatArr);
            /** ACTIVE CHAT LIST LOGIC **/
        }
    }

    return (
        <Box component="main" sx={GLOBAL.globalMainContainer}>
            {isLoading ? <Loader /> : null}
            {fileAttachment ? <ViewAttachment fileAttachment={fileAttachment} onCloseViewAttachment={onCloseChatAttachmentClick} /> : null}

            <CssBaseline />

            <TopAppBar sessionUser={sessionUser} onDrawerToggleClick={onDrawerToggleClick} isLeftDrawerOpen={isLeftDrawerOpen} />

            <LeftDrawer sessionNav={sessionNav} onDrawerToggleClick={onDrawerToggleClick} isLeftDrawerOpen={isLeftDrawerOpen} />

            {props.children}

            <RightDrawer sessionFriends={sessionFriends} sessionGroups={sessionGroups} onDrawerChatClick={onSelectedChatClick} />

            <ChatList 
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
                    onResetChatThread={getChatThread}
                />
            ))}
        </Box>
    )
}