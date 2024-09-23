"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
  }
  

function AlertToast(props) {
    const theme = useTheme();

    const onSnackbarClose = (event) => {
        if(props.onAlertToastClose) {
            props.onAlertToastClose();
        }
    }

    return (
        <Snackbar
            key={props.toastKey}
            open={props.isOpen}
            autoHideDuration={props.toastDuration ?? 3000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            action={
                <Button sx={{color: theme.palette.light.main}} onClick={(event) => onSnackbarClose(event)}>
                    <FontAwesomeIcon icon={faTimes} size="md" />
                </Button>
            }
            onClose={onSnackbarClose}
            TransitionComponent={SlideTransition}
        >
            <Alert
                onClose={onSnackbarClose}
                severity={props.toastSeverity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {props.toastMessage}
            </Alert>
        </Snackbar>
    )
}

export default AlertToast