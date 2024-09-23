"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CryptoJS from "crypto-js";

import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// import Link from '@mui/material/Link';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faLock,
  faKey,
  faEye,
  faEyeSlash,
  faAddressCard
} from "@fortawesome/free-solid-svg-icons";

import { LOGIN } from "@/app/styles";
import { Loader, RegisterForm, AlertToast } from '@/components';
import { postLogin, postUsers } from "@/lib/api";
import { SITENAME_FULL, SITENAME_ABBR } from "@/lib/variables";

export default function LoginForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);

  const [registerDialogState, setRegisterDialogState] = useState({
    isOpen: false,
    dialogTitle: 'Registration Form',
  });

  const [alertToastState, setAlertToastState] = useState({
    isOpen: false,
    toastMessage: '',
    toastSeverity: ''   // 'success', 'info', 'warning', 'error'
  })

  useEffect(() => {
    fetchLocalStorage();
  }, []);

  useEffect(() => {
    // console.log('Login > isRememberMe', isRememberMe)
  }, [isRememberMe]);

  async function fetchLocalStorage() {
    if (localStorage.getItem('login_data')) {
      const dataObj = JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('login_data'), 'secret-key').toString(CryptoJS.enc.Utf8));
      setIsLoading(true);
      processFormData(dataObj?.username ?? '', dataObj?.password ?? '');
    } else {
      setIsLoading(false);
    }
  }

  async function postUserLogin(formData, callback) {
    await postLogin(formData).then(
      (res) => {
        // console.log('Login > postUserLogin > res', res)

        if (res?.status == 200 && res?.data) {
          if (isRememberMe) {
            localStorage.setItem('login_data', CryptoJS.AES.encrypt(JSON.stringify({
              username: username,
              password: password
            }), 'secret-key').toString());
          }

          router.push(`/home`);
        } else {
          res?.message ? alert(res?.message) : null;
        }
      },
      (err) => {
        console.log('Login > postUserLogin > err', err)
      },
    )

    callback ? callback() : null;
  }

  async function postUserData(formData, callback) {
    await postUsers(formData).then(
      (res) => {
        // console.log('Login > postUserData > res', res)
        if (res?.status == 200 && res?.data) {
          setAlertToastState({
            isOpen: true,
            toastMessage: 'You have successfully registered!',
            toastSeverity: 'success'
          })
        } else {
          setAlertToastState({
            isOpen: true,
            toastMessage: 'Unable to register new user.',
            toastSeverity: 'error'
          })
        }
      },
      (err) => {
        console.log('Login > postUserData > err', err)
      },
    )

    callback ? callback() : null;
  }

  const processFormData = (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    setIsLoading(true);
    postUserLogin(formData, () => setIsLoading(false));
  }

  const onLoginFormSubmit = (event) => {
    event.preventDefault();

    processFormData(username, password);
  };

  const onShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  const onRememberMeChange = (event) => {
    setIsRememberMe(event.target.checked);
  }

  const onRegisterButtonClick = (event) => {
    setRegisterDialogState({
      isOpen: true,
      dialogTitle: 'Registration Form',
    });
  }

  const onRegisterDialogConfirm = (value) => {
    const formData = new FormData();
    formData.append('groupIds', null);
    formData.append('username', value.username);
    formData.append('password', value.password);
    formData.append('name', `${value.fname} ${value.lname}`);
    formData.append('image', null);
    formData.append('email', value.email ?? null);
    formData.append('birthdate', value.birthdate ?? null);

    setIsLoading(true);
    postUserData(formData, () => {
      setIsLoading(false);
      setRegisterDialogState({
        isOpen: false,
        dialogTitle: 'Registration Form',
      });
    });
  }

  const onRegisterDialogCancel = (event) => {
    setRegisterDialogState({
      isOpen: false,
      dialogTitle: 'Registration Form',
    });
  }

  const onAlertToastClose = () => {
    setAlertToastState({
      isOpen: false,
      toastMessage: '',
      toastSeverity: ''
    });
  }

  return (
    <>
      {isLoading ? <Loader /> : null}

      <Box component="main">
        <Grid container sx={LOGIN.loginMainContainer}>
          <CssBaseline />
          <Grid item sm={12} md={5}>
            <Box
              height={"100%"}
              sx={LOGIN.loginSectionLeft}
            >
              <Paper elevation={3} style={LOGIN.loginHeaderContainer}>
                <Image
                  className="page-logo"
                  src="/images/tagbilaran-seal.png"
                  width={50}
                  height={50}
                  alt="Tagbilaran Seal"
                />
                <Typography
                  variant="h5"
                  component="div"
                  style={LOGIN.loginHeaderText}
                >
                  {SITENAME_FULL}
                </Typography>
              </Paper>
              <Paper elevation={3} style={LOGIN.loginFormContainer}>
                <Box component="form" onSubmit={onLoginFormSubmit}>
                  <TextField
                    required
                    fullWidth
                    margin="normal"
                    // label="Username"
                    id="username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    placeholder="Username"
                    InputProps={{
                      style: LOGIN.loginFormInputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faUserCircle} size="lg" />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                      style: LOGIN.loginFormInputLabelProps,
                    }}
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                  <TextField
                    required
                    fullWidth
                    margin="normal"
                    // label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    InputProps={{
                      style: LOGIN.loginFormInputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faLock} size="lg" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          {password.length > 0 ? (
                            <span
                              className="input-action"
                              title={showPassword ? "Hide" : "Show"}
                              onClick={onShowPasswordClick}
                            >
                              <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                size="lg"
                              />
                            </span>
                          ) : null}
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                      style: LOGIN.loginFormInputLabelProps,
                    }}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <FormControlLabel
                    style={LOGIN.loginFormControlLabel}
                    control={<Checkbox color="secondary" checked={isRememberMe} onChange={onRememberMeChange} />}
                    label="Remember me"
                  />
                  <Box sx={LOGIN.loginFormButtonContainer}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={LOGIN.loginFormButtonAction}
                      color="secondary"
                      startIcon={<FontAwesomeIcon icon={faKey} size="lg" />}
                    >
                      Sign In
                    </Button>
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      sx={LOGIN.loginFormButtonAction}
                      color="primary"
                      startIcon={<FontAwesomeIcon icon={faAddressCard} size="lg" />}
                      onClick={(event) => onRegisterButtonClick(event)}
                    >
                      Register
                    </Button>
                    {/* <Grid container>
                      <Grid item xs>
                        <Link href="#" variant="body2" color="light.main" style={LOGIN.loginFormForgotPassword}>
                          Forgot your password?
                        </Link>
                      </Grid>
                    </Grid> */}
                  </Box>
                  <Box sx={LOGIN.loginFormCopyright}>
                    <Typography variant="body1" align="center" color="white">
                      {"© "}
                      {new Date().getFullYear()} {SITENAME_ABBR}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
          <Grid
            item
            xs={false}
            md={7}
            sx={LOGIN.loginSectionRight}
          />
        </Grid>
      </Box>

      <RegisterForm
        isOpen={registerDialogState.isOpen}
        dialogTitle={registerDialogState.dialogTitle}
        onRegisterDialogConfirm={onRegisterDialogConfirm}
        onRegisterDialogCancel={onRegisterDialogCancel}
      />

      <AlertToast
        isOpen={alertToastState.isOpen}
        toastKey={alertToastState.toastMessage}
        toastMessage={alertToastState.toastMessage}
        toastSeverity={alertToastState.toastSeverity}
        onAlertToastClose={onAlertToastClose}
      />
    </>
  );
}
