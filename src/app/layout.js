import { Poppins } from "next/font/google";
import { Inter } from "next/font/google";
import { TopNavbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight:["300","400","500","600","700"]
})

const inter = Inter({
  subsets: ["latin"],
  weight:["300","400","500","600","700"]
})


export const metadata = {
  title: "Watch Football Live Streaming | Free HD Sports Streams - e310.live",
  description: "Watch live football streaming in HD for free. Enjoy Premier League, La Liga, Bundesliga, Serie A, and more. No sign-up required at e310.live!",
  keywords: "free football live stream, watch soccer online, premier league live, la liga streams, bundesliga live, serie a live, champions league live, hd sports streaming",
  "theme-color": "#ffffff",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleAnalytics />
      <body
        className={`${poppins.className} antialiased bg-white  text-blue-gray-900`}
      >
        <div className="flex flex-col min-h-screen">
        <TopNavbar/>
        {children}
        <Footer/>
        </div>
        
      </body>
      {/* <GoogleAnalytics gaId="G-ESYHPCFEXR" /> */}
    </html>
  );
}
