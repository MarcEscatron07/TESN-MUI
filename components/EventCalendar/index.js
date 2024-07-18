"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import FullCalendar from '@fullcalendar/react';
import momentPlugin from '@fullcalendar/moment';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import moment from 'moment-timezone';
import Holidays from 'date-holidays';

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Typography from "@mui/material/Typography";

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import LinkIcon from '@mui/icons-material/Link';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { getLocalHolidays } from "@/lib/api";

export default function EventCalendar() {
    const theme = useTheme();
    const hd = new Holidays('PH');

    const [holidaysList, setHolidaysList] = useState([]);
    const [eventsList, setEventsList] = useState([]);

    const [popoverAnchor, setPopoverAnchor] = useState(null);
    const [popoverData, setPopoverData] = useState({
        title: '',
        link: '',
        description: '',
        start: moment().toDate(),
        end: moment(moment().toDate()).add(23, 'hours').add(59, 'minutes'),
        type: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({
        title: '',
        start: moment().toDate(),
        end: moment().toDate(),
        description: '',
        link: ''
    });

    useEffect(() => {
        fetchHolidays();
    }, [])

    /** FULLCALENDAR useEffect **/
    useEffect(() => {
        console.log('EventCalendar > holidaysList', holidaysList)
    }, [holidaysList])

    useEffect(() => {
        console.log('EventCalendar > eventsList', eventsList)
    }, [eventsList])
    /** FULLCALENDAR useEffect **/

    /** POPOVER useEffect **/
    useEffect(() => {
        console.log('EventCalendar > popoverAnchor', popoverAnchor)
        if (popoverAnchor == null) {
            setPopoverData({
                title: '',
                link: '',
                description: '',
                start: moment().toDate(),
                end: moment(moment().toDate()).add(23, 'hours').add(59, 'minutes'),
                type: ''
            });
        }
    }, [popoverAnchor])

    useEffect(() => {
        console.log('EventCalendar > popoverData', popoverData)
    }, [popoverData])
    /** POPOVER useEffect **/

    /** MODAL useEffect **/
    useEffect(() => {
        console.log('EventCalendar > isModalOpen', isModalOpen)

        if (!isModalOpen) {
            setModalData({
                ...modalData,
                title: '',
                description: '',
                link: ''
            })
        }
    }, [isModalOpen])

    useEffect(() => {
        console.log('EventCalendar > modalData', modalData)
    }, [modalData])
    /** MODAL useEffect **/

    async function fetchHolidays() {
        let regularHolidayArr = [];
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
                regularHolidayArr = res ? res.map((item) => {
                    if (['public', 'optional'].includes(item?.type)) {
                        return {
                            title: item?.name ?? '',
                            link: item?.link ?? '',
                            description: item?.description ?? '',
                            start: moment(item?.date).isValid() ? moment(item?.date).toDate() : null,
                            end: moment(item?.date).isValid() ? moment(moment(item?.date).toDate()).add(23, 'hours').add(59, 'minutes') : null,
                            classNames: ['fc-custom-event', 'fc-regular-holiday'],
                            extendedProps: []
                        }
                    } else {
                        return null;
                    }
                }).filter((i) => i != null) : [];
            },
            (err) => {
                regularHolidayArr = [];
            }
        );

        let localHolidayArr = [];
        await getLocalHolidays().then(
            (res) => {
                localHolidayArr = res ? res.map((item) => {
                    return {
                        title: item?.name ?? '',
                        link: item?.link ?? '',
                        description: item?.description ?? '',
                        start: moment(item?.date).isValid() ? moment(`${moment().year()}-${item?.date} 00:00:00`).toDate() : null,
                        end: moment(item?.date).isValid() ? moment(moment(`${moment().year()}-${item?.date} 00:00:00`).toDate()).add(23, 'hours').add(59, 'minutes') : null,
                        classNames: ['fc-custom-event', 'fc-local-holiday'],
                        extendedProps: []
                    }
                }) : []
            },
            (err) => {
                localHolidayArr = [];
            },
        )

        setHolidaysList([
            ...regularHolidayArr,
            ...localHolidayArr
        ]);
    }

    /** FULLCALENDAR FUNCTIONS **/
    const onEventClick = (event) => {
        const eventTitle = event?.event?.title ?? '';

        const holIdx = holidaysList.map((i) => i.title).indexOf(eventTitle);
        holIdx != -1 ? setPopoverData({ ...holidaysList[holIdx], type: 'holiday' }) : null;
        const evtIdx = eventsList.map((i) => i.title).indexOf(eventTitle);
        evtIdx != -1 ? setPopoverData({ ...eventsList[evtIdx], type: 'event' }) : null;

        if (eventTitle && (holIdx != -1 || evtIdx != -1)) {
            setPopoverAnchor(event.el);
        } else {
            setPopoverAnchor(null);
        }
    }

    const onDateClick = (event) => {
        if(event?.date) {
            setModalData({ ...modalData, start: moment(event.date), end: moment(event.date).add(23, 'hours').add(59, 'minutes') });
            setIsModalOpen(true);
        } else {
            setIsModalOpen(false);
        }
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
            start: moment().isValid(formJson?.start) ? moment(formJson?.start).toDate() : null,
            end: moment().isValid(formJson?.end) ? moment(formJson?.end).toDate() : null,
            classNames: ['fc-custom-event', 'fc-my-event'],
            extendedProps: []
        }
        setEventsList((prevState) => [...prevState, { ...eventObj }]);

        onModalToggleClick(false);
    }
    /** MODAL FUNCTIONS **/

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
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
                    ...holidaysList,
                    ...eventsList
                ]}
                eventClick={onEventClick}
                dateClick={onDateClick}
            />

            <Popover
                id={popoverAnchor ? 'simple-popover' : undefined}
                open={popoverAnchor ? true : false}
                anchorEl={popoverAnchor}
                onClose={() => setPopoverAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Box sx={{ height: '100%' }}>
                    <Box sx={{
                        width: '100%',
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        px: 1,
                        py: .8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                        >
                            {popoverData?.title}
                        </Typography>
                        <Box>
                            {popoverData?.type == 'event' ? (
                                <>
                                    <IconButton sx={{ color: theme.palette.light.main }} onClick={() => { }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton sx={{ color: theme.palette.light.main }} onClick={() => { }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            ) : null}
                        </Box>
                    </Box>
                    {popoverData?.type == 'event' ? (
                        <>
                            {popoverData?.description.length != '' ? (
                                <Box sx={{
                                    width: '100%',
                                    backgroundColor: theme.palette.light.main,
                                    color: theme.palette.dark.main,
                                    px: 1,
                                    py: .8
                                }}>
                                    <Typography
                                        variant="body1"
                                        noWrap
                                        component="div"
                                        sx={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <span style={{ color: 'gray' }}>
                                            <AlignHorizontalLeftIcon />
                                        </span>
                                        <span style={{ marginLeft: 15 }}>
                                            {`${popoverData?.description}`}
                                        </span>
                                    </Typography>
                                </Box>
                            ) : null}
                            {popoverData?.link.length != '' ? (
                                <Box sx={{
                                    width: '100%',
                                    backgroundColor: theme.palette.light.main,
                                    color: theme.palette.dark.main,
                                    px: 1,
                                    py: .8
                                }}>
                                    <Typography
                                        variant="body1"
                                        noWrap
                                        component="div"
                                        sx={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <span style={{ color: 'gray' }}>
                                            <LinkIcon />
                                        </span>
                                        <span style={{ marginLeft: 15 }}>
                                            {`${popoverData?.link}`}
                                        </span>
                                    </Typography>
                                </Box>
                            ) : null}
                        </>
                    ) : null}
                    <Box sx={{
                        width: '100%',
                        backgroundColor: theme.palette.light.main,
                        color: theme.palette.dark.main,
                        px: 1,
                        py: .8
                    }}>
                        <Typography
                            variant="body2"
                            noWrap
                            component="div"
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <span style={{ color: 'gray' }}>
                                <CalendarTodayIcon />
                            </span>
                            <span style={{ marginLeft: 15 }}>
                                {`${moment(popoverData?.start).isValid() ? moment(popoverData?.start).format('MMMM DD, YYYY hh:mm A') : ''}`}{`${moment(popoverData?.start).isValid() ? ' - ' + moment(popoverData?.end).format('MMMM DD, YYYY hh:mm A') : ''}`}
                            </span>
                        </Typography>
                    </Box>
                </Box>
            </Popover>

            <Dialog
                open={isModalOpen}
                onClose={() => onModalToggleClick(false)}
                PaperProps={{ component: 'form', onSubmit: (event) => onModalFormSubmit(event) }}
            >
                <DialogTitle>Add Event</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ p: 1 }}>
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
                                value={modalData.title}
                                onChange={(event) => setModalData({ ...modalData, title: event.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DateTimePicker
                                sx={{ width: '100%' }}
                                label="Start Date"
                                id="start_date"
                                name="start"
                                value={modalData.start}
                                onChange={(value) => setModalData({ ...modalData, start: value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DateTimePicker
                                sx={{ width: '100%' }}
                                label="End Date"
                                id="end_date"
                                name="end"
                                value={modalData.end}
                                onChange={(value) => setModalData({ ...modalData, end: value })}
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
                                value={modalData.description}
                                onChange={(event) => setModalData({ ...modalData, description: event.target.value })}
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
                                value={modalData.link}
                                onChange={(event) => setModalData({ ...modalData, link: event.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onModalToggleClick(false)}>Cancel</Button>
                    <Button type="submit">Confirm</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}