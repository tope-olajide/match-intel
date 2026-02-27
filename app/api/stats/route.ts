import { NextResponse } from 'next/server';

export const maxDuration = 120;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { league, homeTeam, awayTeam } = await request.json();

        if (!league || !homeTeam || !awayTeam) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const KIBANA_URL = process.env.ES_KIBANA_ENDPOINT;
        const agentUrl = `${KIBANA_URL}/api/agent_builder/converse`;

        const prompt = `Act as an Elite Sports Intelligence Data Analyst.
        Generate an advanced statistical prediction and betting insights table for ${homeTeam} vs ${awayTeam} in the ${league}.
        Show ONLY the most important stats. Do not hallucinate data; use your best forms, xG, and tools.
        
        Must include the following categories in Markdown tables:
        1. **Probable Winner & Percentage**: E.g. Home 45% | Draw 30% | Away 25%
        2. **Main Markets**: Full Time Result (1X2), Half Time Result, Half Time/Full Time, Double Chance, Draw No Bet.
        3. **Goals-Based Predictions**: Over/Under Total Goals (0.5 to 4.5), BTTS (Yes/No), Team Total Goals (Home/Away), Exact Score, Goal Range, Win to Nil.
        4. **Corner Predictions**: Total Corners O/U, Home/Away Corners O/U, Corner Handicap, Corner Race, Odd/Even.
        5. **Card Predictions**: Total Yellow Cards O/U, Home/Away Yellow, Total Red Cards.
        6. **Shot Predictions**: Total Shots O/U, Shots on Target O/U, Home/Away Shots, Shot Accuracy %.

        Format strictly in Markdown. Summarize complex data into clean, highly readable tables.`;

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
            signal: AbortSignal.timeout(110000)
        });

        if (!agentRes.ok) {
            const err = await agentRes.text();
            console.error('ES Agent Stats Error:', agentRes.status, err);
            return NextResponse.json({ error: `Agent Busy: ${agentRes.status}` }, { status: agentRes.status });
        }

        const data = await agentRes.json();
        return NextResponse.json({ review: data.response.message });

    } catch (error) {
        console.error('Stats API error:', error);
        if (error instanceof Error && error.name === 'TimeoutError') {
            return NextResponse.json({ error: 'The agent is doing a deep-dive and taking longer than usual. Please try again in a moment.' }, { status: 504 });
        }
        return NextResponse.json({ error: 'Analysis engine currently offline.' }, { status: 500 });
    }
}
