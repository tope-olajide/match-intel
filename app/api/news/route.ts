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

        const prompt = `Act as an Elite Sports Journalist.
        Generate a compelling, news-style match preview article for ${homeTeam} vs ${awayTeam} in the ${league}.
        Note: The league is provided as "Code (League Name)". Always use the full human-readable league name in your output, not just the code.
        The tone should be professional, engaging, and neutral. Do not provide betting advice or state predictions as certainties.
        
        Focus on:
        1. **Catchy Headline**: A journalistic title for the match.
        2. **Introduction**: Setting the stage and significance of the match.
        3. **Recent Form**: Highlights of how both teams have performed lately.
        4. **Key Storylines**: Injuries, tactical battles, or historical rivalries.
        5. **Balanced Conclusion**: A summary of what to expect without being biased.

        Format strictly in clean Markdown with appropriate headers.`;

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
            console.error('ES Agent News Error:', agentRes.status, err);
            return NextResponse.json({ error: `Agent Busy: ${agentRes.status}` }, { status: agentRes.status });
        }

        const data = await agentRes.json();
        return NextResponse.json({ review: data.response.message });

    } catch (error: any) {
        console.error('News API error:', error);
        if (error instanceof Error && error.name === 'TimeoutError') {
            return NextResponse.json({ error: 'The agent is gathering news and taking longer than usual. Please try again in a moment.' }, { status: 504 });
        }
        return NextResponse.json({ error: 'News engine currently offline.' }, { status: 500 });
    }
}
