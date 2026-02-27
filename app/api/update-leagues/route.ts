
import { NextResponse } from 'next/server';
import { Client } from '@elastic/elasticsearch';
// @ts-ignore
import { parse } from 'csv-parse/sync';


// Using Endpoint + API Key as requested
const ES_ENDPOINT = process.env.ES_ENDPOINT || process.env.ES_NODE;
const ES_API_KEY = process.env.ES_API_KEY;

const INDEX_NAME = 'football_matches';

// List of leagues to sync (Main leagues use 2526, others use 'new')
// Using the logic from your frontend:
const MAIN_LEAGUES = [
    "E0", "E1", "E2", "E3", "EC", "SC0", "SC1", "SC2", "SC3",
    "D1", "D2", "I1", "I2", "SP1", "SP2", "F1", "F2", "N1", "B1", "P1", "T1", "G1"
];
// You can expand this array to include all leagues you want to sync
const LEAGUES_TO_SYNC = [
    "E0", "E1", "E2", "E3", "EC", "SC0", "SC1", "SC2", "SC3",
    "D1", "D2", "I1", "I2", "SP1", "SP2", "F1", "F2", "N1", "B1", "P1", "T1", "G1",
    "ARG", "AUT", "BRA", "CHN", "DNK", "FIN", "IRL", "JPN", "MEX", "NOR", "POL", "ROU", "RUS", "SWE", "SUI", "USA"
];

// Initialize ES Client
const getClient = () => {
    if (ES_ENDPOINT && ES_API_KEY) {
        return new Client({
            node: ES_ENDPOINT,
            auth: { apiKey: ES_API_KEY }
        });
    }

    // Fallback for local dev or other auth methods if needed
    // if (ES_CLOUD_ID && ES_PASSWORD) { ... }

    // Default fallback to local
    return new Client({
        node: 'http://localhost:9200'
    });
};

export const dynamic = 'force-dynamic'; // Ensure this endpoint isn't cached

export async function GET(request: Request) {
    // Optional: Check for a secret token header to secure this endpoint (good practice for cron jobs)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    const client = getClient();
    const results = [];

    try {
        // Ensure index exists
        const indexExists = await client.indices.exists({ index: INDEX_NAME });
        if (!indexExists) {
            await client.indices.create({ index: INDEX_NAME });
            console.log(`Created index ${INDEX_NAME}`);
        }
    } catch (err) {
        console.error("Error checking/creating index:", err);
        // Continue, as it might just be connection issue or already exists
    }

    for (const leagueCode of LEAGUES_TO_SYNC) {
        try {
            // 1. Determine CSV URL
            let csvUrl = "";
            if (MAIN_LEAGUES.includes(leagueCode)) {
                csvUrl = `https://www.football-data.co.uk/mmz4281/2526/${leagueCode}.csv`;
            } else {
                csvUrl = `https://www.football-data.co.uk/new/${leagueCode}.csv`;
            }

            console.log(`Processing ${leagueCode} from ${csvUrl}...`);

            // 2. Fetch CSV
            const response = await fetch(csvUrl);
            if (!response.ok) {
                results.push({ league: leagueCode, status: 'error', message: `Failed to fetch CSV: ${response.statusText}` });
                continue;
            }
            const csvText = await response.text();

            // 3. Parse CSV
            const records = parse(csvText, {
                columns: true,
                skip_empty_lines: true,
                trim: true
            });

            if (records.length === 0) {
                results.push({ league: leagueCode, status: 'skipped', message: 'CSV is empty' });
                continue;
            }

            // 4. Get Latest CSV Date (Assuming 'Date' column exists and is DD/MM/YYYY or similar)
            // We need to standardize Date to YYYY-MM-DD for ES sorting
            // Football-data.co.uk usually uses DD/MM/YY or DD/MM/YYYY
            const parseDate = (dateStr: string) => {
                if (!dateStr) return null;
                const parts = dateStr.split('/');
                if (parts.length !== 3) return null;
                let [day, month, year] = parts;
                if (year.length === 2) year = `20${year}`;
                return `${year}-${month}-${day}`;
            }

            // Add ISO date to records and sort to find latest
            let validRecords = records.map((r: any) => {
                const isoDate = parseDate(r.Date);
                return { ...r, isoDate, leagueCode }; // Add leagueCode to doc
            }).filter((r: any) => r.isoDate);

            if (validRecords.length === 0) {
                results.push({ league: leagueCode, status: 'skipped', message: 'No valid dates found in CSV' });
                continue;
            }

            // Sort descending to find latest date in CSV
            validRecords.sort((a: any, b: any) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
            const latestCsvDate = validRecords[0].isoDate;

            // 5. Query ES for Latest Date
            let latestEsDate = null;
            try {
                const esResponse = await client.search({
                    index: INDEX_NAME,
                    size: 1,
                    sort: [{ isoDate: "desc" }],
                    query: {
                        match: { leagueCode: leagueCode }
                    }
                });

                // @ts-ignore
                if (esResponse.hits.hits.length > 0) {
                    // @ts-ignore
                    latestEsDate = esResponse.hits.hits[0]._source.isoDate;
                }
            } catch (e) {
                console.warn(`Could not fetch latest date from ES for ${leagueCode} (might be first run)`);
            }

            // 6. Compare & Sync
            if (!latestEsDate || new Date(latestCsvDate) > new Date(latestEsDate)) {
                console.log(`New data found for ${leagueCode}. ES: ${latestEsDate}, CSV: ${latestCsvDate}. Syncing...`);

                // Prepare Bulk Body
                const body = validRecords.flatMap((doc: any) => {
                    // Create a unique ID to avoid duplicates: Date_HomeTeam_AwayTeam
                    const docId = `${doc.isoDate}_${doc.HomeTeam}_${doc.AwayTeam}`.replace(/\s+/g, '');

                    return [
                        { index: { _index: INDEX_NAME, _id: docId } },
                        doc
                    ]
                });

                if (body.length > 0) {
                    const bulkResponse = await client.bulk({ refresh: true, body });

                    if (bulkResponse.errors) {
                        const erroredDocuments: any[] = [];
                        // @ts-ignore
                        bulkResponse.items.forEach((action: any, i: number) => {
                            const operation = Object.keys(action)[0];
                            if (action[operation].error) {
                                erroredDocuments.push({
                                    // @ts-ignore
                                    status: action[operation].status,
                                    // @ts-ignore
                                    error: action[operation].error,
                                });
                            }
                        });
                        results.push({ league: leagueCode, status: 'partial_error', message: `Synced with errors`, errors: erroredDocuments });
                    } else {
                        results.push({ league: leagueCode, status: 'updated', count: validRecords.length, latestDate: latestCsvDate });
                    }
                } else {
                    results.push({ league: leagueCode, status: 'skipped', message: 'No records to sync' });
                }

            } else {
                results.push({ league: leagueCode, status: 'up_to_date', latestDate: latestEsDate });
            }

        } catch (error: any) {
            console.error(`Error processing ${leagueCode}:`, error);
            results.push({ league: leagueCode, status: 'error', message: error.message });
        }
    }

    return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        results
    });
}
