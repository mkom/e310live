import { NextResponse } from "next/server";

let cachedData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

export async function GET(req) {
  const secretKey = req.headers.get('x-secret-key');
  if (secretKey !== process.env.SECRET_KEY) {
    return new Response('Forbidden', { status: 403 });
  }

  const currentTime = Date.now();
  const url = new URL(req.url);
  const id = url.searchParams.get("id"); // Get the 'id' parameter from the URL

  //console.log(id);

  if (cachedData && currentTime - lastFetchTime < CACHE_DURATION) {
    // If cached data exists and is still valid, filter by id if provided
    if (id) {
      const filteredData = cachedData.filter(match => match.id === id);
      if (filteredData.length === 0) {
        return NextResponse.json({ error: 'Match not found' }, { status: 404 });
      }
      return NextResponse.json(filteredData);
    }
    
    return NextResponse.json(cachedData);
  }

  try {
    const response = await fetch("https://streamed.su/api/matches/football", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    cachedData = await response.json();
    lastFetchTime = currentTime;

    // Filter by id if provided
    if (id) {
      const filteredData = cachedData.filter(match => match.id === id);
      if (filteredData.length === 0) {
        return NextResponse.json({ error: 'Match not found' }, { status: 404 });
      }
      return NextResponse.json(filteredData);
    }
    

    return NextResponse.json(cachedData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
