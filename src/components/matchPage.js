"use client";

import React from "react";
import { useState, useEffect } from 'react';
import {useSearchParams } from "next/navigation";
import { TvIcon} from "@heroicons/react/24/outline";
import BadgeImage from "@/components/BadgeImage";
import { LoadingSpinner } from "@/components/Loading";

import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
} from "@material-tailwind/react";

const pageSlug = () => {
    const searchParams = useSearchParams();
    const [events, setEvents] = useState([]);
    const [source, setSource] = useState(null);
    const [id, setId] = useState(null);
    const [streamData, setStreamData] = useState(null);
    const [embedUrl, setEmbedUrl] = useState(null);
    const idMatch = searchParams.get("id"); 
    const [loading, setLoading] = useState(true);
   
    // Decode Base64 di browser
    const decodeBase64 = (base64Str) => {
        try {
            return atob(base64Str);
        } catch (error) {
            return "Error decoding Base64";
        }
    };

    //console.log("Decoded ID:", decodeBase64(idMatch));

    useEffect(() => {
        fetch(`/api/matches/football?id=${decodeBase64(idMatch)}`, {
            headers: {
                'x-secret-key': process.env.NEXT_PUBLIC_SECRET_KEY,
            },
        })
            .then(response => response.json())
            .then(data => {
               // console.log(data)
                setEvents(data[0]);
                setId(data[0]?.sources[0]?.id);
                setSource(data[0]?.sources[0]?.source);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error:", error);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (!source || !id) return;

        fetch(`/api/stream/${source}/${id}`, {
            headers: {
                'x-secret-key': process.env.NEXT_PUBLIC_SECRET_KEY,
            },
        })
            .then(response => response.json())
            .then(data => {
                setEmbedUrl(data[0].embedUrl);
                setStreamData(data);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }, [source,id]);

    if(loading) {
        return  <LoadingSpinner />
    }
    
    return (
        <>
            
            <main className="my-4 px-4 xl:px-8">
                <div className="container max-w-screen-xl mx-auto">
                    <Typography
                    variant="small"
                    className="font-medium mb-4 capitalize flex items-center gap-2"
                    >
                    <TvIcon className="w-6 h-6"/>
                    <span> Live Match </span>
                    </Typography>
                    <div className="flex flex-col  gap-0 md:gap-2 md:flex-row justify-between items-center w-full bg-blue-gray-50 bg-opacity-60 py-2 px-4 rounded-md mb-5">
                        <Typography variant="h5" color="blue-gray" 
                        className="text-md md:text-xl flex justify-center flex-row-reverse md:flex-row md:justify-end items-center gap-2 w-full md:w-11/12">
                            <span>{events?.teams?.home?.name || ''}</span>
                            <BadgeImage 
                                id={events?.teams?.home?.badge ? events.teams.home.badge : ''} 
                                size={35} 
                                alt={events?.teams?.home?.name || 'Home Team'} 
                            />
                        
                        </Typography>

                        <Typography
                            variant="h5" color="blue-gray"
                            className="text-md md:text-xl text-center w-1/12"
                        >
                        VS
                        </Typography>

                        <Typography variant="h5" color="blue-gray" className="text-md md:text-xl justify-center md:justify-start flex items-center gap-2 w-full md:w-11/12">
                        {/* Check if away team exists and has a badge */}
                        <BadgeImage 
                            id={events?.teams?.away?.badge ? events.teams.away.badge : ''} 
                            size={35} 
                            alt={events?.teams?.away?.name || 'Away Team'} 
                        />
                        <span>{events?.teams?.away?.name || ''}</span>
                        </Typography>


                    </div>  
                
                    <div className="flex flex-col md:flex-row items-start gap-4">
                        {embedUrl && (
                            <div className="mb-5 mx-auto w-full md:w-3/4 ">
                                <div dangerouslySetInnerHTML={{ __html: `<iframe src="${embedUrl ? embedUrl : ""}" allow="picture-in-picture; fullscreen" allowfullscreen class="w-full h-60 sm:h-96 md:h-[460px]"></iframe>` }} />
                            </div>
                        )}
                        {!embedUrl && (
                            <div className="mb-4">
                                <Typography variant="small" color="red" className="text-center">
                                    No available streams
                                </Typography>
                            </div>
                        )}
                        <Card className="h-full w-full md:w-1/4 border rounded-none">
                            <CardHeader floated={false} shadow={false} className="rounded-none">
                                <Typography
                                variant="small"
                                className="font-medium mb-3"
                                >
                                Available Streams
                                </Typography>
                            </CardHeader>
                            <CardBody className="flex flex-wrap items-center justify-center gap-3 pt-1">
                                
                                {Array.isArray(streamData) && streamData.map((i, index) => (
                                    <div key={index}>
                                        <Button 
                                        variant="gradient" 
                                        size="sm" 
                                        color={embedUrl === i.embedUrl ? 'red' :'green'} 
                                        className="flex items-center gap-1 px-2 py-1"
                                        onClick={() => setEmbedUrl(i.embedUrl)}
                                        >
                                            <TvIcon className="w-5 h-5"/>
                                            Stream {i.streamNo}
                                        </Button>
                                        
                                    </div>
                                ))}

                            </CardBody>
                        </Card>
                    </div>
                
                    
                    
                    
                    
                </div>
            </main>
        </>
        
    );
};

export default pageSlug;
