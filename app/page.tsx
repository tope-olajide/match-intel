
"use client";

import { useState } from "react";
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

  const countries = Object.keys(footballData).sort();

  const leagues = selectedCountry
    ? footballData[selectedCountry]
    : [];

  // Find the selected league object to get teams
  const currentLeague = leagues.find(l => l.name === selectedLeague);
  const teams = currentLeague ? currentLeague.teams : [];

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedLeague("");
    setSelectedHomeTeam("");
    setSelectedAwayTeam("");
  };

  const handleLeagueChange = (value: string) => {
    setSelectedLeague(value);
    setSelectedHomeTeam("");
    setSelectedAwayTeam("");
  };

  const handleHomeTeamChange = (value: string) => {
    setSelectedHomeTeam(value);
    setSelectedAwayTeam("");
  };

  const handleAwayTeamChange = (value: string) => {
    setSelectedAwayTeam(value);
  };

  const handleDownloadCSV = () => {
    if (!selectedLeague || !currentLeague) return;

    const mainLeagues = [
      "E0", "E1", "E2", "E3", "EC", "SC0", "SC1", "SC2", "SC3",
      "D1", "D2", "I1", "I2", "SP1", "SP2", "F1", "F2", "N1", "B1", "P1", "T1", "G1"
    ];

    let url = "";
    if (mainLeagues.includes(currentLeague.code)) {
      // 2526 season for 2026 request
      url = `https://www.football-data.co.uk/mmz4281/2526/${currentLeague.code}.csv`;
    } else {
      url = `https://www.football-data.co.uk/new/${currentLeague.code}.csv`;
    }

    console.log("-----------------------------------------");
    console.log(`CSV Dataset URL for ${selectedLeague}:`);
    console.log(url);
    console.log("-----------------------------------------");
    alert(`CSV URL for ${selectedLeague} has been logged to the console.`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-12 bg-slate-50">
      <div className="z-10 w-full max-w-md items-center justify-between font-sans text-sm lg:flex-col space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-2xl font-bold text-center mb-2 text-slate-800 tracking-tight">Football Match Selector</h1>
        <p className="text-center text-slate-500 mb-6 font-medium">Select a match to view details or download data</p>

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
              <div className="flex gap-2">
                <Select onValueChange={handleLeagueChange} value={selectedLeague}>
                  <SelectTrigger id="league" className="w-full h-11 border-slate-200 focus:ring-slate-400">
                    <SelectValue placeholder="Select League" />
                  </SelectTrigger>
                  <SelectContent>
                    {leagues.map((league) => (
                      <SelectItem key={league.code} value={league.name}>
                        {league.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedLeague && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 shrink-0 border-slate-200 hover:bg-slate-50 text-slate-600"
                    onClick={handleDownloadCSV}
                    title="Log CSV Download URL"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Home Team Select */}
          {selectedLeague && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
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
          )}

          {/* Away Team Select */}
          {selectedHomeTeam && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
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
              {selectedCountry} <span className="text-slate-300 mx-1">/</span> {selectedLeague}
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
          </div>
        )}
      </div>
    </main>
  );
}
