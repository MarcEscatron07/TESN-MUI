"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import FullCalendar from '@fullcalendar/react';
import momentPlugin  from '@fullcalendar/moment';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import moment from 'moment-timezone';
import Holidays from 'date-holidays';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";

import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

import { getLocalHolidays } from "@/lib/api";

export default function EventCalendar() {
    const theme = useTheme();
    const hd = new Holidays('PH');

    const [locHDList, setLocHDList] = useState([]);
    const [regHDList, setRegHDList] = useState([]);
    const [customEventsList, setCustomEventsList] = useState([]);

    const [modalOpen, setIsModalOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventStart, setEventStart] = useState(moment());
    const [eventEnd, setEventEnd] = useState(moment());
    const [eventDesc, setEventDesc] = useState('');
    const [eventLink, setEventLink] = useState('');

    useEffect(() => {
        fetchHolidays();
    }, [])

    /** FULLCALENDAR useEffect **/
    useEffect(() => {
        console.log('EventCalendar > locHDList', locHDList)
    }, [locHDList])

    useEffect(() => {
        console.log('EventCalendar > regHDList', regHDList)
    }, [regHDList])

    useEffect(() => {
        console.log('EventCalendar > customEventsList', customEventsList)
    }, [customEventsList])
    /** FULLCALENDAR useEffect **/

    /** MODAL useEffect **/
    useEffect(() => {
        console.log('EventCalendar > eventTitle', eventTitle)
    }, [eventTitle])

    useEffect(() => {
        console.log('EventCalendar > eventStart', eventStart)
        console.log('EventCalendar > typeof eventStart', typeof eventStart)
    }, [eventStart])

    useEffect(() => {
        console.log('EventCalendar > eventEnd', eventEnd)
        console.log('EventCalendar > typeof eventEnd', typeof eventEnd)
    }, [eventEnd])

    useEffect(() => {
        console.log('EventCalendar > eventDesc', eventDesc)
    }, [eventDesc])

    useEffect(() => {
        console.log('EventCalendar > eventLink', eventLink)
    }, [eventLink])
    /** MODAL useEffect **/

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
                        if (['public', 'optional'].includes(item?.type)) {
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

    /** FULLCALENDAR FUNCTIONS **/
    const onEventClick = (event) => {
        console.log('onEventClick > event', event)
        alert('Event clicked!')
    }

    const onDateClick = (event) => {
        console.log('onDateClick > event', event)

        setEventStart(moment(event.date));
        setEventEnd(moment(event.date));

        setIsModalOpen(true);
    }
    /** FULLCALENDAR FUNCTIONS **/

    /** MODAL FUNCTIONS **/
    const onModalToggleClick = (value) => {
        setIsModalOpen(value);
    }

    const onModalFormSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        console.log('onModalFormSubmit > formJson', formJson)

        const eventObj = {
            ...formJson,
            start: moment(formJson?.start).toDate(),
            end: moment(formJson?.end).toDate(),
            classNames: ['fc-custom-event', 'fc-added-event'],
            extendedProps: []
        }

        if(customEventsList.length == 0) {
            setCustomEventsList([{...eventObj, id: 1}]);
        } else {
            setCustomEventsList((prevState) => [...prevState, { ...eventObj, id: customEventsList.length + 1 }]);
        }

        onModalToggleClick(false);
    }
    /** MODAL FUNCTIONS **/

    return (
        <>
            <FullCalendar
                plugins={[momentPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, bootstrapPlugin]}
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

            <Dialog
                open={modalOpen}
                onClose={() => onModalToggleClick(false)}
                PaperProps={{ component: 'form', onSubmit: (event) => onModalFormSubmit(event) }}
            >
                <DialogTitle>Add Event</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{p: 1}}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                margin="none"
                                label="Title"
                                id="title"
                                name="title"
                                autoComplete="title"
                                autoFocus
                                InputLabelProps={{ shrink: true }}
                                value={eventTitle}
                                onChange={(event) => setEventTitle(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DateTimePicker
                                sx={{ width: '100%' }}
                                label="Start Date"
                                id="start_date"
                                name="start"
                                value={eventStart}
                                onChange={(value) => setEventStart(value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DateTimePicker
                                sx={{ width: '100%' }}
                                label="End Date"
                                id="end_date"
                                name="end"
                                value={eventEnd}
                                onChange={(value) => setEventEnd(value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="none"
                                label="Description"
                                id="description"
                                name="description"
                                autoComplete="description"
                                autoFocus
                                InputLabelProps={{ shrink: true }}
                                value={eventDesc}
                                onChange={(event) => setEventDesc(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="none"
                                label="Link"
                                id="link"
                                name="link"
                                autoComplete="link"
                                autoFocus
                                InputLabelProps={{ shrink: true }}
                                value={eventLink}
                                onChange={(event) => setEventLink(event.target.value)}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onModalToggleClick(false)}>Cancel</Button>
                    <Button type="submit">Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}