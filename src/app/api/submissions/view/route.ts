import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backendUrl = process.env.BASE_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/submissions/view`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch team data' }, { status: response.status });
    }

    const data = await response.json();

    // transform data to return 'roundStatus' keyed by round
    // Backend returns team object with roundXStatus
    // We can just return the Team object which has everything we need.

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}