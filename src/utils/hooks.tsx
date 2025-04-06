import { useState, useCallback } from "react";

interface ApiError {
  message: string;
  code?: number;
  details?: Record<string, string>;
}

export function useApi() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const request = useCallback(async <T,>(endpoint: string, options?: RequestInit): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + endpoint, {
        ...options,
        credentials: "include", // Ajout des cookies dans la requête
      });
      const data = await response.json();

      if (!response.ok) {
        throw data.error || { message: "Une erreur est survenue", code: response.status };
      }

      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(
    async <T,>(endpoint: string): Promise<T> => {
      return request<T>(endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    },
    [request]
  );

  const post = useCallback(
    async <T,>(endpoint: string, body: object): Promise<T> => {
      return request<T>(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
    [request]
  );

  return { get, post, loading, error };
}
