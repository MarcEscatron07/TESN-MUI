"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Scheduler } from "@aldabil/react-scheduler";
import moment from 'moment-timezone';

import { GOOGLE_API_KEY,GOOGLE_PH_HOLIDAYS_CALENDAR_ID } from '@/lib/variables';

export default function EventCalendar() {
    const theme = useTheme();

    useEffect(() => {
        fetchHolidays();
    }, [])

    async function fetchHolidays() {
        await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_PH_HOLIDAYS_CALENDAR_ID}/events?key=${GOOGLE_API_KEY}`
        )
            .then(
                (res) => {
                    console.log('fetchHolidays > res', res)
                },
                (err) => {
                    console.log('fetchHolidays > err', err)
                },
            ).catch((error) => {
                console.log('fetchHolidays > error', error)
            })
    }

    return (
        <Scheduler
            height={700}
            view="month"
            agenda={false}
            alwaysShowAgendaDays={false}
            selectedDate={moment()}
            navigation={true}
            disableViewNavigator={false}
            events={[
                {
                    event_id: 1,
                    title: "Tagbilaran Charter Day",
                    start: new Date("2024/7/1 09:30"),
                    end: new Date("2024/7/1 10:30"),
                    disabled: false,
                    color: theme.palette.primary.main,
                    textColor: theme.palette.primary.contrastText,
                    editable: true,
                    deletable: false, // should be 'false' for holidays
                    draggable: false, // should be 'false' for holidays
                    allDay: true, // should be 'true' for holidays
                    // agendaAvatar: <></>,
                    // sx: {}
                },
                {
                    event_id: 2,
                    title: "Bohol Charter Day",
                    start: new Date("2024/7/22 09:30"),
                    end: new Date("2024/7/22 10:30"),
                    disabled: false,
                    color: theme.palette.primary.main,
                    textColor: theme.palette.primary.contrastText,
                    editable: true,
                    deletable: false, // should be 'false' for holidays
                    draggable: false, // should be 'false' for holidays
                    allDay: true, // should be 'true' for holidays
                    // agendaAvatar: <></>,
                    // sx: {}
                },
            ]}
        />
    )
}