"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { Scheduler } from "@aldabil/react-scheduler";
import moment from 'moment-timezone';
import Holidays from 'date-holidays';

import { getLocalHolidays } from "@/lib/api";

export default function EventCalendar() {
    const theme = useTheme();
    const hd = new Holidays('PH');

    const schedulerRef = useRef(null);

    const [locHDList, setLocHDList] = useState([]);
    const [regHDList, setRegHDList] = useState([]);
    const [customEventsList, setCustomEventsList] = useState([]);

    useEffect(() => {
        fetchHolidays();
    }, [])

    useEffect(() => {
        console.log('EventCalendar > locHDList', locHDList)
    }, [locHDList])

    useEffect(() => {
        console.log('EventCalendar > regHDList', regHDList)
    }, [regHDList])

    useEffect(() => {
        console.log('EventCalendar > customEventsList', customEventsList)
    }, [customEventsList])

    async function fetchHolidays() {
        await getLocalHolidays().then(
            (res) => {
                setLocHDList(
                    res ? res.map((item, idx) => {
                        return {
                            event_id: idx + 1,
                            title: item.name,
                            start: moment(`${item.date}, ${moment().year()}`).toDate(),
                            end: moment(`${item.date}, ${moment().year()}`).toDate(),
                            disabled: false,
                            color: theme.palette.accent1.main,
                            textColor: theme.palette.accent1.contrastText,
                            editable: true,
                            deletable: false, // should be 'false' for holidays
                            draggable: false, // should be 'false' for holidays
                            allDay: true, // should be 'true' for holidays
                            // agendaAvatar: <></>,
                            // sx: {}
                        }
                    }) : []
                )
            },
            (err) => {
                setLocHDList([]);
            },
        )

        await new Promise((resolve, reject) => {
            try {
                const holidaysList = hd.getHolidays(moment().year());
                // console.log('fetchHolidays > holidaysList', holidaysList)
                resolve(holidaysList);
            } catch (error) {
                reject(error);
            }
        }).then(
            (res) => {
                setRegHDList(
                    res ? res.map((item, idx) => {
                        if(['public', 'optional'].includes(item.type)) {
                            return {
                                event_id: idx + 1,
                                title: item.name,
                                start: moment(item.date).toDate(),
                                end: moment(item.date).toDate(),
                                disabled: false,
                                color: theme.palette.accent2.main,
                                textColor: theme.palette.accent2.contrastText,
                                editable: true,
                                deletable: false, // should be 'false' for holidays
                                draggable: false, // should be 'false' for holidays
                                allDay: true, // should be 'true' for holidays
                                // agendaAvatar: <></>,
                                // sx: {}
                            }
                        } else {
                            return null;
                        }
                    }).filter((i) => i != null) : []
                );
            },
            (err) => {
                console.log('fetchHolidays > err', err)
                setRegHDList([]);
            }
        );
    }

    const onConfirmEvent = (event, action) => {
        console.log('onConfirmEvent > event', event)
        console.log('onConfirmEvent > action', action)
        switch (action) {
            case 'create':
                setCustomEventsList((prevState) => [
                    ...prevState, 
                    {
                        event_id: event?.event_id,
                        title: event?.title,
                        start: event?.start,
                        end: event?.end,
                        disabled: false,
                        color: theme.palette.primary.main,
                        textColor: theme.palette.primary.contrastText,
                        editable: true,
                        deletable: true, // should be 'false' for holidays
                        draggable: true, // should be 'false' for holidays
                        allDay: false, // should be 'true' for holidays
                        // agendaAvatar: <></>,
                        // sx: {}
                    }
                ]);
                break;
            default:
                break;
        }
    }

    return (
        <Scheduler
            ref={schedulerRef}
            height={700}
            view="month"
            agenda={false}
            alwaysShowAgendaDays={false}
            selectedDate={moment()}
            navigation={true}
            disableViewNavigator={false}
            events={[
                ...locHDList, 
                ...regHDList, 
                ...customEventsList
            ]}
            onConfirm={onConfirmEvent}
        />
    )
}