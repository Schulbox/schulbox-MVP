import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@remix-run/react";

export default function SchulboxLoading({ targetUrl }: { targetUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsClient(true);
  
    import("lottie-web").then((lottie) => {
      const loadAnimation = (lottie as any).loadAnimation;
  
      const anim = loadAnimation({
        container: containerRef.current!,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/images/schulbox_loading_animation/loading_animation.json",
      });
  
      const timeout = setTimeout(() => {
        navigate(targetUrl);
      }, 2000);
  
      return () => {
        anim.destroy();
        clearTimeout(timeout);
      };
    });
  }, [navigate, targetUrl]);
  
  
  

  if (!isClient) return null; // ⛔️ Während SSR: Nichts rendern

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <div className="w-64 h-64" ref={containerRef}></div>
      <p className="text-gray-600 animate-pulse">Bitte warten. Schulbox wird erstellt…</p>
    </div>
  );
}
