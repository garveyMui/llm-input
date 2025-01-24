// src/hooks/useAxios.ts
import { useState, useEffect } from 'react';
import api from '../services/api';

function useAxios<T>(url: string, method: 'GET' | 'POST' = 'GET', body?: any) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.request({
                    url,
                    method,
                    data: body,
                });
                setData(response.data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, method, body]);

    return { data, loading, error };
}

export default useAxios;
