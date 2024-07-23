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
import DialogTitle from '@mui/material/DialogTitle';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Typography from "@mui/material/Typography";
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { ConfirmDialog } from "@/components";
import { getLocalHolidays } from "@/lib/api";

const OPTION_USERS = [
    {
        id: 1,
        name: "Marc Escatron",
        image: "/images/avatars/avatar_male_1.png"
    },
    {
        id: 2,
        name: "Jerson Albit",
        image: "/images/avatars/avatar_male_2.png"
    },
    {
        id: 3,
        name: "Joel Buena",
        image: "/images/avatars/avatar_male_3.png"
    },
    {
        id: 4,
        name: "Rommel Digal",
        image: "/images/avatars/avatar_male_4.png"
    },
    {
        id: 5,
        name: "Junjie Bautista",
        image: "/images/avatars/avatar_male_5.png"
    },
    {
        id: 6,
        name: "Ian Tambis",
        image: "/images/avatars/avatar_male_6.png"
    }
];

const OPTION_VISIBILITY = [
    {
        id: 1,
        label: 'Private',
        value: 'private'
    },
    {
        id: 2,
        label: 'Public',
        value: 'public'
    },
    {
        id: 3,
        label: 'Group', // if Group, show additional field for choosing a group for event visibility
        value: 'group'
    },
];

export default function EventCalendar() {
    const theme = useTheme();
    const hd = new Holidays('PH');

    const [holidaysList, setHolidaysList] = useState([]);
    const [eventsList, setEventsList] = useState([]);

    const [popoverAnchor, setPopoverAnchor] = useState(null);
    const [popoverData, setPopoverData] = useState({
        id: -1,
        title: '',
        start: moment(),
        end: moment(moment()).add(23, 'hours').add(59, 'minutes'),
        guests: [],
        link: '',
        location: '',
        description: '',
        visibility: '',
        type: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({
        id: -1,
        title: '',
        start: moment(),
        end: moment(),
        guests: [],
        link: '',
        location: '',
        description: '',
        visibility: ''
    });

    const [confirmDialogState, setConfirmDialogState] = useState({
        isOpen: false,
        dialogTitle: '',
        dialogContentText: ''
    });

    useEffect(() => {
        fetchHolidays();
        fetchEvents();
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
                id: -1,
                title: '',
                start: moment(),
                end: moment(moment()).add(23, 'hours').add(59, 'minutes'),
                guests: [],
                link: '',
                location: '',
                description: '',
                visibility: '',
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
                id: -1,
                title: '',
                start: moment(),
                end: moment(),
                guests: [],
                link: '',
                location: '',
                description: '',
                visibility: ''
            })
        }
    }, [isModalOpen])

    useEffect(() => {
        console.log('EventCalendar > modalData', modalData)
    }, [modalData])
    /** MODAL useEffect **/

    async function fetchHolidays() {
        if(sessionStorage.getItem('holidays_data')) {
            setHolidaysList(JSON.parse(sessionStorage.getItem('holidays_data')));
        } else {
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
                    console.log('fetchHolidays > regular > res', res)
    
                    regularHolidayArr = res ? res.map((item, idx) => {
                        if (['public', 'optional'].includes(item?.type)) {
                            return {
                                id: item?.name ? `reg_${idx}_${item?.name}` : -1,
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
                    console.log('fetchHolidays > regular > err', err)
                    regularHolidayArr = [];
                }
            );
    
            let localHolidayArr = [];
            await getLocalHolidays().then(
                (res) => {
                    console.log('fetchHolidays > local > res', res)
    
                    localHolidayArr = res?.data ? res?.data.map((item, idx) => {
                        return {
                            id: item?.name ? `loc_${idx}_${item?.name}` : -1,
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
                    console.log('fetchHolidays > local > err', err)
                    localHolidayArr = [];
                },
            )

            const holidaysArr = [...regularHolidayArr, ...localHolidayArr];
            sessionStorage.setItem('holidays_data', JSON.stringify(holidaysArr));
            setHolidaysList(holidaysArr);
        }
    }

    async function fetchEvents() {
        if(sessionStorage.getItem('events_data')) {
            setEventsList(JSON.parse(sessionStorage.getItem('events_data')));
        } else {
            // API CALL FOR FETCHING EVENTS HERE
        }
    }

    /** FULLCALENDAR FUNCTIONS **/
    const onEventClick = (event) => {
        const eventId = event?.event?.id ?? '';

        const holIdx = holidaysList.map((i) => i.id).indexOf(eventId);
        holIdx != -1 ? setPopoverData({ ...holidaysList[holIdx], type: 'holiday' }) : null;
        const evtIdx = eventsList.map((i) => i.id).indexOf(eventId);
        evtIdx != -1 ? setPopoverData({ ...eventsList[evtIdx], type: 'event' }) : null;

        if (eventId && (holIdx != -1 || evtIdx != -1)) {
            setPopoverAnchor(event.el);
        } else {
            setPopoverAnchor(null);
        }
    }

    const onDateClick = (event) => {
        if (event?.date) {
            setModalData({ ...modalData, start: moment(event.date), end: moment(event.date).add(23, 'hours').add(59, 'minutes') });
            setIsModalOpen(true);
        } else {
            setIsModalOpen(false);
        }
    }
    /** FULLCALENDAR FUNCTIONS **/

    /** POPOVER FUNCTIONS **/
    const onPopoverEditClick = () => {
        const evtIdx = eventsList.map((i) => i.id).indexOf(popoverData?.id);

        if (evtIdx != -1) {
            setPopoverAnchor(null);

            setModalData({ ...eventsList[evtIdx], start: moment(eventsList[evtIdx]?.start), end: moment(eventsList[evtIdx]?.end) });
            setIsModalOpen(true);
        }
    }

    const onPopoverDeleteClick = () => {
        setConfirmDialogState({
            isOpen: true,
            dialogTitle: 'Delete Event',
            dialogContentText: 'Are you sure you want to delete this event?'
        });
    }
    /** POPOVER FUNCTIONS **/

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
            guests: modalData.guests,
            classNames: ['fc-custom-event', 'fc-my-event'],
            extendedProps: []
        }

        let eventsArr = [];
        const evtIdx = formJson?.id ? eventsList.map((i) => i.id).indexOf(formJson?.id) : -1;

        if (evtIdx != -1) {
            const filteredArr = eventsList.filter((i) => i.id != eventsList[evtIdx].id);
            eventsArr = [...filteredArr, { ...eventObj, id: formJson?.title ? `evt_${eventsList.length}_${formJson?.title}` : -1 }];
        } else {
            eventsArr = [...eventsList, { ...eventObj, id: formJson?.title ? `evt_${eventsList.length}_${formJson?.title}` : -1 }];
        }

        sessionStorage.setItem('events_data', JSON.stringify(eventsArr));
        setEventsList(eventsArr);

        onModalToggleClick(false);
    }
    /** MODAL FUNCTIONS **/

    const onConfirmDialogCancel = () => {
        setConfirmDialogState({
            ...confirmDialogState,
            isOpen: false,
        });
    }

    const onConfirmDialogConfirm = () => {
        onConfirmDialogCancel();

        setPopoverAnchor(null);
        const filteredArr = eventsList.filter((i) => i.id != popoverData?.id);
        setEventsList(filteredArr);
    }

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
                                    <IconButton aria-label="event-calendar-edit" sx={{ color: theme.palette.light.main }} onClick={onPopoverEditClick}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="event-calendar-delete" sx={{ color: theme.palette.light.main }} onClick={onPopoverDeleteClick}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            ) : null}
                        </Box>
                    </Box>
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
                    {popoverData?.type == 'event' ? (
                        <>
                            {popoverData?.link != '' ? (
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
                            {popoverData?.location != '' ? (
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
                                            <LocationOnIcon />
                                        </span>
                                        <span style={{ marginLeft: 15 }}>
                                            {`${popoverData?.location}`}
                                        </span>
                                    </Typography>
                                </Box>
                            ) : null}
                            {popoverData?.description != '' ? (
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
                            {popoverData?.guests?.length > 0 ? (
                                <Box sx={{
                                    width: '100%',
                                    backgroundColor: theme.palette.light.main,
                                    color: theme.palette.dark.main,
                                    px: 1,
                                    py: .8,
                                    display: 'flex'
                                }}>
                                    <span style={{ color: 'gray' }}>
                                        <PeopleIcon />
                                    </span>
                                    <span style={{ marginLeft: 15, maxWidth: 200 }}>
                                        {popoverData?.guests.map((item, idx) => (
                                            <Chip key={idx} label={item.name} avatar={<Avatar alt={item.name} src={item.image} />} sx={{ my: .5 }} />
                                        ))}
                                    </span>
                                </Box>
                            ) : null}
                            {popoverData?.visibility != '' ? (
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
                                            <VisibilityIcon />
                                        </span>
                                        <span style={{ marginLeft: 15, textTransform: 'capitalize' }}>
                                            {`${popoverData?.visibility}`}
                                        </span>
                                    </Typography>
                                </Box>
                            ) : null}
                        </>
                    ) : null}
                </Box>
            </Popover>

            <Dialog
                open={isModalOpen}
                onClose={() => onModalToggleClick(false)}
                PaperProps={{ component: 'form', onSubmit: (event) => onModalFormSubmit(event) }}
            >
                <DialogTitle>Add Event</DialogTitle>
                <DialogContent>
                    <input type="hidden" name="id" value={modalData.id} />

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
                            <Autocomplete
                                multiple
                                fullWidth
                                defaultValue={[]}
                                value={modalData.guests}
                                options={OPTION_USERS} // OPTION_USERS: temporary options
                                getOptionLabel={(option) => option.name}
                                renderOption={(props, option) => {
                                    const { key, ...optionProps } = props;
                                    return (
                                        <li key={key} {...optionProps}>
                                            <Avatar sx={{ mr: 1 }} alt={option.name} src={option.image} />
                                            {option.name}
                                        </li>
                                    );
                                }}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => {
                                        const { key, ...tagProps } = getTagProps({ index });
                                        return (
                                            <Chip key={key} label={option.name} avatar={<Avatar alt={option.name} src={option.image} />} {...tagProps} />
                                        );
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Guests"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}
                                onChange={(event, value) => setModalData({ ...modalData, guests: value })}
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
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="none"
                                label="Location"
                                id="location"
                                name="location"
                                autoComplete="location"
                                autoFocus
                                InputLabelProps={{ shrink: true }}
                                value={modalData.location}
                                onChange={(event) => setModalData({ ...modalData, location: event.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                multiline
                                rows={2}
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
                                select
                                fullWidth
                                margin="none"
                                label="Visibility"
                                id="visibility"
                                name="visibility"
                                autoComplete="visibility"
                                autoFocus
                                InputLabelProps={{ shrink: true }}
                                value={modalData.visibility != '' ? modalData.visibility : OPTION_VISIBILITY[0].value}
                                onChange={(event) => setModalData({ ...modalData, visibility: event.target.value })}
                            >
                                {OPTION_VISIBILITY.map((item, idx) => (
                                    <MenuItem key={idx} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onModalToggleClick(false)}>Cancel</Button>
                    <Button type="submit">Confirm</Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                isOpen={confirmDialogState.isOpen}
                dialogTitle={confirmDialogState.dialogTitle}
                dialogContentText={confirmDialogState.dialogContentText}
                onConfirmDialogConfirm={onConfirmDialogConfirm}
                onConfirmDialogCancel={onConfirmDialogCancel}
            />
        </Paper>
    )
}