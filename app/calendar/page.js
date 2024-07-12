"use client";

import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";

import { Scheduler } from "@aldabil/react-scheduler";

import GlobalLayout from "@/components/layout";

import { DrawerHeader } from "@/components/function";

export default function Calendar() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000)
    }, [])

    return (
        <>
            <GlobalLayout isLoading={isLoading}>
                <Box component="section" sx={{ width: '100%', px: 3}}>
                    <DrawerHeader />

                    <Box sx={{mt: 10}}>
                        <Scheduler
                            view="month"
                            events={[
                                {
                                    event_id: 1,
                                    title: "Event 1",
                                    start: new Date("2021/5/2 09:30"),
                                    end: new Date("2021/5/2 10:30"),
                                },
                                {
                                    event_id: 2,
                                    title: "Event 2",
                                    start: new Date("2021/5/4 10:00"),
                                    end: new Date("2021/5/4 11:00"),
                                },
                            ]}
                        />
                    </Box>
                </Box>
            </GlobalLayout>
        </>
    )
}