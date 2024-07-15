"use client";

import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Chip from '@mui/material/Chip';

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

                    <Box sx={{ mt: 3 }}>
                        <Chip label="Public Holidays" color="accent2" sx={{ mr: 1 }} />
                        <Chip label="Local Events/Holidays" color="accent1" sx={{ mr: 1 }} />
                    </Box>

                    <Box sx={{ mt: 1 }}>
                        <EventCalendar />
                    </Box>
                </Box>
            </GlobalLayout>
        </>
    )
}