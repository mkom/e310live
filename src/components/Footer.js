"use client";
import React from "react";
import { useEffect, useState } from 'react';
import {
  Typography
} from "@material-tailwind/react";
 
export function Footer() {
   
    return (
        <footer className=" w-full mx-auto max-w-screen-xl py-8 rounded-none ">
        <div className="container mx-auto">
          <Typography
          variant="small"
          className="text-center"
          >
            Watch live football streaming in HD for free. Enjoy Premier League, La Liga, Bundesliga, Serie A, and more. No sign-up required at e310.live!.
          </Typography>
        </div>
        </footer>
    );
}