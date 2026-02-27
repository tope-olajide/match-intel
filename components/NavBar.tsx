"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart3, MessageSquare, Search, Newspaper } from "lucide-react";

export function NavBar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Review", icon: Search },
        { href: "/chat", label: "Chat", icon: MessageSquare },
        { href: "/stats", label: "Stats & Predictions", icon: BarChart3 },
        { href: "/news", label: "News", icon: Newspaper },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
                <div className="mr-8 flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xl">
                        M
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        Match Intel
                    </span>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-6 md:justify-start">
                    {links.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-slate-900",
                                    isActive ? "text-slate-900" : "text-slate-500"
                                )}
                            >
                                <Icon className={cn("h-4 w-4", isActive ? "text-blue-600" : "")} />
                                <span className="hidden sm:inline-block">{label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
