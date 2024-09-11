"use client";

import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import { GLOBAL } from "@/app/styles";
import { Loader, TopAppBar, LeftDrawer, RightDrawer, ChatBox, ChatList, ViewAttachment } from '@/components';
import { socket } from '@/components/socket-client';
import { getUsers, getChats, getThreads, postThreads, patchThreads, postAttachments, getNotifications, postNotifications, patchNotifications } from "@/lib/api";

export default function GlobalLayout(props) {
    const viewBreakpoint = 992;
    const maxActiveChatCnt = 2;
    const maxPassiveChatCnt = 6
    const appBarHeight = 65;
    const menuBarHeight = 55;
    
    const [isLayoutLoading, setIsLayoutLoading] = useState(props.isLoading);
    const [userData, setUserData] = useState({
        id: -1,
        name: '',
        image: ''
    });
    const [notificationData, setNotificationData] = useState({
        messages: {
            count: 0,
            data: []
        },
        notifs: {
            count: 0,
            data: []
        }
    });

    const [sessionUserId, setSessionUserId] = useState(-1);
    const [sessionNav, setSessionNav] = useState('');
    const [sessionFriends, setSessionFriends] = useState([]);
    const [sessionGroups, setSessionGroups] = useState([]);

    const [isMobileView, setIsMobileView] = useState(window.innerWidth < viewBreakpoint ? true : false);
    const [isMobilePortrait, setIsMobilePortrait] = useState(window.matchMedia("(orientation: portrait)").matches ? true : false);
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
        checkMobileView();
        checkMobileOrientation(window.matchMedia("(orientation: portrait)").matches);

        window.addEventListener('resize', checkMobileView);
        window.matchMedia("(orientation: portrait)").addEventListener("change", (event) => checkMobileOrientation(event.matches));

        socket.on('clients_list', (clientsList) => {
            console.log('GlobalLayout > clientsList', clientsList)
        });

        socket.on('groups_list', (groupsList) => {
            console.log('GlobalLayout > groupsList', groupsList)
        });

        fetchSessionStorage();

        return () => {
            window.removeEventListener('resize', checkMobileView)
        }
    }, [])

    useEffect(() => {
    }, [props.isLoading])

    useEffect(() => {
        console.log('GlobalLayout > userData', userData)

        if(userData.id != -1) {
            socket.emit('register_client', userData.name);

            getChatData(userData.id);
            getChatNotification(userData.id);

            socket.on('receive_notification', ({notifType}) => {
                getChatNotification(userData.id, () => {
                    if(notifType == 'single') {
                        const audio = new Audio('/sounds/msg-notification.mp3');                
                        audio.play()
                            .then(() => {
                                // console.info('User HAS interacted with document yet.');
                            })
                            .catch(error => {
                                console.info('User HAS NOT interacted with document yet.');
                            });
                    }
                });
            });
        }
    }, [userData])

    useEffect(() => {
        // console.log('GlobalLayout > sessionUserId', sessionUserId)

        if (sessionUserId != -1) {
            getUserData(sessionUserId);
        }
    }, [sessionUserId])

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
        // console.log('GlobalLayout > userData', userData)
        // console.log('GlobalLayout > sessionGroups', sessionGroups)

        if (sessionGroups.length > 0) {
            socket.emit('register_group', { groups: sessionGroups, clientName: userData.name })
        }
    }, [userData, sessionGroups])

    useEffect(() => {
        // console.log('GlobalLayout > isMobileView', isMobileView)

        if (isMobileView) {
            setMaxActiveChatCount(maxActiveChatCnt - 1);
            setMaxPassiveChatCount(maxPassiveChatCnt - maxActiveChatCnt);

            let activeChatArr = [...activeChatList];
            /** PASSIVE CHAT LIST LOGIC **/
            let pChatIdx = passiveChatList.map((i) => i.id).indexOf(activeChatArr[activeChatArr.length - 1] ?? -1);
            let passiveChatArr = [...passiveChatList].filter((_, idx) => idx != pChatIdx);

            if (activeChatArr.length > (maxActiveChatCnt - 1)) {
                passiveChatArr.unshift(activeChatArr[activeChatArr.length - 1]);
            }

            if (passiveChatArr.length > (maxPassiveChatCnt - maxActiveChatCnt)) {
                pChatIdx == -1 ? passiveChatArr.pop() : null;
            }

            sessionStorage.setItem('passive_chat_data', JSON.stringify(passiveChatArr));
            setPassiveChatList(passiveChatArr);
            /** PASSIVE CHAT LIST LOGIC **/

            if (activeChatArr.length > (maxActiveChatCnt - 1)) {
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

        if (props.onMobileView) {
            props.onMobileView(isMobileView);
        }
    }, [isMobileView])

    useEffect(() => {
        // console.log('GlobalLayout > isMobilePortrait', isMobilePortrait)
    }, [isMobilePortrait])

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

        activeChatList.length > 0 ? getChatThread(userData.id, activeChatList) : null; // on system init

        socket.on('receive_message', () => {
            activeChatList.length > 0 ? getChatThread(userData.id, activeChatList) : null; // on realtime chat
        });
    }, [userData, activeChatList])

    useEffect(() => {
        setIsLayoutLoading(props.isLoading);
    }, [props.isLoading, activeThreadList])

    useEffect(() => {
        // console.log('GlobalLayout > maxActiveChatCount', maxActiveChatCount)
    }, [maxActiveChatCount])

    useEffect(() => {
        // console.log('GlobalLayout > maxPassiveChatCount', maxPassiveChatCount)
    }, [maxPassiveChatCount])

    function checkMobileView() {
        setIsMobileView(window.innerWidth < viewBreakpoint ? true : false);
    }

    function checkMobileOrientation(value) {
        setIsMobilePortrait(value ? true : false);
    }

    async function fetchSessionStorage() {
        sessionStorage.getItem('userid_data') ? setSessionUserId(parseInt(sessionStorage.getItem('userid_data'))) : null;
        sessionStorage.getItem('nav_data') ? setSessionNav(sessionStorage.getItem('nav_data')) : null;
        sessionStorage.getItem('active_chat_data') ? setActiveChatList(JSON.parse(sessionStorage.getItem('active_chat_data'))) : null;
        sessionStorage.getItem('passive_chat_data') ? setPassiveChatList(JSON.parse(sessionStorage.getItem('passive_chat_data'))) : null;
    }

    async function getUserData(userId) {
        await getUsers(`userId=${userId}`).then(
            (res) => {
                // console.log('getUserData > res', res)

                setUserData(res?.status == 200 && res?.data ? res?.data : {
                    id: -1,
                    name: '',
                    image: ''
                });
            },
            (err) => {
                console.log('getUserData > err', err)
                setUserData({
                    id: -1,
                    name: '',
                    image: ''
                });
            },
        )
    }

    async function getChatData(userId) {
        await getChats(`userId=${userId}`).then(
            (res) => {
                // console.log('getChatData > res', res)

                setSessionFriends(res?.status == 200 && res?.data?.friends ? res?.data?.friends : []);
                setSessionGroups(res?.status == 200 && res?.data?.groups ? res?.data?.groups : []);
            },
            (err) => {
                console.log('getChatData > err', err)
                setSessionFriends([]);
                setSessionGroups([]);
            },
        );
    }

    async function getChatThread(userId, data) {
        console.log('getChatThread > userId', userId)
        console.log('getChatThread > data', data)

        const promisesList = data.map((item) => getThreads(`userId=${userId}&chatId=${item.id}&chatType=${item.type}`));
        const promisesResList = await Promise.all(promisesList);
        // console.log('getChatThread > multiple > res', promisesResList)

        setActiveThreadList(promisesResList.map((item) => item?.data ?? {}));
    }

    async function postChatThread(formData, chatObj, callback) {
        await postThreads(formData).then(
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
    
    async function patchChatThread(formData, callback) {
        await patchThreads(formData).then(
            (res) => {
                // console.log('GlobalLayout > patchChatThread > res', res)

                socket.emit('update_message');
            },
            (err) => {
                console.log('GlobalLayout > patchChatThread > err', err)
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

    async function getChatNotification(userId, callback) {
        await getNotifications(`userId=${userId}`).then(
            (res) => {
                // console.log('getChatNotification > res', res)

                setNotificationData(res?.status == 200 && res?.data ? res?.data : {
                    messages: {
                        count: 0,
                        data: []
                    },
                    notifs: {
                        count: 0,
                        data: []
                    }
                });
            },
            (err) => {
                console.log('getChatNotification > err', err)
                setNotificationData({
                    messages: {
                        count: 0,
                        data: []
                    },
                    notifs: {
                        count: 0,
                        data: []
                    }
                });
            },
        );

        callback ? callback() : null;
    }

    async function postChatNotification(formData, chatObj, callback) {
        await postNotifications(formData).then(
            (res) => {
                console.log('GlobalLayout > postChatNotification > res', res)

                socket.emit('send_notification', { receiverName: chatObj?.name });
            },
            (err) => {
                console.log('GlobalLayout > postChatNotification > err', err)
            },
        );

        callback ? callback() : null;
    }

    async function patchChatNotification(formData, callback) {
        await patchNotifications(formData).then(
            (res) => {
                console.log('GlobalLayout > patchChatNotification > res', res)
            },
            (err) => {
                console.log('GlobalLayout > patchChatNotification > err', err)
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

        switch (origin) {
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
        formData.append('userId', userData.id);
        formData.append('chatId', chatObj?.id);
        formData.append('chatType', chatObj?.type);
        console.log('')

        if (attachmentsList && attachmentsList.length > 0) {
            formData.append('userName', userData.name);
            Array.from(attachmentsList).forEach((item) => {
                formData.append('attachments', item);
            })

            postChatAttachments(formData, (attachments) => {
                chatInput ? chatInput.attachments = attachments : null;
                
                formData.append('chatInput', JSON.stringify(chatInput));
                postChatThread(formData, chatObj);
                formData.append('chatObj', JSON.stringify(chatObj?.type == 'single' ? {...userData, type: 'single', isOnline: true} : chatObj));
                postChatNotification(formData, chatObj);
            })
        } else {
            formData.append('chatInput', JSON.stringify(chatInput));
            postChatThread(formData, chatObj);
            formData.append('chatObj', JSON.stringify(chatObj?.type == 'single' ? {...userData, type: 'single', isOnline: true} : chatObj));
            postChatNotification(formData, chatObj);
        }
    }

    const onUpdateChatMessageClick = (chatObj, chatInput) => { // TO-DO: apply logic on Chat > Options > click
        const formData = new FormData();

        patchChatThread(formData);
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

        if (aChatIdx == -1) {
            activeChatArr.unshift(value);

            /** PASSIVE CHAT LIST LOGIC **/
            let pChatIdx = passiveChatList.map((i) => i.id).indexOf(value?.id ?? -1);
            let passiveChatArr = [...passiveChatList].filter((_, idx) => idx != pChatIdx);

            if (activeChatArr.length > maxActiveChatCount) {
                passiveChatArr.unshift(activeChatArr[activeChatArr.length - 1]);
            }

            if (passiveChatArr.length > maxPassiveChatCount) {
                pChatIdx == -1 ? passiveChatArr.pop() : null;
            }

            sessionStorage.setItem('passive_chat_data', JSON.stringify(passiveChatArr));
            setPassiveChatList(passiveChatArr);
            /** PASSIVE CHAT LIST LOGIC **/

            if (activeChatArr.length > maxActiveChatCount) {
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

    const onChatInputFocus = (chatObj) => {
        const formData = new FormData();
        formData.append('userId', userData.id);
        formData.append('chatId', chatObj?.id);
        formData.append('chatType', chatObj?.type);

        patchChatNotification(formData, () => {
            getChatNotification(userData.id);
        });
    }

    return (
        <Box component="main" sx={GLOBAL.globalMainContainer}>
            {isLayoutLoading ? <Loader /> : null}
            {fileAttachment ? <ViewAttachment fileAttachment={fileAttachment} onCloseViewAttachment={onCloseChatAttachmentClick} /> : null}

            <CssBaseline />

            <TopAppBar
                appBarHeight={appBarHeight}
                isMobileView={isMobileView}
                userData={userData}
                notificationData={notificationData}
                isLeftDrawerOpen={isLeftDrawerOpen}
                onDrawerToggleClick={onDrawerToggleClick}
                onAppBarNotificationItemClick={onSelectedChatClick}
                onLoading={(value) => setIsLayoutLoading(value)}
            />

            <LeftDrawer
                appBarHeight={appBarHeight}
                menuBarHeight={menuBarHeight}
                isMobileView={isMobileView}
                sessionNav={sessionNav}
                isLeftDrawerOpen={isLeftDrawerOpen}
                onDrawerToggleClick={onDrawerToggleClick}
            />

            <Box component="section" sx={{ ...GLOBAL.globalMainSection, paddingTop: isMobileView ? '55px' : 'unset' }}>
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
                    isMobilePortrait={isMobilePortrait}
                    isRightDrawerMobileOpen={isRightDrawerMobileOpen}
                    instance={(idx + 1)}
                    userData={userData}
                    selectedChat={selectedChat}
                    activeChatData={item}
                    activeThreadData={activeThreadList}
                    onChatBoxCloseClick={(value) => onRemoveChatClick(value, 'chat-box')}
                    onChatBoxMinimizeClick={onMinimizeChatClick}
                    onChatBoxSendInput={onSendChatInputClick}
                    onChatBoxViewAttachment={onViewChatAttachmentClick}
                    onChatBoxInputFocus={onChatInputFocus}
                    onResetSelectedChat={() => setSelectedChat(null)}
                    onResetChatThread={() => getChatThread(userData.id, activeChatList)}
                />
            ))}
        </Box>
    )
}