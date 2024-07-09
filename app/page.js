"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
} from "@fortawesome/free-solid-svg-icons";

import { getUsers } from "@/lib/api";
import { LOGIN } from "@/app/styles";
import { SITENAME_FULL, SITENAME_ABBR } from "@/lib/variables";

export default function Login() {
  const router = useRouter();

  const [usersList, setUsersList] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const maxValidCount = 2;

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    await getUsers().then(
      (res) => {
        // console.log('Login > users > res', res);

        res ? setUsersList(res) : null;
      },
      (err) => {
        console.log("Login > users > err", err);
        setUsersList(null);
      }
    );
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    let validCount = 0;
    let userId = -1;

    if (usersList) {
      usersList.forEach((data) => {
        if (data.username == username && data.password == password) {
          validCount++;
          userId = data.id;
        }
      });
    }

    if (username.length > 0 && password.length > 0) {
      validCount++;
    }

    if (validCount == maxValidCount) {
      router.push(`/home?id=${userId}`);
    } else {
      alert("An error occured. Unable to login.");
    }
  };

  const onShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid container component="main" sx={LOGIN.mainContainer}>
      <CssBaseline />
      <Grid item sm={12} md={5} square>
        <Box
          height={"100%"}
          sx={LOGIN.sectionLeft}
        >
          <Paper elevation={3} style={LOGIN.headerContainer}>
            <Image
              className="page-logo"
              src="/images/tagbilaran-seal.png"
              width={50}
              height={50}
              alt="Tagbilaran Seal"
            />
            <Typography
              variant="h5"
              noWrap
              component="div"
              style={LOGIN.headerText}
            >
              {SITENAME_FULL}
            </Typography>
          </Paper>
          <Paper elevation={3} style={LOGIN.formContainer}>
            <Box noValidate component="form" onSubmit={handleFormSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                // label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                placeholder="Username"
                InputProps={{
                  style: LOGIN.formInputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faUserCircle} size="lg" />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                  style: LOGIN.formInputLabelProps,
                }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                // label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                placeholder="Password"
                InputProps={{
                  style: LOGIN.formInputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faLock} size="lg" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="start">
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
                  style: LOGIN.formInputLabelProps,
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                style={LOGIN.formControlLabel}
                control={<Checkbox value="remember" color="secondary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={LOGIN.formButtonSignIn}
                color="secondary"
                startIcon={<FontAwesomeIcon icon={faKey} size="lg" />}
              >
                Sign In
              </Button>
              {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" style={LOGIN.formForgotPassword}>
                    Forgot your password?
                  </Link>
                </Grid>
              </Grid> */}
              <Box sx={LOGIN.formCopyright}>
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
        sx={LOGIN.sectionRight}
      />
    </Grid>
  );
}
