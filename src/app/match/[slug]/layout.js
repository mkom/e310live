import { Poppins } from "next/font/google";
import { Inter } from "next/font/google";
import { TopNavbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "../../../app/globals.css";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

const poppins = Poppins({
  subsets: ["latin"],
  weight:["300","400","500","600","700"]
})

const inter = Inter({
  subsets: ["latin"],
  weight:["300","400","500","600","700"]
})



export async function generateMetadata({ params }) {
  try {
    const headersList = await headers();
    const referer = headersList.get("referer") || "http://localhost:3000";
    const url = new URL(referer);
    const encodedId = url.searchParams.get("id");

    if (!encodedId) {
      //console.error("❌ ID tidak ditemukan dalam URL query");
      throw new Error("Missing ID in URL");
    }

    // Decode Base64
    const decodeBase64 = (base64Str) => {
      try {
        return Buffer.from(base64Str, "base64").toString("utf-8");
      } catch (error) {
        console.error("❌ Error saat decoding Base64:", error.message);
        return "invalid-id";
      }
    };

    const decodedId = decodeBase64(encodedId);
   // console.log("Decoded ID:", decodedId);

    // Fetch data dari API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/matches/football?id=${encodeURIComponent(decodedId)}`;

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
      title: "Match Not Found",
      description: "The requested match could not be found.",
    };
  }
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
