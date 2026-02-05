import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const backendUrl = process.env.BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/rounds/status`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch round status' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
