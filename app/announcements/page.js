"use client";

import React, { useState, useEffect } from "react";

import GlobalLayout from "@/components/layout";

export default function Announcements() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000)
    }, [])

    return (
        <>
            <GlobalLayout isLoading={isLoading}>
            </GlobalLayout>
        </>
    )
}