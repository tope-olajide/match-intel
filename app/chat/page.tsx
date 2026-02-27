"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HistorySidebar, HistoryItem } from "@/components/HistorySidebar";
import { Button } from "@/components/ui/button";
import { Send, User, Bot, Loader2 } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSelectHistory = (item: HistoryItem) => {
        setMessages(item.data.messages || []);
        setCurrentChatId(item.id);
    };

    const startNewChat = () => {
        setMessages([]);
        setCurrentChatId(null);
    };

    const saveChatToHistory = (newMessages: Message[]) => {
        if (newMessages.length === 0) return;

        // Use first user message as title
        const firstUserMsg = newMessages.find(m => m.role === 'user')?.content || "New Chat";
        const title = firstUserMsg.length > 30 ? firstUserMsg.substring(0, 30) + '...' : firstUserMsg;

        const chatId = currentChatId || Date.now().toString();
        if (!currentChatId) setCurrentChatId(chatId);

        const historyItem: HistoryItem = {
            id: chatId,
            title: title,
            timestamp: new Date().toISOString(),
            data: { messages: newMessages }
        };

        const existing = JSON.parse(localStorage.getItem("chat_history") || "[]");
        const filtered = existing.filter((item: HistoryItem) => item.id !== chatId);
        localStorage.setItem("chat_history", JSON.stringify([historyItem, ...filtered]));
        window.dispatchEvent(new Event("local-storage-update"));
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");

        // Add user message to UI immediately
        const updatedMessages: Message[] = [...messages, { role: "user", content: userMessage }];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();

            const assistantReply = data.reply || data.error || "No response received.";
            const finalMessages: Message[] = [...updatedMessages, { role: "assistant", content: assistantReply }];

            setMessages(finalMessages);
            saveChatToHistory(finalMessages);

        } catch (error) {
            console.error("Chat Error:", error);
            const finalMessages: Message[] = [...updatedMessages, { role: "assistant", content: "**Error:** Failed to connect to Analysis Engine." }];
            setMessages(finalMessages);
            saveChatToHistory(finalMessages);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-full lg:h-[calc(100vh-4rem)]">
            <HistorySidebar
                storageKey="chat_history"
                onSelectHistory={handleSelectHistory}
                title="Chat Sessions"
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="flex-1 flex flex-col bg-slate-50 relative h-[calc(100vh-4rem)] lg:h-auto overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center z-10">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Agent Builder Chat</h1>
                        <p className="text-xs text-slate-500">Converse directly with the Elite Sports Engine</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={startNewChat}>
                        New Chat
                    </Button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                            <Bot className="w-12 h-12 mb-4 text-slate-300" />
                            <h2 className="text-xl font-bold text-slate-600 mb-2">How can I help you?</h2>
                            <p className="max-w-md text-sm">Ask me to analyze form, predict outcomes, or look up historical football stats.</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full ${msg.role === "user" ? "bg-slate-900 text-white" : "bg-blue-600 text-white"}`}>
                                        {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={`p-4 rounded-2xl ${msg.role === "user" ? "bg-slate-900 text-white rounded-tr-sm" : "bg-white border border-slate-200 shadow-sm rounded-tl-sm text-slate-800"}`}>
                                        {msg.role === "user" ? (
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        ) : (
                                            <div className="prose prose-slate max-w-none prose-sm prose-p:leading-relaxed prose-table:border prose-table:border-slate-200 prose-thead:bg-slate-50 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-td:border-t prose-td:border-slate-100">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex gap-4 max-w-[85%]">
                                <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-blue-600 text-white">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm rounded-tl-sm flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Engine thinking...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200 shadow-sm shrink-0">
                    <div className="max-w-4xl mx-auto flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Message Elite Sports Intelligence..."
                            className="flex-1 h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={!input.trim() || isLoading}
                            className="h-12 w-12 rounded-xl bg-slate-900 hover:bg-slate-800"
                            size="icon"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
