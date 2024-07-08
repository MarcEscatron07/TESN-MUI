'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import {
  LOGIN
} from '@/utils/styles';

import {
  SITENAME_FULL,
  SITENAME_ABBR
} from '@/utils/variables';

function Copyright(props) {
  return (
    <Typography variant="body1" color="text.secondary" align="center" {...props}>
      {'© '}
      {new Date().getFullYear()}
      {' '}
      {SITENAME_ABBR}
    </Typography>
  );
}

export default function Login() {
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    let userId = 1;

    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get('username'),
      password: data.get('password'),
    });

    router.push(`/home?id=${userId}`);
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid item sm={12} md={5} square>
        <Box
          height={'100%'}
          sx={{
            py: 8,
            px: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box style={LOGIN.headerContainer}>
            <Image
              className="page-logo"
              src="/images/tagbilaran-seal.png"
              width={70}
              height={70}
              alt="Tagbilaran Seal"
            />
            <Typography variant="h5" noWrap component="div" style={LOGIN.headerText}>
              {SITENAME_FULL}
            </Typography>
          </Box>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
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
            <Copyright sx={{ mt: 12 }} />
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={false}
        md={7}
        sx={{
          backgroundImage: 'url("/images/tagbilaran-city-hall.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'left',
        }}
      />
    </Grid>
  );
}