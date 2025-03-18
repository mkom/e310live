"use client";
import { MatchList } from "@/components/MatchList2";

export default function Home() {
  return (
    <main className="my-4 px-4 xl:px-8">
        <div className="container max-w-screen-xl mx-auto ">
          <MatchList />
        </div>
        
    </main>
  );
}
