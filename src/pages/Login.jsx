import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Sprout } from "lucide-react";

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogle = () => {
    const redirectUrl = window.location.origin + "/dashboard";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      nav("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-earth-bg">
      <div className="hidden lg:block relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1000&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-earth-primary/40" />
        <div className="relative z-10 p-16 flex flex-col justify-end h-full text-white">
          <Link to="/" className="flex items-center gap-2 mb-auto">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"><Sprout size={18} /></div>
            <span className="font-serif text-2xl">AgroLink</span>
          </Link>
          <h2 className="font-serif text-5xl leading-tight">Growing<br/>together.</h2>
          <p className="text-white/80 mt-4 max-w-sm">The marketplace where every harvest finds its buyer, and every buyer meets a farmer.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-full bg-earth-primary text-white flex items-center justify-center"><Sprout size={18} /></div>
            <span className="font-serif text-2xl text-earth-primary">AgroLink</span>
          </Link>
          <h1 className="font-serif text-4xl text-earth-text mb-2">Welcome back</h1>
          <p className="text-earth-subtle mb-8">Log in to your AgroLink account.</p>

          <button data-testid="google-login-btn" onClick={handleGoogle} className="w-full py-3 rounded-full border border-earth-border bg-white hover:bg-earth-muted transition-colors mb-6 flex items-center justify-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6"><div className="flex-1 h-px bg-earth-border" /><span className="text-xs text-earth-subtle">or</span><div className="flex-1 h-px bg-earth-border" /></div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm text-earth-subtle">Email</label>
              <input data-testid="login-email-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
            </div>
            <div>
              <label className="text-sm text-earth-subtle">Password</label>
              <input data-testid="login-password-input" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
            </div>
            <button data-testid="login-submit-btn" disabled={loading} type="submit" className="w-full py-3 rounded-full bg-earth-primary text-white hover:bg-earth-primary/90 active:scale-95 transition-all disabled:opacity-60">
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-sm text-earth-subtle mt-6 text-center">
            Don't have an account? <Link to="/signup" data-testid="signup-link" className="text-earth-primary font-medium">Sign up</Link>
          </p>

          <div className="mt-8 p-4 rounded-xl bg-earth-muted/50 text-xs text-earth-subtle">
            <p className="font-medium mb-1">Try demo accounts:</p>
            <p>Farmer: farmer@agrolink.com / Farmer@123</p>
            <p>Buyer: buyer@agrolink.com / Buyer@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
