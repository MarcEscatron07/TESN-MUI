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
import Link from '@mui/material/Link';
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
import { Loader } from '@/components';
import { postLogin } from "@/lib/api";
import { SITENAME_FULL, SITENAME_ABBR } from "@/lib/variables";

export default function WelcomeLogin() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);

  useEffect(() => {
    fetchLocalStorage();
  }, []);

  useEffect(() => {
    // console.log('Login > isRememberMe', isRememberMe)
  }, [isRememberMe]);

  async function fetchLocalStorage() {
    if(localStorage.getItem('login_data')) {
      const dataObj = JSON.parse(localStorage.getItem('login_data'));
      setIsLoading(true);
      processFormData(dataObj?.username ?? '', dataObj?.password ? CryptoJS.AES.decrypt(dataObj?.password, 'secret-key').toString(CryptoJS.enc.Utf8) : '')
    } else {
      setIsLoading(false);
    }
  }

  async function postUserLogin(formData, callback) {
    await postLogin(formData).then(
      (res) => {
        // console.log('Login > postUserLogin > res', res)

        if(res?.status && res?.data) {
          if(isRememberMe) {
            let dataObj = {
              username: username,
              password: CryptoJS.AES.encrypt(password, 'secret-key').toString()
            };
      
            localStorage.setItem('login_data', JSON.stringify(dataObj));
          }

          sessionStorage.setItem('userid_data', JSON.stringify(res?.data))
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

  const onRegisterClick = (event) => {
    // TO-DO: redirect to /register. UI to be developed.
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
                      onClick={(event) => onRegisterClick(event)}
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
    </>
  );
}
