# Match Intel - Elite Sports Intelligence Engine

Match Intel is a premium, data-driven football analysis platform powered by **Elasticsearch Agent Builder** and **ES|QL**. It transforms raw historical match data into professional tactical reviews, journalistic news previews, and advanced statistical predictions—all while removing human bias from the game.

## 🚀 Getting Started

### 1. Setup Elastic Cloud
1.  **Create an Account**: Visit [cloud.elastic.co](https://cloud.elastic.co/) and sign up.
2.  **Create a Project**: Setup a new **Serverless** project.
3.  **Create API Key**:
    *   Navigate to: `[your-kibana-url]/app/management/security/api_keys`
    *   Create a new API key with the following JSON configuration:

```json
{
  "football-sync-role": {
    "cluster": [
      "monitor",
      "manage_index_templates",
      "manage_inference",
      "manage_connector"
    ],
    "indices": [
      {
        "names": ["football_matches*"],
        "privileges": [
          "read",
          "write",
          "view_index_metadata",
          "create_index",
          "manage",
          "delete"
        ],
        "allow_restricted_indices": false
      }
    ],
    "applications": [
      {
        "application": "kibana-.kibana",
        "privileges": [
          "feature_agentBuilder.all",
          "feature_actions.all"
        ],
        "resources": ["space:default"]
      }
    ],
    "run_as": [],
    "metadata": {},
    "transient_metadata": {
      "enabled": true
    }
  }
}
```

### 2. Configure the Elite Sports Agent
1.  **Add Tools**: Before creating your agent, add the 19+ custom ES|QL tools provided in `AllTools/tools.json`.
2.  **Create the Agent**:
    *   **Agent ID**: `elite-sports-intelligence-engine`
    *   **Custom Instructions**:
        ```text
        You are Elite Sports Intelligence Engine, a precise and neutral football match analyst.

        Your only job is to follow the exact instruction provided in the user's message.

        The user will always give you:
        - league code (div, e.g. "E0")
        - home_team
        - away_team

        Then they will give you a clear instruction (e.g. "give me match analysis in JSON", "summarize recent form", "create a preview report", etc.).

        Rules:
        - Always use your ES|QL tools when the instruction requires data, stats, trends, form, head-to-head, goals, corners, cards, shots, clean sheets, or any historical insight.
        - Chain multiple tools if needed to give a complete answer.
        - If data is limited or missing, clearly state it.
        - Output ONLY what the instruction asks for — no extra chit-chat, no unsolicited sections.
        - Use clean, structured formatting (Markdown, tables, bullets, JSON) exactly as requested.
        - If no specific format is asked, use clear Markdown sections.
        ```
    *   **Display Description**:
        > An advanced, tool-driven analytical agent designed for sports journalists, professional analysts, and high-level fans. It utilizes multi-step reasoning to synthesize real-time ES|QL match data, including "Expected Threat" (xG) proxies, referee disciplinary patterns, schedule-induced fatigue, and venue-specific performance splits. By automating the research workflow of a senior sports producer, it transforms raw database metrics into professional-grade strategic narratives and tactical briefings.
3.  **Select Tools**: Ensure you select all added ES|QL tools for this agent.

### 3. Local Environment Setup
1.  **Clone the Repo**:
    ```bash
    git clone [your-repo-link]
    cd match-intel
    ```
2.  **Set Environment Variables**: Create a `.env` file in the root directory and add your Elastic credentials:
    ```env
    ES_CLOUD_ID = "Your_Cloud_ID"
    ES_ENDPOINT = "https://your-serverless-endpoint.es.europe-west2.gcp.elastic.cloud:443"
    ES_KIBANA_ENDPOINT = "https://your-kibana-endpoint.kb.europe-west2.gcp.elastic.cloud"
    ES_API_KEY = "Your_API_Key"
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```

## 🛠 Running the App

*   **Development**: `npm run dev`
*   **Production Build**: `npm run build`

### Data Management
Match Intel stays fresh using an automated daily ingestion pipeline.
*   **Manual Sync**: If you can't wait for the Next.js cron job, you can trigger a manual league update by visiting:
    `/api/update-leagues`
*   **Logs**: Monitor your terminal logs to see the ingestion progress in real-time.

## ⚽ Features

*   **Tactical Review**: Instant high-level previews of upcoming matches.
*   **Journalistic News**: Engaging, narrative-driven match articles articles.
*   **Advanced Predictions**: Probabilities and density tables for goals, corners, and cards.
*   **Deep-Dive Chat**: A conversational agent interface for custom research.
*   **Localized History**: Persistent sidebars that save your analysis to `localStorage`.

## 📜 Acknowledgments
*   Data sourced from [football-data.co.uk](http://www.football-data.co.uk/).
*   Powered by the **Elastic Agent Builder** framework.

---
#ElasticHackathon #AgentBuilder #FootballAnalytics
