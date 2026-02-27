import { NextResponse } from 'next/server';

export const maxDuration = 120;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const KIBANA_URL = process.env.ES_KIBANA_ENDPOINT;
        const agentUrl = `${KIBANA_URL}/api/agent_builder/converse`;

        const agentRes = await fetch(agentUrl, {
            method: 'POST',
            headers: {
                'Authorization': `ApiKey ${process.env.ES_API_KEY}`,
                'Content-Type': 'application/json',
                'kbn-xsrf': 'true',
            },
            body: JSON.stringify({
                input: message,
                agent_id: 'elite-sports-intelligence-engine'
            }),
            signal: AbortSignal.timeout(110000)
        });

        if (!agentRes.ok) {
            const err = await agentRes.text();
            console.error('ES Agent Error:', agentRes.status, err);
            return NextResponse.json({ error: `Agent Busy: ${agentRes.status}` }, { status: agentRes.status });
        }

        const data = await agentRes.json();
        return NextResponse.json({ reply: data.response.message });

    } catch (error) {
        console.error('Chat API error:', error);
        if (error instanceof Error && error.name === 'TimeoutError') {
            return NextResponse.json({ error: 'The agent is doing a deep-dive and taking longer than usual. Please try again in a moment.' }, { status: 504 });
        }
        return NextResponse.json({ error: 'Analysis engine currently offline.' }, { status: 500 });
    }
}
