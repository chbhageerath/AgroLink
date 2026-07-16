import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const hash = window.location.hash;
    const sessionMatch = hash.match(/session_id=([^&]+)/);
    if (!sessionMatch) {
      navigate("/login");
      return;
    }
    const session_id = sessionMatch[1];

    (async () => {
      try {
        const { data } = await api.post("/auth/session", { session_id });
        if (data.token) localStorage.setItem("agrolink_token", data.token);
        setUser(data.user);
        // clear hash
        window.history.replaceState(null, "", window.location.pathname);
        navigate("/dashboard", { state: { user: data.user } });
      } catch (e) {
        console.error("Auth callback failed", e);
        navigate("/login");
      }
    })();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-earth-bg">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-earth-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-earth-subtle font-sans">Signing you in...</p>
      </div>
    </div>
  );
}
