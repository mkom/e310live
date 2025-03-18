import fetch from 'node-fetch';

export async function GET(req) {
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response('URL parameter is required', { status: 400 });
  }

  try {
    // Mengambil konten dari URL tujuan
    const response = await fetch(targetUrl, {
      headers: {
        // Header tambahan jika perlu, misalnya untuk memalsukan referer atau user-agent
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html',
      },
    });

    const content = await response.text();

    // Mengirimkan konten kembali ke frontend
    return new Response(content, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    return new Response('Error fetching URL', { status: 500 });
  }
}
