"use client";

import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import { TopAppBar, LeftDrawer, RightDrawer, ChatBox, ChatList } from '@/components';
import { GLOBAL } from "@/app/styles";

export default function HomeLayout(props) {
    const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(true);

    useEffect(() => {
    }, [])

    const onDrawerToggleClick = (value) => {
        setIsLeftDrawerOpen(value);
    }

    return (
        <Box component="main" sx={GLOBAL.globalMainContainer}>
            <CssBaseline />

            <TopAppBar onDrawerToggleClick={onDrawerToggleClick} isLeftDrawerOpen={isLeftDrawerOpen} />

            <LeftDrawer onDrawerToggleClick={onDrawerToggleClick} isLeftDrawerOpen={isLeftDrawerOpen} />

            {props.children}

            <RightDrawer />

            <ChatList />

            {/* MULTIPLE INSTANCES OF CHATBOX HERE */}

            <ChatBox instance={1} />
            {/* <ChatBox instance={2} /> */}
            {/* <ChatBox instance={3} /> */}
            {/* <ChatBox instance={4} /> */}

            {/* MULTIPLE INSTANCES OF CHATBOX HERE */}
        </Box>
    )
}