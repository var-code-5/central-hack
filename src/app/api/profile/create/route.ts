export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const authToken = authHeader?.split(' ')[1];
  
  if (!authToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await request.json();

    const rep = await fetch(`${process.env.BASE_URL}/users/create-profile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!rep.ok) {
      const errorData = await rep.json().catch(() => ({}));
      console.error('Backend error:', rep.status, errorData);
      return new Response(JSON.stringify({ 
        error: errorData.message || 'Failed to create user profile',
        details: errorData
      }), { status: rep.status });
    }

    const createdProfile = await rep.json();
    return new Response(JSON.stringify(createdProfile), { status: 200 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500 });
  }
}