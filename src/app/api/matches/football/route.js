import { NextResponse } from "next/server";

let cachedData = null;
let lastFetchTime = 0;
const UPDATE_INTERVAL = 60 * 60 * 1000; // 1 jam dalam milidetik

function getNextUpdateTime() {
  return lastFetchTime + UPDATE_INTERVAL;
}

export async function GET(req) {
  const secretKey = req.headers.get("x-secret-key");

  if (secretKey !== process.env.SECRET_KEY) {
    return new Response("Forbidden", { status: 403 });
  }

  const currentTime = Date.now();
  const nextUpdateTime = getNextUpdateTime();
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (cachedData && currentTime < nextUpdateTime) {
    if (id) {
      const filteredData = cachedData.filter((match) => match.id === id);
      if (filteredData.length === 0) {
        return NextResponse.json({ error: "Match not found" }, { status: 404 });
      }
      return NextResponse.json(filteredData);
    }

    return NextResponse.json(cachedData);
  }

  try {
    const response = await fetch("https://streamed.su/api/matches/football/", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    cachedData = await response.json();
    lastFetchTime = currentTime;

    if (id) {
      const filteredData = cachedData.filter((match) => match.id === id);
      if (filteredData.length === 0) {
        return NextResponse.json({ error: "Match not found" }, { status: 404 });
      }
      return NextResponse.json(filteredData);
    }

    return NextResponse.json(cachedData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
