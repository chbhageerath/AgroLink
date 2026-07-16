import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { Package, TrendingUp, ShoppingBag, Wallet, Plus, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiCrop, setAiCrop] = useState("wheat");
  const [aiRegion, setAiRegion] = useState("Punjab");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    api.get("/reports/summary").then(({ data }) => setSummary(data)).catch(() => {});
  }, []);

  const runAI = async () => {
    setAiLoading(true);
    try {
      const { data } = await api.post("/ai/recommend", { crop: aiCrop, region: aiRegion });
      setAiResult(data.recommendation);
    } catch (e) {
      toast.error(e.response?.data?.detail || "AI service unavailable");
    } finally {
      setAiLoading(false);
    }
  };

  const isFarmer = user?.role === "farmer";
  const isBuyer = user?.role === "buyer";
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-earth-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-earth-clay mb-2">{user?.role} dashboard</p>
            <h1 className="font-serif text-4xl lg:text-5xl text-earth-text">Hello, {user?.name?.split(" ")[0]}.</h1>
          </div>
          {isFarmer && (
            <Link to="/listings/new" data-testid="new-listing-btn" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-earth-primary text-white hover:bg-earth-primary/90 transition-colors">
              <Plus size={16} /> New Listing
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {isFarmer && summary && (
            <>
              <StatCard icon={Package} label="Products" value={summary.total_products} />
              <StatCard icon={ShoppingBag} label="Orders" value={summary.total_orders} />
              <StatCard icon={Wallet} label="Revenue" value={`₹${summary.total_revenue}`} accent />
              <StatCard icon={TrendingUp} label="Pending" value={`₹${summary.pending_revenue}`} />
            </>
          )}
          {isBuyer && summary && (
            <>
              <StatCard icon={ShoppingBag} label="Orders" value={summary.total_orders} />
              <StatCard icon={Wallet} label="Total Spend" value={`₹${summary.total_spend}`} accent />
              <StatCard icon={Package} label="Delivered" value={summary.orders_by_status?.delivered || 0} />
              <StatCard icon={TrendingUp} label="In Transit" value={summary.orders_by_status?.shipped || 0} />
            </>
          )}
          {isAdmin && summary && (
            <>
              <StatCard icon={Package} label="Users" value={summary.total_users} />
              <StatCard icon={ShoppingBag} label="Products" value={summary.total_products} />
              <StatCard icon={TrendingUp} label="Orders" value={summary.total_orders} />
              <StatCard icon={Wallet} label="GMV" value={`₹${summary.gmv}`} accent />
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white border border-earth-border rounded-2xl p-6 soft-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-earth-text">Recent Orders</h2>
              <Link to="/orders" className="text-sm text-earth-primary hover:underline">View all</Link>
            </div>
            {summary?.recent_orders?.length ? (
              <div className="space-y-3">
                {summary.recent_orders.map(o => (
                  <div key={o.order_id} data-testid={`recent-order-${o.order_id}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-earth-muted/40 transition-colors">
                    <img src={o.product_image || "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200"} className="w-14 h-14 rounded-xl object-cover" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-earth-text truncate">{o.product_name}</p>
                      <p className="text-xs text-earth-subtle">{o.quantity} {o.unit} · ₹{o.total_amount}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full capitalize ${
                      o.status === "delivered" ? "bg-earth-primary/10 text-earth-primary" :
                      o.status === "cancelled" ? "bg-earth-clay/10 text-earth-clay" :
                      "bg-earth-muted text-earth-subtle"
                    }`}>{o.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-earth-subtle text-center py-10">No orders yet.</p>
            )}
          </div>

          {/* AI Insights */}
          <div className="bg-earth-primary text-white rounded-2xl p-6 relative overflow-hidden grain">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} />
              <p className="text-xs uppercase tracking-widest">AI Market Insights</p>
            </div>
            <h3 className="font-serif text-2xl mb-4">Get pricing suggestions</h3>
            <div className="space-y-3">
              <input data-testid="ai-crop-input" value={aiCrop} onChange={e => setAiCrop(e.target.value)} placeholder="Crop name" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm" />
              <input data-testid="ai-region-input" value={aiRegion} onChange={e => setAiRegion(e.target.value)} placeholder="Region" className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm" />
              <button data-testid="ai-generate-btn" disabled={aiLoading} onClick={runAI} className="w-full py-2.5 rounded-full bg-white text-earth-primary font-medium hover:bg-earth-bg transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {aiLoading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : "Get Insights"}
              </button>
            </div>
            {aiResult && (
              <div className="mt-4 p-4 rounded-xl bg-white/10 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto" data-testid="ai-result">
                {aiResult}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickLink to="/marketplace" title="Marketplace" desc="Browse fresh produce" />
          <QuickLink to="/orders" title="Orders" desc="Track your orders" />
          <QuickLink to="/chat" title="Messages" desc="Chat with users" />
          <QuickLink to="/reports" title="Reports" desc="See your stats" />
        </div>
      </main>
    </div>
  );
}

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className={`p-6 rounded-2xl border soft-shadow ${accent ? "bg-earth-primary text-white border-earth-primary" : "bg-white border-earth-border"}`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${accent ? "bg-white/10" : "bg-earth-muted text-earth-primary"}`}>
      <Icon size={16} />
    </div>
    <p className={`text-xs uppercase tracking-wider ${accent ? "text-white/70" : "text-earth-subtle"}`}>{label}</p>
    <p className="font-serif text-3xl mt-1">{value}</p>
  </div>
);

const QuickLink = ({ to, title, desc }) => (
  <Link to={to} className="p-5 rounded-2xl bg-white border border-earth-border hover:border-earth-primary transition-colors soft-shadow">
    <p className="font-serif text-xl text-earth-text">{title}</p>
    <p className="text-sm text-earth-subtle mt-1">{desc}</p>
  </Link>
);
