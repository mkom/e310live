"use client";
import React from "react";
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { MagnifyingGlassIcon,PlayIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  CardBody,
  Chip,
  CardFooter
} from "@material-tailwind/react";

import BadgeImage from "./BadgeImage";
import { LoadingSpinner } from "./Loading";

const fetcher = async () => {
  try {
    const response = await fetch("/api/matches/football",{
      headers: {
        'x-secret-key': process.env.NEXT_PUBLIC_SECRET_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    const now = Date.now();
    const twoHoursBefore = now - 2 * 60 * 60 * 1000;
    const threeHoursAfter = now + 3 * 60 * 60 * 1000;

    const filteredMatches = data.filter(match => 
      match.sources.length > 0 && 
      match.teams && 
      match.category === 'football' && 
      match.date >= twoHoursBefore && 
      match.date <= threeHoursAfter
    )
    .sort((a, b) => a.date - b.date);

    return filteredMatches;
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
};


export function MatchList() {
  const [dateTime, setDateTime] = useState('');
  const currentTime = new Date();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const encodeBase64 = (str) => btoa(str);
  const [loading, setLoading] = useState(true);

  const { data, error } = useSWR('matches', fetcher, {
    refreshInterval: 60000, // Refresh every 1 minute
  });

  const matches = data || [];

  useEffect(() => {
      const interval = setInterval(() => {

          const optionsDate = {
            // weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          };

          const optionsTime = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: userTimeZone,
            hour12: false
          };

          //const formattedDate = new Intl.DateTimeFormat(undefined, optionsDate).format(currentTime);
          const formattedTime = new Intl.DateTimeFormat(undefined, optionsTime).format(currentTime);
          
          setDateTime(formattedTime);
          //setDateDate(formattedDate);
      }, 1000);

      return () => clearInterval(interval);
  }, [currentTime,userTimeZone]);
      

  const formatTime = (time) => {
      const date = new Date(time);
      return date.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
      });
  };

 if (!loading) return <LoadingSpinner/>

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="md:mb-8 mb-4 flex flex-col md:flex-row items-start justify-between gap-2">
          <div>
            <Typography variant="h5" color="blue-gray">
              Live match streams today!
            </Typography>
            
          </div>
          <div className="flex">
            <Typography variant="small" className="font-medium flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5"/> 
            <span>{dateTime} • {userTimeZone}</span>
            </Typography>
          </div>
          
        </div>
        
      </CardHeader>
        {/* <div className="flex justify-between items-center gap-2 flex-col md:flex-row px-5">
          <div className="w-full  ">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />

            
          </div>
          
        </div>    */}
      <CardBody className="overflow-scroll px-0 py-2 ">
        <table className="mt-1 w-full table-auto text-left">
          <thead>
            <tr>
              <th colSpan={3} className=" border-y text-start border-blue-gray-100 bg-blue-gray-50/50 p-2">
                  <Typography
                      className="font-bold uppercase leading-none text-base text-neutral-600 opacity-1"
                  >
                      Event
              </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {matches.length === 0 && (
              <tr>
                <td colSpan={3} className="border-y border-blue-gray-100 p-2">
                  <Typography
                    variant="h6"
                    className="font-medium text-blue-gray-500 text-center"
                  >
                    No matches available
                  </Typography>
                </td>
              </tr>
            )}
            {matches.map((match, index) => (
              <tr key={index} >
                <td className="border-y w-11/12  border-blue-gray-100 py-2 pl-2 pr-0">
                  <div className="flex  justify-start md items-center gap-3">
                    <div className="flex w-full flex-col md:flex-row items-start md:items-center justify-start md:justify-between gap-3">
                    <Typography
                      variant="h6"
                      className="font-medium text-blue-gray-500 flex justify-start md:justify-end items-center gap-2 w-full md:w-11/12">
                        <span className="flex items-center gap-2 md:flex-row-reverse">
                        <BadgeImage id={match?.teams?.home?.badge || ''} size={35} alt={match?.teams?.home?.name || ''} /> <span className="text-sm md:text-base !leading-5 ">{match?.teams?.home?.name || ''}</span>
                        </span>
                      
                    </Typography>

                    <Chip
                      variant="ghost"
                      size="sm"
                      value="VS"
                      color="orange"
                      className="text-center hidden md:block w-1/12"
                    />
                    
                      <Typography
                      variant="h6"
                      className="font-medium  text-blue-gray-500 flex items-center gap-2 w-full md:w-11/12">
                        <span className="flex items-center gap-2 ">
                        <BadgeImage id={match?.teams?.away?.badge ||''} size={35} alt={match?.teams?.away?.name || ''} /> <span className="text-sm md:text-base !leading-5 ">{match?.teams?.away?.name || ''}</span>
                        </span>
                      
                    </Typography>
                    </div>
                    
                  </div>
                </td>
                <td className="border-y w-1/6 border-blue-gray-100 p-2">
                  <Chip
                    variant="ghost"
                    size="sm"
                    value={formatTime(match.date)}
                    color="blue"
                    className="text-center"
                  />
                </td>
                <td className="border-y w-1/6 border-blue-gray-100 p-2">
                <Chip
                    variant="ghost"
                    size="sm"
                    value="whatch"
                    icon={<PlayIcon className="w-4 h-4" />}
                    onClick={() => {
                      // Open a new tab with the match.title
                      const url = `/match/${match.title.replace(/\s+/g, '-')}?id=${encodeBase64(match.id)}`; // Adjust the URL structure based on your routing
                      window.open(url, '_blank'); // Open the URL in a new tab
                    }}
                    color={match.date >= currentTime ? "gray" : "red"}
                    className={`text-center cursor-pointer capitalize  ${match.date >= currentTime ? "pointer-events-none !opacity-35"  : "animate-pulse"}`}
                  />
                </td>
                
              </tr>
            ))}
          </tbody>
          
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        
      </CardFooter>
    </Card>

  );
}