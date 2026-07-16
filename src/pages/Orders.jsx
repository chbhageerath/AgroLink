import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const STATUS_COLORS = {
  pending: "bg-earth-muted text-earth-subtle",
  confirmed: "bg-earth-leaf/20 text-earth-primary",
  shipped: "bg-earth-clay/20 text-earth-clay",
  delivered: "bg-earth-primary/10 text-earth-primary",
  cancelled: "bg-red-100 text-red-700",
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/orders").then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success(`Order ${status}`);
      load();
    } catch (e) { toast.error("Failed"); }
  };

  return (
    <div className="min-h-screen bg-earth-bg">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        <p className="text-xs uppercase tracking-widest text-earth-clay mb-3">Transactions</p>
        <h1 className="font-serif text-4xl text-earth-text mb-10">Orders</h1>

        {loading ? <p className="text-earth-subtle">Loading...</p> :
        orders.length === 0 ? (
          <div className="text-center py-20 text-earth-subtle">No orders yet.</div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.order_id} data-testid={`order-${o.order_id}`} className="p-5 rounded-2xl bg-white border border-earth-border soft-shadow flex flex-wrap items-center gap-5">
                <img src={o.product_image || "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200"} className="w-20 h-20 rounded-xl object-cover" alt="" />
                <div className="flex-1 min-w-[200px]">
                  <p className="font-serif text-xl text-earth-text">{o.product_name}</p>
                  <p className="text-sm text-earth-subtle">
                    {user?.role === "farmer" ? `Buyer: ${o.buyer_name}` : `Farmer: ${o.farmer_name}`}
                  </p>
                  <p className="text-xs text-earth-subtle mt-1">{o.quantity} {o.unit} · ID: {o.order_id.slice(-8)}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl text-earth-primary">₹{o.total_amount}</p>
                  <span className={`text-xs px-3 py-1 rounded-full capitalize ${STATUS_COLORS[o.status] || ""}`}>{o.status}</span>
                  {o.payment_status === "paid" && <span className="ml-2 text-xs text-earth-primary">✓ Paid</span>}
                </div>
                {user?.role === "farmer" && o.status !== "delivered" && o.status !== "cancelled" && (
                  <div className="w-full flex gap-2 flex-wrap">
                    {["confirmed","shipped","delivered","cancelled"].map(s => (
                      <button key={s} data-testid={`status-${s}-${o.order_id}`} onClick={() => updateStatus(o.order_id, s)} className="text-xs px-3 py-1.5 rounded-full border border-earth-border hover:bg-earth-primary hover:text-white hover:border-earth-primary transition-colors capitalize">
                        Mark {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
