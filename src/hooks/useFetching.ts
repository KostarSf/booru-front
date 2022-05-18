import { useState } from "react";


export const useFetching = <T extends Function>(callback: T) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchingHandler = async (...args: any[]) => {
    try {
      setIsLoading(true);
      await callback(...args);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  const fetching: T = fetchingHandler as any;

  return [fetching, isLoading, error] as const;
};
