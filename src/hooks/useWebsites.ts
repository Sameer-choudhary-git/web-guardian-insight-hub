"use client"
import { BACKEND_URL } from "@/configs/config";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useState, useEffect } from "react";

interface Website {
    id: string;
    name: string;
    userId: string;
    deleted: boolean;
    url: string;
    tick: {
        id: string;
        createdAt: string;
        status: string;
        latency: number;
    }[];
    checkInterval: number;
    updatedAt: string;
}

export function useWebsites() {
    const { getToken } = useAuth();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchWebsites() {
        try {
            setIsLoading(true);
            setError(null);
            const token = await getToken();
            const response = await axios.get<{ websites: Website[] }>(`${BACKEND_URL}/api/v1/websites`, {
                headers: {
                    Authorization: token
                }
            });
            setWebsites(response.data.websites);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch websites');
            console.error('Error fetching websites:', err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchWebsites();
        const interval = setInterval(fetchWebsites, 60000); // Fetch every minute
        return () => clearInterval(interval);
    }, []);

    return { 
        websites, 
        fetchWebsites, 
        isLoading, 
        error 
    };
}