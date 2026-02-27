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
import { AlertCircle } from "lucide-react";

export default function StatsPage() {
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
    const leagues = selectedCountry ? footballData[selectedCountry] : [];
    const currentLeague = leagues.find(l => l.code === selectedLeague);
    const teams = currentLeague ? currentLeague.teams : [];

    const handleGetMatchStats = async () => {
        if (!selectedLeague || !selectedHomeTeam || !selectedAwayTeam) return;

        setIsReviewLoading(true);
        setMatchReview("");

        try {
            const response = await fetch("/api/stats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    league: selectedLeague,
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
                    title: `Stats: ${selectedHomeTeam} vs ${selectedAwayTeam}`,
                    timestamp: new Date().toISOString(),
                    data: {
                        country: selectedCountry,
                        league: selectedLeague,
                        homeTeam: selectedHomeTeam,
                        awayTeam: selectedAwayTeam,
                        review: data.review
                    }
                };
                const existing = JSON.parse(localStorage.getItem("stats_history") || "[]");
                localStorage.setItem("stats_history", JSON.stringify([historyItem, ...existing]));
                window.dispatchEvent(new Event("local-storage-update"));
            } else if (data.error) {
                setMatchReview(`**Error:** ${data.error}`);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
            setMatchReview("**Error:** Failed to connect to Analysis Engine.");
        } finally {
            setIsReviewLoading(false);
        }
    };

    return (
        <div className="flex w-full lg:h-[calc(100vh-4rem)]">
            <HistorySidebar
                storageKey="stats_history"
                onSelectHistory={handleSelectHistory}
                title="Prediction History"
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="flex-1 flex flex-col items-center p-4 md:p-8 overflow-y-auto w-full">
                <div className="z-10 w-full max-w-4xl flex flex-col space-y-8 pb-12">
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 w-full">
                        <h1 className="text-2xl font-bold text-center mb-2 text-slate-800 tracking-tight">Stats & Predictions</h1>
                        <p className="text-center text-slate-500 mb-6 font-medium text-sm">Advanced analytical forecasting and metrics</p>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="country" className="text-slate-600 font-semibold">Country</Label>
                                <Select onValueChange={(v) => { setSelectedCountry(v); setSelectedLeague(""); setSelectedHomeTeam(""); setSelectedAwayTeam(""); }} value={selectedCountry}>
                                    <SelectTrigger id="country" className="w-full h-11 border-slate-200 focus:ring-slate-400">
                                        <SelectValue placeholder="Select Country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country} value={country}>{country}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedCountry && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <Label htmlFor="league" className="text-slate-600 font-semibold">League</Label>
                                    <Select onValueChange={(v) => { setSelectedLeague(v); setSelectedHomeTeam(""); setSelectedAwayTeam(""); }} value={selectedLeague}>
                                        <SelectTrigger id="league" className="w-full h-11 border-slate-200 focus:ring-slate-400">
                                            <SelectValue placeholder="Select League" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {leagues.map((league) => (
                                                <SelectItem key={league.code} value={league.code}>{league.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {selectedLeague && (
                                <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-2 flex-1">
                                        <Label htmlFor="home-team" className="text-slate-600 font-semibold">Home Team</Label>
                                        <Select onValueChange={(v) => { setSelectedHomeTeam(v); setSelectedAwayTeam(""); }} value={selectedHomeTeam}>
                                            <SelectTrigger id="home-team" className="w-full h-11 border-slate-200 focus:ring-slate-400">
                                                <SelectValue placeholder="Select Home" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {teams.map((team) => (
                                                    <SelectItem key={team} value={team}>{team}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2 flex-1">
                                        <Label htmlFor="away-team" className="text-slate-600 font-semibold">Away Team</Label>
                                        <Select onValueChange={setSelectedAwayTeam} value={selectedAwayTeam}>
                                            <SelectTrigger id="away-team" className="w-full h-11 border-slate-200 focus:ring-slate-400">
                                                <SelectValue placeholder="Select Away" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {teams.filter(t => t !== selectedHomeTeam).map((team) => (
                                                    <SelectItem key={team} value={team}>{team}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {selectedCountry && selectedLeague && selectedHomeTeam && selectedAwayTeam && (
                            <div className="mt-8">
                                <Button
                                    onClick={handleGetMatchStats}
                                    disabled={isReviewLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                                >
                                    {isReviewLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Generating Prediction...</span>
                                        </div>
                                    ) : (
                                        "Get Match Prediction"
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* Prediction Engine Output */}
                        {(matchReview || isReviewLoading) && (
                            <div className="mt-12 border-t border-slate-100 pt-8 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
                                    <h2 className="text-xl font-bold text-slate-800">Prediction Engine Output</h2>
                                </div>

                                {isReviewLoading ? (
                                    <div className="space-y-4">
                                        <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                                        <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                                        <div className="h-64 bg-slate-100 rounded w-full animate-pulse"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="prose prose-slate max-w-none 
                    prose-headings:text-slate-900 prose-p:text-slate-600 
                    prose-strong:text-slate-900 prose-li:text-slate-600
                    prose-table:border prose-table:border-slate-200 prose-thead:bg-blue-50 prose-thead:text-blue-900
                    prose-th:px-4 prose-th:py-3 prose-td:px-4 prose-td:py-3 prose-td:border-t prose-td:border-slate-100
                    prose-tr:hover:bg-slate-50">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{matchReview}</ReactMarkdown>
                                        </div>

                                        {/* Risk Disclaimer */}
                                        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-5 flex gap-4 items-start">
                                            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-bold text-amber-800 text-sm mb-1">Analytical Disclaimer & Risk Warning</h4>
                                                <p className="text-xs text-amber-700 leading-relaxed">
                                                    These predictions and statistics are generated by an advanced data analysis engine and are intended solely for informational and analytical purposes. They DO NOT constitute financial or betting advice. If you choose to use these insights for betting, you are doing so completely at your own risk. Past performance does not guarantee future results.
                                                </p>
                                            </div>
                                        </div>
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
