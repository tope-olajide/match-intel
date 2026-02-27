"use client";

import { useEffect, useState } from "react";
import { Clock, Trash2, ChevronRight, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export interface HistoryItem {
    id: string;
    title: string;
    timestamp: string;
    data: any;
}

interface HistorySidebarProps {
    storageKey: string;
    onSelectHistory: (item: HistoryItem) => void;
    title?: string;
    isOpen?: boolean;
    onToggle?: () => void;
}

export function HistorySidebar({
    storageKey,
    onSelectHistory,
    title = "History",
    isOpen = true,
    onToggle
}: HistorySidebarProps) {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

    useEffect(() => {
        loadHistory();
        // Dispatch custom event when saving elsewhere to keep sidebar updated without reload
        const handleStorageChange = () => loadHistory();
        window.addEventListener("local-storage-update", handleStorageChange);
        return () => window.removeEventListener("local-storage-update", handleStorageChange);
    }, [storageKey]);

    const loadHistory = () => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                setHistoryItems(JSON.parse(stored));
            } else {
                setHistoryItems([]);
            }
        } catch (error) {
            console.error("Failed to load history", error);
        }
    };

    const clearHistory = () => {
        if (confirm("Are you sure you want to clear your history?")) {
            localStorage.removeItem(storageKey);
            setHistoryItems([]);
        }
    };

    if (!isOpen) {
        return (
            <Button
                variant="outline"
                size="icon"
                onClick={onToggle}
                className="absolute right-4 top-20 z-40 bg-white shadow-md rounded-full"
            >
                <Menu className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <aside className="w-80 border-l border-slate-200 bg-white h-[calc(100vh-4rem)] sticky top-16 flex flex-col shrink-0 transition-all duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <h3 className="font-semibold text-sm text-slate-800 tracking-tight">{title}</h3>
                </div>
                <div className="flex gap-1">
                    {historyItems.length > 0 && (
                        <Button variant="ghost" size="icon" onClick={clearHistory} className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                    {onToggle && (
                        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 xl:hidden">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {historyItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                        <Clock className="w-8 h-8 mb-3 opacity-20" />
                        <p className="text-sm">No history yet</p>
                        <p className="text-xs mt-1">Items you search will appear here.</p>
                    </div>
                ) : (
                    historyItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSelectHistory(item)}
                            className="w-full text-left p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group flex flex-col gap-1"
                        >
                            <span className="text-sm font-semibold text-slate-700 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                                {new Date(item.timestamp).toLocaleString(undefined, {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                })}
                            </span>
                        </button>
                    ))
                )}
            </div>
        </aside>
    );
}
