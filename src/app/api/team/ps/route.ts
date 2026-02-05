
export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const authToken = authHeader?.split(' ')[1];

  if (!authToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();

  const rep = await fetch(`${process.env.BASE_URL}/teams/submit-ps`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!rep.ok) {
    const errorData = await rep.json().catch(() => ({ error: 'Unknown backend error' }));
    return new Response(JSON.stringify(errorData), { status: rep.status });
  }

  const updatedTeam = await rep.json();
  return new Response(JSON.stringify(updatedTeam), { status: 200 });
}