import { NextResponse } from "next/server";

export async function GET(req, { params }) {
//     const secretKey = req.headers.get('x-secret-key');
//     if (secretKey !== process.env.SECRET_KEY) {
//         return new Response('Forbidden', { status: 403 });
// }

  const { id } = params;

  const imageUrl = `https://streamed.su/api/images/badge/${id}.webp`;

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": "public, max-age=21600", // Cache 6 jam
        },
      });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
