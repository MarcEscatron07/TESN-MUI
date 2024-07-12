"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Box from "@mui/material/Box";

import GlobalLayout from "@/components/layout";

import { HOME } from "@/app/styles";
import { DrawerHeader } from "@/components/function";
import { CardPost } from '@/components';
import { getUsers, getPosts } from "@/lib/api";

export default function Home() {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: -1,
    username: '',
    password: '',
    name: '',
    image: ''
  });
  const [postsList, setPostsList] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchPosts();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000)
  }, []);

  useEffect(() => {
    console.log('Home > userData', userData);
  }, [userData])

  useEffect(() => {
    console.log('Home > postsList', postsList);
  }, [postsList])

  async function fetchUsers() {
    await getUsers().then(
      (res) => {
        // console.log('Home > users > res', res);

        if (res) {
          const id = searchParams.get("id")
            ? parseInt(searchParams.get("id"))
            : -1;
          const userIdx = res.map((i) => i.id).indexOf(id);

          if (userIdx != -1) {
            setUserData(res[userIdx]);
          }
        }
      },
      (err) => {
        console.log('Home > users > err', err);
      }
    );
  }

  async function fetchPosts() {
    await getPosts().then(
      (res) => {
        // console.log('Home > posts > res', res);

        res ? setPostsList(res) : null;
      },
      (err) => {
        console.log('Home > posts > err', err);
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
