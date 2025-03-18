// app/api/events/route.js

export async function GET(req) {
    const secretKey = req.headers.get('x-secret-key');
    if (secretKey !== process.env.SECRET_KEY) {
        return new Response('Forbidden', { status: 403 });
    }

    try {
      const url = new URL(req.url);
      const homeQuery = url.searchParams.get("home");
      const awayQuery = url.searchParams.get("away");

      const response = await fetch('http://159.65.15.240/events.json');
      const data = await response.json();
  
      // Jika tidak ada filter, kembalikan semua data
      if (!homeQuery && !awayQuery) {
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Jika ada filter, lakukan pencarian berdasarkan home & away
      const filteredData = data.filter(event =>
        (!homeQuery || event.home.toLowerCase() === homeQuery.toLowerCase()) &&
        (!awayQuery || event.away.toLowerCase() === awayQuery.toLowerCase())
      );

      //console.log(data)

      return new Response(JSON.stringify(filteredData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
      });

    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Error fetching data' }),
        { status: 500 }
      );
    }
  }
  