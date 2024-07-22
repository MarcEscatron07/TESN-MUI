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

  useEffect(() => {
    fetchPosts();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000)
  }, []);

  useEffect(() => {
    console.log('Home > postsList', postsList);
  }, [postsList])

  async function fetchPosts() {
    await getPosts().then(
      (res) => {
        // console.log('Home > fetchPosts > res', res);

        res?.data ? setPostsList(res?.data) : setPostsList([]);
      },
      (err) => {
        console.log('Home > fetchPosts > err', err);

        setPostsList([]);
      },
    );
  }

  return (
    <>
      <GlobalLayout isLoading={isLoading}>
        <Box component="section" sx={HOME.homeSectionContent}>
          <DrawerHeader />

          {postsList.map((item, idx) => (
            <CardPost key={idx} data={item} />
          ))}
        </Box>
      </GlobalLayout>
    </>
  );
}
