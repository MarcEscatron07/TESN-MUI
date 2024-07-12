"use client";

import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";

import GlobalLayout from "@/components/layout";

import { DrawerHeader } from "@/components/function";
import { EventCalendar } from '@/components';

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
                <Box component="section" sx={{ width: '100%', px: 3 }}>
                    <DrawerHeader />

                    <Box sx={{ mt: 10 }}>
                        <EventCalendar />
                    </Box>
                </Box>
            </GlobalLayout>
        </>
    )
}