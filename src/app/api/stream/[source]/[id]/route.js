import { NextResponse } from "next/server";

const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 jam dalam milidetik
const cache = new Map(); // Simpan cache di memori

export async function GET(req, { params }) {
    const secretKey = req.headers.get('x-secret-key');
    if (secretKey !== process.env.SECRET_KEY) {
        return new Response('Forbidden', { status: 403 });
    }
  const { source, id } = params;

  if (!source || !id) {
    return NextResponse.json({ error: "Missing source or id" }, { status: 400 });
  }

  const cacheKey = `${source}/${id}`;
  const currentTime = Date.now();

  // Cek apakah data ada di cache dan masih valid
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (currentTime - timestamp < CACHE_DURATION) {
      return NextResponse.json(data);
    }
  }

  try {
    const response = await fetch(`https://streamed.su/api/stream/${source}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stream data: ${response.status}`);
    }

    const data = await response.json();

    // Simpan ke cache
    cache.set(cacheKey, { data, timestamp: currentTime });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
