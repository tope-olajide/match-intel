
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HistorySidebar, HistoryItem } from "@/components/HistorySidebar";
import { footballData } from "@/app/data/footballData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const [selectedHomeTeam, setSelectedHomeTeam] = useState<string>("");
  const [selectedAwayTeam, setSelectedAwayTeam] = useState<string>("");
  const [matchReview, setMatchReview] = useState<string>("");
  const [isReviewLoading, setIsReviewLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const handleSelectHistory = (item: HistoryItem) => {
    setSelectedCountry(item.data.country);
    setSelectedLeague(item.data.league);
    setSelectedHomeTeam(item.data.homeTeam);
    setSelectedAwayTeam(item.data.awayTeam);
    setMatchReview(item.data.review);
  };

  const countries = Object.keys(footballData).sort();

  const leagues = selectedCountry
    ? footballData[selectedCountry]
    : [];

  // Find the selected league object to get teams and name
  const currentLeague = leagues.find(l => l.code === selectedLeague);
  const teams = currentLeague ? currentLeague.teams : [];

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedLeague("");
    setSelectedHomeTeam("");
    setSelectedAwayTeam("");
    setMatchReview("");
  };

  const handleLeagueChange = (value: string) => {
    setSelectedLeague(value);
    setSelectedHomeTeam("");
    setSelectedAwayTeam("");
    setMatchReview("");
  };

  const handleHomeTeamChange = (value: string) => {
    setSelectedHomeTeam(value);
    setSelectedAwayTeam("");
    setMatchReview("");
  };

  const handleAwayTeamChange = (value: string) => {
    setSelectedAwayTeam(value);
    setMatchReview("");
  };

  const handleGetMatchReview = async () => {
    if (!selectedLeague || !selectedHomeTeam || !selectedAwayTeam) return;

    setIsReviewLoading(true);
    setMatchReview("");

    const leagueName = currentLeague?.name || selectedLeague;
    const leagueWithContext = `${selectedLeague} (${leagueName})`;

    try {
      const response = await fetch("/api/match-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          league: leagueWithContext,
          homeTeam: selectedHomeTeam,
          awayTeam: selectedAwayTeam,
        }),
      });

      const data = await response.json();
      if (data.review) {
        setMatchReview(data.review);
        // Save to History
        const historyItem: HistoryItem = {
          id: Date.now().toString(),
          title: `${selectedHomeTeam} vs ${selectedAwayTeam}`,
          timestamp: new Date().toISOString(),
          data: {
            country: selectedCountry,
            league: selectedLeague,
            homeTeam: selectedHomeTeam,
            awayTeam: selectedAwayTeam,
            review: data.review
          }
        };
        const existing = JSON.parse(localStorage.getItem("match_review_history") || "[]");
        localStorage.setItem("match_review_history", JSON.stringify([historyItem, ...existing]));
        window.dispatchEvent(new Event("local-storage-update"));
      } else if (data.error) {
        setMatchReview(`**Error:** ${data.error}`);
      }
    } catch (error) {
      console.error("Error fetching match review:", error);
      setMatchReview("**Error:** Failed to connect to the analysis engine. Please check your connection and credentials.");
    } finally {
      setIsReviewLoading(false);
    }
  };


  return (
    <div className="flex w-full lg:h-[calc(100vh-4rem)]">
      <HistorySidebar
        storageKey="match_review_history"
        onSelectHistory={handleSelectHistory}
        title="Review History"
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main className="flex-1 flex flex-col items-center p-4 md:p-8 overflow-y-auto w-full">
        <div className="z-10 w-full max-w-4xl flex flex-col space-y-8 pb-12">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 w-full">
            <h1 className="text-2xl font-bold text-center mb-2 text-slate-800 tracking-tight">Match Review</h1>
            <p className="text-center text-slate-500 mb-6 font-medium">Select a match to view details</p>

            <div className="space-y-6">
              {/* Country Select */}
              <div className="space-y-2">
                <Label htmlFor="country" className="text-slate-600 font-semibold">Country</Label>
                <Select onValueChange={handleCountryChange} value={selectedCountry}>
                  <SelectTrigger id="country" className="w-full h-11 border-slate-200 focus:ring-slate-400">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* League Select */}
              {selectedCountry && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="league" className="text-slate-600 font-semibold">League</Label>
                  <Select onValueChange={handleLeagueChange} value={selectedLeague}>
                    <SelectTrigger id="league" className="w-full h-11 border-slate-200 focus:ring-slate-400">
                      <SelectValue placeholder="Select League" />
                    </SelectTrigger>
                    <SelectContent>
                      {leagues.map((league) => (
                        <SelectItem key={league.code} value={league.code}>
                          {league.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Teams Select Row */}
              {selectedLeague && (
                <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="home-team" className="text-slate-600 font-semibold">Home Team</Label>
                    <Select onValueChange={handleHomeTeamChange} value={selectedHomeTeam}>
                      <SelectTrigger id="home-team" className="w-full h-11 border-slate-200 focus:ring-slate-400">
                        <SelectValue placeholder="Select Home Team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team} value={team}>
                            {team}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 flex-1">
                    <Label htmlFor="away-team" className="text-slate-600 font-semibold">Away Team</Label>
                    <Select onValueChange={handleAwayTeamChange} value={selectedAwayTeam}>
                      <SelectTrigger id="away-team" className="w-full h-11 border-slate-200 focus:ring-slate-400">
                        <SelectValue placeholder="Select Away Team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams
                          .filter(t => t !== selectedHomeTeam)
                          .map((team) => (
                            <SelectItem key={team} value={team}>
                              {team}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* Selection Summary */}
            {selectedCountry && selectedLeague && selectedHomeTeam && selectedAwayTeam && (
              <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl text-center animate-in zoom-in duration-300">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="h-px w-8 bg-slate-200"></span>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Selected Match</p>
                  <span className="h-px w-8 bg-slate-200"></span>
                </div>
                <p className="text-sm font-semibold text-slate-500 mb-4 bg-white py-1 px-3 rounded-full border border-slate-100 shadow-sm inline-block">
                  {selectedCountry} <span className="text-slate-300 mx-1">/</span> {currentLeague?.name}
                </p>
                <div className="flex flex-col gap-2 items-center justify-center">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">{selectedHomeTeam}</span>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-4 bg-slate-200"></span>
                    <span className="text-[10px] font-black text-slate-400 border border-slate-200 rounded-md px-1.5 py-0.5">VS</span>
                    <span className="h-px w-4 bg-slate-200"></span>
                  </div>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">{selectedAwayTeam}</span>
                </div>

                <Button
                  onClick={handleGetMatchReview}
                  disabled={isReviewLoading}
                  className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-6 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isReviewLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing Match...</span>
                    </div>
                  ) : (
                    "Get Match Review"
                  )}
                </Button>
              </div>
            )}

            {/* Match Analysis Markdown Result */}
            {(matchReview || isReviewLoading) && (
              <div className="mt-12 border-t border-slate-100 pt-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <h2 className="text-lg font-bold text-slate-800">Elite Intelligence Analysis</h2>
                </div>

                {isReviewLoading ? (
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
                    <div className="h-32 bg-slate-100 rounded w-full animate-pulse"></div>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none 
                prose-headings:text-slate-900 prose-p:text-slate-600 
                prose-strong:text-slate-900 prose-li:text-slate-600
                prose-table:border prose-table:border-slate-200 prose-thead:bg-slate-50
                prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2 prose-td:border-t prose-td:border-slate-100">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{matchReview}</ReactMarkdown>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
