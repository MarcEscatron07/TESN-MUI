"use client";

import React, { useState, useEffect } from "react";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmDialog(props) {
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    useEffect(() => {
    }, [])

    useEffect(() => {
        setIsConfirmDialogOpen(props.isOpen);
    }, [props.isOpen])

    const onButtonCancelClick = () => {
        props.onConfirmDialogCancel ? props.onConfirmDialogCancel() : null;
    }

    const onButtonCancelConfirmClick = () => {
        props.onConfirmDialogConfirm ? props.onConfirmDialogConfirm() : null;
    }

    return (
        <Dialog
            open={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {props.dialogTitle}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.dialogContentText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onButtonCancelClick}>{props.dialogCancelText ?? 'Cancel'}</Button>
                <Button onClick={onButtonCancelConfirmClick} autoFocus>{props.dialogConfirmText ?? 'Confirm'}</Button>
            </DialogActions>
        </Dialog>
    );
}