"use client";
import React from "react";
import { useEffect, useState } from 'react';
import { CalendarIcon} from "@heroicons/react/24/outline";
import {
  Navbar,
  Typography,
  Card,
  CardBody,
} from "@material-tailwind/react";
 
export function TopNavbar() {
    const [dateTime, setDateTime] = useState('');
    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date();
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            const optionsDate = {
            // weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };

            const formattedDate = new Intl.DateTimeFormat(undefined, optionsDate).format(currentTime);
          
            setDateTime(formattedDate);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Navbar className="mx-auto max-w-full px-4 py-2 lg:px-8 rounded-none ">
        <div className="container max-w-screen-xl mx-auto flex items-center justify-between text-blue-gray-900">
            <Typography
            variant=""
            as="a"
            href="/"
            className="mr-4 cursor-pointer py-1.5 font-medium text-2xl "
            >
            <span className="font-bold  bg-green-500 pl-2 pr-1 text-white">E310</span><span className="bg-red-500 pl-1 pr-2 text-white ">.live</span>
            </Typography>
            
            <div className="flex items-center gap-x-1">
            
            <Card className="shadow-none text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20 rounded-md bg-gray-900/5">
                <CardBody className="py-2 px-5 font-medium flex items-center gap-2">
                    <span className="text-green-900">{dateTime}</span>
                    <CalendarIcon className="w-5 h-5 font-medium text-green-900"/> 
                </CardBody>
            </Card>
            </div>
        
        </div>
        
        </Navbar>
    );
}