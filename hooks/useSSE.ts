import { useEffect, useRef } from "react";
import { BASE_URL } from "@/constants";

export const useSSE = (
  endpoint: string = "/realtime/sse",
  onMessage?: (event: MessageEvent) => void
) => {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Construct absolute URL primarily for robustness
    const url = `${BASE_URL}${endpoint}`;
    
    // We assume backend handles auth via cookies usually for SSE, 
    // or we might need to append token query param if supported by backend (not shown in controller logic, controller checks cookie 'accessToken' or Auth header)
    // EventSource doesn't support headers natively. Backend 'sse.controller.ts' checks 'accessToken' cookie.
    
    // Check if we have a cookie, if not, this might fail unless backend supports query token which I didn't see explicitly.
    // Actually the controller has: const cookies = parseCookies(req.headers?.cookie ...); await tryVerify(cookies['accessToken']);
    // So if the browser has the httpOnly cookie set from login, this works.

    const es = new EventSource(url, { withCredentials: true });
    
    es.onopen = () => {
      console.log("SSE Connected");
    };

    es.onmessage = (event) => {
      // Logic to handle global messages or passed to callback
      if (onMessage) {
        onMessage(event);
      }
    };

    es.onerror = (error) => {
      console.error("SSE Error", error);
      es.close();
    };

    eventSourceRef.current = es;

    return () => {
      es.close();
    };
  }, [endpoint, onMessage]);

  return eventSourceRef.current;
};
