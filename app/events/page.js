"use client";

import React, { useState, useEffect } from "react";

import GlobalLayout from "@/components/layout";

import { Loader } from '@/components';

export default function Events() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000)
    }, [])

    return (
        <>
            <GlobalLayout>
                {isLoading ? <Loader /> : null}

            </GlobalLayout>
        </>
    )
}