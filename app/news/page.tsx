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
import { Newspaper } from "lucide-react";

export default function NewsPage() {
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [selectedLeague, setSelectedLeague] = useState<string>("");
    const [selectedHomeTeam, setSelectedHomeTeam] = useState<string>("");
    const [selectedAwayTeam, setSelectedAwayTeam] = useState<string>("");
    const [matchNews, setMatchNews] = useState<string>("");
    const [isNewsLoading, setIsNewsLoading] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

    const handleSelectHistory = (item: HistoryItem) => {
        setSelectedCountry(item.data.country as string);
        setSelectedLeague(item.data.league as string);
        setSelectedHomeTeam(item.data.homeTeam as string);
        setSelectedAwayTeam(item.data.awayTeam as string);
        setMatchNews(item.data.news as string);
    };

    const countries = Object.keys(footballData).sort();
    const leagues = selectedCountry ? footballData[selectedCountry] : [];
    const currentLeague = leagues.find(l => l.code === selectedLeague);
    const teams = currentLeague ? currentLeague.teams : [];

    const handleCountryChange = (value: string) => {
        setSelectedCountry(value);
        setSelectedLeague("");
        setSelectedHomeTeam("");
        setSelectedAwayTeam("");
        setMatchNews("");
    };

    const handleLeagueChange = (value: string) => {
        setSelectedLeague(value);
        setSelectedHomeTeam("");
        setSelectedAwayTeam("");
        setMatchNews("");
    };

    const handleHomeTeamChange = (value: string) => {
        setSelectedHomeTeam(value);
        setSelectedAwayTeam("");
        setMatchNews("");
    };

    const handleGetMatchNews = async () => {
        if (!selectedLeague || !selectedHomeTeam || !selectedAwayTeam) return;

        setIsNewsLoading(true);
        setMatchNews("");

        try {
            const response = await fetch("/api/news", {
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
                setMatchNews(data.review);
                // Save to History
                const historyItem: HistoryItem = {
                    id: Date.now().toString(),
                    title: `News: ${selectedHomeTeam} vs ${selectedAwayTeam}`,
                    timestamp: new Date().toISOString(),
                    data: {
                        country: selectedCountry,
                        league: selectedLeague,
                        homeTeam: selectedHomeTeam,
                        awayTeam: selectedAwayTeam,
                        news: data.review
                    }
                };
                const existing = JSON.parse(localStorage.getItem("news_history") || "[]");
                localStorage.setItem("news_history", JSON.stringify([historyItem, ...existing]));
                window.dispatchEvent(new Event("local-storage-update"));
            } else if (data.error) {
                setMatchNews(`**Error:** ${data.error}`);
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            setMatchNews("**Error:** Failed to connect to Analysis Engine.");
        } finally {
            setIsNewsLoading(false);
        }
    };

    return (
        <div className="flex w-full lg:h-[calc(100vh-4rem)]">
            <HistorySidebar
                storageKey="news_history"
                onSelectHistory={handleSelectHistory}
                title="News History"
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="flex-1 flex flex-col items-center p-4 md:p-8 overflow-y-auto w-full">
                <div className="z-10 w-full max-w-4xl flex flex-col space-y-8 pb-12">

                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 w-full">
                        <h1 className="text-2xl font-bold text-center mb-2 text-slate-800 tracking-tight">Match News</h1>
                        <p className="text-center text-slate-500 mb-6 font-medium">Select a match to generate a preview article</p>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="country" className="text-slate-600 font-semibold">Country</Label>
                                <Select onValueChange={handleCountryChange} value={selectedCountry}>
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
                                    <Select onValueChange={handleLeagueChange} value={selectedLeague}>
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
                                        <Select onValueChange={handleHomeTeamChange} value={selectedHomeTeam}>
                                            <SelectTrigger id="home-team" className="w-full h-11 border-slate-200 focus:ring-slate-400">
                                                <SelectValue placeholder="Select Home Team" />
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
                                                <SelectValue placeholder="Select Away Team" />
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
                                    onClick={handleGetMatchNews}
                                    disabled={isNewsLoading}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-6 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                                >
                                    {isNewsLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Drafting Article...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Newspaper className="w-5 h-5" />
                                            <span>Generate Match Preview</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* News Article Output */}
                        {(matchNews || isNewsLoading) && (
                            <div className="mt-12 border-t border-slate-100 pt-8 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-2 mb-6">
                                    <Newspaper className="w-5 h-5 text-blue-600" />
                                    <h2 className="text-lg font-bold text-slate-800">Match Intelligence News</h2>
                                </div>

                                {isNewsLoading ? (
                                    <div className="space-y-4">
                                        <div className="h-8 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                                        <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                                        <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
                                        <div className="h-64 bg-slate-100 rounded w-full animate-pulse"></div>
                                    </div>
                                ) : (
                                    <div className="prose prose-slate max-w-none 
                    prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed
                    prose-strong:text-slate-900 prose-li:text-slate-600
                    prose-h1:text-3xl prose-h1:font-black prose-h1:tracking-tight prose-h1:mb-8
                    prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-blue-600 prose-h2:pl-4">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{matchNews}</ReactMarkdown>
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
