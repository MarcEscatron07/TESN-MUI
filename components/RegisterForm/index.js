"use client";

import React, { useState, useEffect } from "react";
import moment from 'moment-timezone';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { REGISTER } from "@/app/styles";

export default function RegisterForm(props) {
    const [modalData, setModalData] = useState({
        fname: '',
        lname: '',
        username: '',
        password: '',
        email: '',
        birthdate: null,
    });

    useEffect(() => {
        // console.log('EventCalendar > props.isOpen', props.isOpen)

        if (!props.isOpen) {
            setModalData({
                fname: '',
                lname: '',
                username: '',
                password: '',
                email: '',
                birthdate: null,
            })
        }
    }, [props.isOpen])

    const onButtonCancelClick = (event) => {
        props.onRegisterDialogCancel ? props.onRegisterDialogCancel() : null;
    }

    const onButtonConfirmClick = (event, value) => {
        event.preventDefault();
        props.onRegisterDialogConfirm ? props.onRegisterDialogConfirm(value) : null;
    }
    
    return (
        <Dialog
            open={props.isOpen}
            onClose={() => {}}
            PaperProps={{ component: 'form', onSubmit: (event) => onButtonConfirmClick(event, modalData) }}
        >
            <DialogTitle>Registration Form</DialogTitle>

            <DialogContent>
                <Grid container spacing={3} sx={REGISTER.registerMainContainer}>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            margin="none"
                            label="First Name"
                            id="fname"
                            name="fname"
                            autoComplete="fname"
                            autoFocus
                            InputLabelProps={{ shrink: true }}
                            value={modalData.fname}
                            onChange={(event) => setModalData({ ...modalData, fname: event.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            margin="none"
                            label="Last Name"
                            id="lname"
                            name="lname"
                            autoComplete="lname"
                            autoFocus
                            InputLabelProps={{ shrink: true }}
                            value={modalData.lname}
                            onChange={(event) => setModalData({ ...modalData, lname: event.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            margin="none"
                            label="Username"
                            id="username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            InputLabelProps={{ shrink: true }}
                            value={modalData.username}
                            onChange={(event) => setModalData({ ...modalData, username: event.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            margin="none"
                            label="Password"
                            id="password"
                            name="password"
                            type={"password"}
                            autoComplete="password"
                            autoFocus
                            InputLabelProps={{ shrink: true }}
                            value={modalData.password}
                            onChange={(event) => setModalData({ ...modalData, password: event.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            margin="none"
                            label="Email"
                            id="email"
                            name="email"
                            type={"email"}
                            autoComplete="email"
                            autoFocus
                            InputLabelProps={{ shrink: true }}
                            value={modalData.email}
                            onChange={(event) => setModalData({ ...modalData, email: event.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DatePicker
                            sx={REGISTER.registerDatePicker}
                            label="Birthday"
                            id="birthdate"
                            name="birthdate"
                            value={modalData.birthdate}
                            onChange={(value) => setModalData({ ...modalData, birthdate: value })}
                            maxDate={moment()}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onButtonCancelClick}>Cancel</Button>
                <Button type="submit">Confirm</Button>
            </DialogActions>
        </Dialog>
    );
}