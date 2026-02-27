import { NextResponse } from 'next/server';

// 🟢 Extend Vercel/Next.js execution limit
export const maxDuration = 120;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { league, homeTeam, awayTeam } = await request.json();

        const KIBANA_URL = process.env.ES_KIBANA_ENDPOINT;
        const agentUrl = `${KIBANA_URL}/api/agent_builder/converse`;

        // 🟢 OPTIMIZED PROMPT: This tells the agent to be efficient.
        // Specifying "prioritize core tools" prevents it from looping too many times.
        const prompt = `Act as an Elite Sports Intelligence Engine. 
        Perform a focused pre-match analysis for ${homeTeam} vs ${awayTeam} in the ${league}. 
        Use your best tools for form and xG. Output strictly in Markdown.`;

        const agentRes = await fetch(agentUrl, {
            method: 'POST',
            headers: {
                'Authorization': `ApiKey ${process.env.ES_API_KEY}`,
                'Content-Type': 'application/json',
                'kbn-xsrf': 'true',
            },
            body: JSON.stringify({
                input: prompt,
                agent_id: 'elite-sports-intelligence-engine'
            }),
            // 🟢 INCREASED TIMEOUT: Giving it nearly 2 minutes to work
            signal: AbortSignal.timeout(110000)
        });

        if (!agentRes.ok) {
            const err = await agentRes.text();
            return NextResponse.json({ error: `Agent Busy: ${agentRes.status}` }, { status: agentRes.status });
        }

        const data = await agentRes.json();
        console.log({ data })
        return NextResponse.json({ review: data.response.message });

    } catch (error) {
        console.error('API error:', error);
        if (error instanceof Error && error.name === 'TimeoutError') {
            return NextResponse.json({ error: 'The agent is doing a deep-dive and taking longer than usual. Please try again in a moment.' }, { status: 504 });
        }
        return NextResponse.json({ error: 'Analysis engine currently offline.' }, { status: 500 });
    }
}