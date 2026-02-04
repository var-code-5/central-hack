
export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const authToken = authHeader?.split(' ')[1];

  if (!authToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();
  console.log(body);

  const rep = await fetch(`${process.env.BASE_URL}/submissions/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  console.log(rep);

  if (!rep.ok) {
    const errorData = await rep.json().catch(() => ({ error: 'Unknown backend error' }));
    return new Response(JSON.stringify(errorData), { status: rep.status });
  }

  const updatedProfile = await rep.json();
  return new Response(JSON.stringify(updatedProfile), { status: 200 });
}