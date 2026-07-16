import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Sprout } from "lucide-react";

export default function Signup() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer", phone: "", location: "" });
  const [loading, setLoading] = useState(false);

  const handleGoogle = () => {
    const redirectUrl = window.location.origin + "/dashboard";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created!");
      nav("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-earth-bg">
      <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-full bg-earth-primary text-white flex items-center justify-center"><Sprout size={18} /></div>
            <span className="font-serif text-2xl text-earth-primary">AgroLink</span>
          </Link>
          <h1 className="font-serif text-4xl text-earth-text mb-2">Join AgroLink</h1>
          <p className="text-earth-subtle mb-8">Create your account in seconds.</p>

          <button data-testid="google-signup-btn" onClick={handleGoogle} className="w-full py-3 rounded-full border border-earth-border bg-white hover:bg-earth-muted transition-colors mb-6 flex items-center justify-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6"><div className="flex-1 h-px bg-earth-border" /><span className="text-xs text-earth-subtle">or</span><div className="flex-1 h-px bg-earth-border" /></div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm text-earth-subtle">I am a</label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {["buyer","farmer"].map(r => (
                  <button key={r} type="button" data-testid={`role-${r}-btn`} onClick={() => setForm({...form, role: r})}
                    className={`py-3 rounded-xl border transition-all ${form.role === r ? "border-earth-primary bg-earth-primary text-white" : "border-earth-border bg-white text-earth-text hover:bg-earth-muted"}`}>
                    {r === "buyer" ? "Buyer" : "Farmer"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-earth-subtle">Full name</label>
              <input data-testid="signup-name-input" required value={form.name} onChange={set("name")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
            </div>
            <div>
              <label className="text-sm text-earth-subtle">Email</label>
              <input data-testid="signup-email-input" type="email" required value={form.email} onChange={set("email")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
            </div>
            <div>
              <label className="text-sm text-earth-subtle">Password</label>
              <input data-testid="signup-password-input" type="password" required minLength={6} value={form.password} onChange={set("password")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-earth-subtle">Phone</label>
                <input data-testid="signup-phone-input" value={form.phone} onChange={set("phone")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
              </div>
              <div>
                <label className="text-sm text-earth-subtle">Location</label>
                <input data-testid="signup-location-input" value={form.location} onChange={set("location")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
              </div>
            </div>
            <button data-testid="signup-submit-btn" disabled={loading} type="submit" className="w-full py-3 rounded-full bg-earth-primary text-white hover:bg-earth-primary/90 active:scale-95 transition-all disabled:opacity-60">
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-earth-subtle mt-6 text-center">
            Already have an account? <Link to="/login" className="text-earth-primary font-medium">Log in</Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:block relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1000&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-earth-primary/30" />
      </div>
    </div>
  );
}
