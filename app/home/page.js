"use client";

import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";

import GlobalLayout from "@/components/layout";

import { HOME } from "@/app/styles";
import { DrawerHeader } from "@/components/function";
import { CardPost } from '@/components';
import { getPosts } from "@/lib/api";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [postsList, setPostsList] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    getHomePosts();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000)
  }, []);

  async function getHomePosts() {
    await getPosts().then(
      (res) => {
        // console.log('getHomePosts > res', res)

        setPostsList(res?.status == 200 && res?.data ? res?.data : []);
      },
      (err) => {
        console.log('getHomePosts > err', err);
        setPostsList([]);
      },
    );
  }

  const onLayoutMobileView = (value) => {
    setIsMobileView(value);
  }

  return (
    <>
      <GlobalLayout isLoading={isLoading} onMobileView={onLayoutMobileView}>
        <Box component="section" sx={HOME.homeSectionContent}>
          <DrawerHeader />

          {postsList.map((item, idx) => (
            <CardPost key={idx} data={item} isMobileView={isMobileView} />
          ))}
        </Box>
      </GlobalLayout>
    </>
  );
}
