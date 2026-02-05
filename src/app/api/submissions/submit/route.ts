
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

  if (!rep.ok) {
    const resp = await rep.json();
    console.log(resp);
    const errorData = resp.error || { message: 'Failed to submit submission' };
    return new Response(JSON.stringify(errorData), { status: rep.status });
  }

  const updatedProfile = await rep.json();
  return new Response(JSON.stringify(updatedProfile), { status: 200 });
}