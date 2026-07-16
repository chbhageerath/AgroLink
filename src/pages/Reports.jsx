import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

const COLORS = ["#2C5530", "#8A9A5B", "#C05A3C", "#D6BE93", "#6B6A65"];

export default function Reports() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => { api.get("/reports/summary").then(({ data }) => setSummary(data)); }, []);

  if (!summary) return <div className="min-h-screen bg-earth-bg"><Navbar /><div className="p-10 text-earth-subtle">Loading...</div></div>;

  const statusData = Object.entries(summary.orders_by_status || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-earth-bg">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        <p className="text-xs uppercase tracking-widest text-earth-clay mb-3">Reports</p>
        <h1 className="font-serif text-4xl text-earth-text mb-8">Your numbers</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Metric label="Total Orders" value={summary.total_orders} />
          {user?.role === "farmer" && <>
            <Metric label="Products" value={summary.total_products} />
            <Metric label="Revenue" value={`₹${summary.total_revenue}`} accent />
            <Metric label="Pending" value={`₹${summary.pending_revenue}`} />
          </>}
          {user?.role === "buyer" && <Metric label="Total Spend" value={`₹${summary.total_spend}`} accent />}
          {user?.role === "admin" && <>
            <Metric label="Users" value={summary.total_users} />
            <Metric label="Products" value={summary.total_products} />
            <Metric label="GMV" value={`₹${summary.gmv}`} accent />
          </>}
        </div>

        <div className="p-6 rounded-2xl bg-white border border-earth-border soft-shadow">
          <h2 className="font-serif text-2xl text-earth-text mb-4">Orders by status</h2>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <BarChart data={statusData}>
                <XAxis dataKey="name" stroke="#6B6A65" tickLine={false} axisLine={false} />
                <YAxis stroke="#6B6A65" tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "#EAE5D9" }} contentStyle={{ background: "#fff", border: "1px solid #E5E0D8", borderRadius: 12 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

const Metric = ({ label, value, accent }) => (
  <div className={`p-6 rounded-2xl border soft-shadow ${accent ? "bg-earth-primary text-white border-earth-primary" : "bg-white border-earth-border"}`}>
    <p className={`text-xs uppercase tracking-wider ${accent ? "text-white/70" : "text-earth-subtle"}`}>{label}</p>
    <p className="font-serif text-3xl mt-1">{value}</p>
  </div>
);
