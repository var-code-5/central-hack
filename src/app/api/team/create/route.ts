export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const authToken = authHeader?.split(' ')[1];
  
  if (!authToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();

  const rep = await fetch(`${process.env.BASE_URL}/teams/create-team`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!rep.ok) {
    console.log(rep);
    return new Response(JSON.stringify({ error: 'Failed to create team' }), { status: 500 });
  }

  const createdTeam = await rep.json();
  return new Response(JSON.stringify(createdTeam), { status: 200 });
}