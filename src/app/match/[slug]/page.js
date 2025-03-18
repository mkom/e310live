//"use client";

import React from "react";
import Pageslug from "@/components/matchPage";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function generateMetadata({ params,searchParams }) {
    const headersList = await headers();
    const referer = headersList.get("referer") || "http://localhost:3000";
    const url = new URL(referer);
    const encodedId = searchParams?.id;

    if (!encodedId) {
      //console.error("❌ ID tidak ditemukan dalam URL query");
      //throw new Error("Missing ID in URL");
    }

    // Decode Base64
    const decodeBase64 = (base64Str) => {
      try {
        return Buffer.from(base64Str, "base64").toString("utf-8");
      } catch (error) {
        //console.error("❌ Error saat decoding Base64:", error.message);
        //return "invalid-id";
      }
    };

    const decodedId = decodeBase64(encodedId);
   // console.log("Decoded ID:", decodedId);

    // Fetch data dari API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/matches/football?id=${encodeURIComponent(decodedId)}`;

 
  try {
   

    const response = await fetch(apiUrl, {
      headers: {
        "x-secret-key": process.env.NEXT_PUBLIC_SECRET_KEY,
      },
      cache: "no-store",
    });

    if (!response.ok) {
     // console.error("❌ Gagal fetch data dari API:", response.status);
      throw new Error("Failed to fetch match data");
    }

    const data = await response.json();
    //console.log("Match Data:", data);

    if (!data.length) throw new Error("No match data found");

    return {
      title: `${data[0].title} - Free Live Streaming - e310.live`,
      description: `Watch live football streaming in HD for free between ${data[0].teams?.home?.name || "Unknown"} and ${data[0].teams?.away?.name || "Unknown"} live.`,
      keywords: `${data[0].teams?.home?.name} ${data[0].title} free football live stream, watch soccer online, premier league live, la liga streams, bundesliga live, serie a live, champions league live, hd sports streaming`,
      "theme-color": "#ffffff",
    };
  } catch (error) {
    //console.error("❌ Metadata Error:", error.message);
    return {
        title: "Watch Football Live Streaming | Free HD Sports Streams - e310.live",
        description: "Watch live football streaming in HD for free. Enjoy Premier League, La Liga, Bundesliga, Serie A, and more. No sign-up required at e310.live!",
        keywords: "free football live stream, watch soccer online, premier league live, la liga streams, bundesliga live, serie a live, champions league live, hd sports streaming",
        "theme-color": "#ffffff",
    };
  }
}

const MatchPage = () => {

    return (
        <Pageslug/>
        
    );
};

export default MatchPage;
