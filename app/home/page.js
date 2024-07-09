"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import {
  DrawerHeader,
} from "@/components/function";
import { TopAppBar, LeftDrawer, RightDrawer, Loader, CardPost } from '@/components';
import { HOME } from "@/app/styles";

export default function Home() {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000)
  }, []);

  const onDrawerToggleClick = (value) => {
    setIsLeftDrawerOpen(value);
  }

  return (
    <>
      {isLoading ? <Loader /> : null}

      <Box component="main" sx={HOME.mainContainer}>
        <CssBaseline />

        <TopAppBar onDrawerToggleClick={onDrawerToggleClick} isLeftDrawerOpen={isLeftDrawerOpen} />

        <LeftDrawer onDrawerToggleClick={onDrawerToggleClick} isLeftDrawerOpen={isLeftDrawerOpen} />

        <Box component="section" sx={HOME.sectionContent}>
          <DrawerHeader />
          
          <CardPost />
        </Box>

        <RightDrawer />
      </Box>
    </>
  );
}
