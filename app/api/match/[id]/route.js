export async function GET(request, { params }) {
  const { id } = params;

  try {
    const res = await fetch(
      `https://api.football-data.org/v4/matches/${id}`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY,
          'X-Unfold-Lineups': 'true',
          'X-Unfold-Goals': 'true',
          'X-Unfold-Bookings': 'true',
          'X-Unfold-Subs': 'true',
        },
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) {
      return Response.json(
        { error: `football-data API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: 'Failed to reach football-data API' }, { status: 500 });
  }
}