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
                        <Chip label="Custom Events" color="secondary" sx={{ mr: 1, fontWeight: 'bold' }} />
                        <Chip label="Regular Holidays" color="accent2" sx={{ mr: 1, fontWeight: 'bold' }} />
                        <Chip label="Local Holidays" color="accent1" sx={{ mr: 1, fontWeight: 'bold' }} />
                    </Box>

                    <Box sx={{ mt: 1 }}>
                        <EventCalendar />
                    </Box>
                </Box>
            </GlobalLayout>
        </>
    )
}