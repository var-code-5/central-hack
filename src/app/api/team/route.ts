export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const authToken = authHeader?.split(' ')[1];
  
  if (!authToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const rep = await fetch(`${process.env.BASE_URL}/teams/get-team`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!rep.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch user profile' }), { status: 500 });
  }

  const userProfile = await rep.json();
  return new Response(JSON.stringify(userProfile), { status: 200 });
}