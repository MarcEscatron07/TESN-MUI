"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin  from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import moment from 'moment-timezone';
import Holidays from 'date-holidays';

import { getLocalHolidays } from "@/lib/api";

export default function EventCalendar() {
    const theme = useTheme();
    const hd = new Holidays('PH');

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
                            id: idx + 1,
                            title: item?.name,
                            link: item?.link,
                            description: item?.description,
                            start: moment(`${item?.date}, ${moment().year()}`).toDate(),
                            end: moment(`${item?.date}, ${moment().year()}`).toDate(),
                            classNames: ['fc-custom-event', 'fc-local-holiday'],
                            extendedProps: []
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
                        if(['public', 'optional'].includes(item?.type)) {
                            return {
                                id: idx + 1,
                                title: item?.name,
                                link: item?.link,
                                description: item?.description,
                                start: moment(item?.date).toDate(),
                                end: moment(item?.date).toDate(),
                                classNames: ['fc-custom-event', 'fc-regular-holiday'],
                                extendedProps: []
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

    const onEventClick = (event) => {
        console.log('onEventClick > event', event)
        alert('Event clicked!')
    }

    const onDateClick = (event) => {
        console.log('onDateClick > event', event)
        alert('Date clicked!')
    }

    return (
        <FullCalendar
            plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, bootstrapPlugin ]}
            initialView="dayGridMonth"
            themeSystem="bootstrap5"
            editable={true}
            selectable={true}
            dayMaxEvents={true} // allow "more" link when too many events
            displayEventTime={true}
            displayEventEnd={true}
            eventTimeFormat={{ // like '14:30:00'
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    meridiem: false
            }}
            events={[
                ...locHDList, 
                ...regHDList, 
                ...customEventsList
            ]}
            eventClick={onEventClick}
            dateClick={onDateClick}
        />
    )
}