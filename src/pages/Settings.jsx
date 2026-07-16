import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [notif, setNotif] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <div className="min-h-screen bg-earth-bg">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 lg:px-10 py-10">
        <h1 className="font-serif text-4xl text-earth-text mb-8">Settings</h1>

        <section className="p-6 rounded-2xl bg-white border border-earth-border soft-shadow mb-6">
          <h2 className="font-serif text-2xl text-earth-text mb-4">Account</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-earth-subtle">Email:</span> {user?.email}</p>
            <p><span className="text-earth-subtle">Role:</span> <span className="capitalize">{user?.role}</span></p>
            <p><span className="text-earth-subtle">Auth type:</span> {user?.auth_type}</p>
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-white border border-earth-border soft-shadow mb-6">
          <h2 className="font-serif text-2xl text-earth-text mb-4">Notifications</h2>
          <label className="flex items-center justify-between py-2">
            <span>Order updates</span>
            <input data-testid="notif-toggle" type="checkbox" checked={notif} onChange={e => setNotif(e.target.checked)} className="w-5 h-5 accent-earth-primary" />
          </label>
          <label className="flex items-center justify-between py-2">
            <span>Marketing emails</span>
            <input data-testid="marketing-toggle" type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} className="w-5 h-5 accent-earth-primary" />
          </label>
        </section>

        <section className="p-6 rounded-2xl bg-white border border-earth-border soft-shadow">
          <h2 className="font-serif text-2xl text-earth-text mb-4">Danger zone</h2>
          <button data-testid="settings-logout" onClick={async () => { await logout(); nav("/"); }} className="px-5 py-2.5 rounded-full border-2 border-earth-clay text-earth-clay hover:bg-earth-clay hover:text-white transition-colors">
            Sign out
          </button>
        </section>
      </main>
    </div>
  );
}
