import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Star, MapPin, User as UserIcon, MessageCircle, Loader2 } from "lucide-react";

export default function ProductDetail() {
  const { productId } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [address, setAddress] = useState("");
  const [buying, setBuying] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    api.get(`/products/${productId}`).then(({ data }) => setProduct(data));
    api.get(`/reviews/${productId}`).then(({ data }) => setReviews(data));
  }, [productId]);

  const buy = async () => {
    if (!user) return nav("/login");
    if (!address.trim()) return toast.error("Please enter delivery address");
    setBuying(true);
    try {
      const { data: order } = await api.post("/orders", {
        product_id: productId, quantity: parseFloat(qty), delivery_address: address,
      });
      // Create Razorpay order
      const { data: rzp } = await api.post("/payments/create-order", { amount: order.total_amount, order_id: order.order_id });
      if (rzp.mock) {
        // MOCK payment - directly verify
        await api.post("/payments/verify", { order_id: order.order_id, mock: true });
        toast.success("Order placed! (Demo payment auto-confirmed)");
        nav("/orders");
        return;
      }
      // Real razorpay flow
      const opts = {
        key: rzp.key_id, amount: rzp.amount, currency: rzp.currency,
        name: "AgroLink", description: product.name, order_id: rzp.id,
        handler: async (resp) => {
          await api.post("/payments/verify", { ...resp, order_id: order.order_id });
          toast.success("Payment successful!");
          nav("/orders");
        },
        theme: { color: "#2C5530" },
      };
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const rp = new window.Razorpay(opts);
        rp.open();
      };
      document.body.appendChild(script);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Order failed");
    } finally {
      setBuying(false);
    }
  };

  const submitReview = async () => {
    if (!user) return nav("/login");
    try {
      await api.post("/reviews", { product_id: productId, rating, comment });
      const { data } = await api.get(`/reviews/${productId}`);
      setReviews(data);
      setComment("");
      toast.success("Review posted");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed");
    }
  };

  const messageFarmer = async () => {
    if (!user) return nav("/login");
    try {
      await api.post("/messages", { receiver_id: product.farmer_id, product_id: product.product_id, content: `Hi, I'm interested in ${product.name}.` });
      nav("/chat");
    } catch (e) {
      toast.error("Failed to start chat");
    }
  };

  if (!product) return (<div className="min-h-screen bg-earth-bg"><Navbar /><div className="max-w-7xl mx-auto px-6 py-20 text-center"><Loader2 className="animate-spin mx-auto" /></div></div>);

  const imgs = product.images?.length ? product.images : ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800"];

  return (
    <div className="min-h-screen bg-earth-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-3xl overflow-hidden bg-earth-muted soft-shadow border border-earth-border">
              <img src={imgs[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {imgs.length > 1 && (
              <div className="flex gap-3 mt-4">
                {imgs.map((im, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? "border-earth-primary" : "border-transparent"}`}>
                    <img src={im} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-xs uppercase tracking-widest text-earth-clay mb-2">{product.category}</p>
            <h1 className="font-serif text-5xl text-earth-text leading-tight mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 text-sm text-earth-subtle mb-6">
              <span className="flex items-center gap-1"><UserIcon size={14} /> {product.farmer_name}</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> {product.location}</span>
              {product.rating_avg > 0 && <span className="flex items-center gap-1"><Star size={14} className="fill-earth-clay text-earth-clay" /> {product.rating_avg} ({product.rating_count})</span>}
            </div>

            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-serif text-5xl text-earth-primary">₹{product.price}</span>
              <span className="text-earth-subtle">per {product.unit}</span>
            </div>

            <p className="text-earth-subtle mb-8 leading-relaxed">{product.description}</p>

            <div className="p-6 rounded-2xl bg-white border border-earth-border soft-shadow space-y-4 mb-6">
              <div>
                <label className="text-sm text-earth-subtle">Quantity ({product.unit})</label>
                <input data-testid="buy-qty-input" type="number" min={1} max={product.quantity} value={qty} onChange={e => setQty(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
              </div>
              <div>
                <label className="text-sm text-earth-subtle">Delivery Address</label>
                <textarea data-testid="buy-address-input" rows={2} value={address} onChange={e => setAddress(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" placeholder="Street, city, PIN..." />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-earth-border">
                <span className="text-earth-subtle">Total</span>
                <span className="font-serif text-3xl text-earth-primary">₹{(product.price * qty).toFixed(2)}</span>
              </div>
              <div className="flex gap-3">
                <button data-testid="buy-now-btn" disabled={buying} onClick={buy} className="flex-1 py-3 rounded-full bg-earth-primary text-white hover:bg-earth-primary/90 active:scale-95 transition-all disabled:opacity-60">
                  {buying ? "Processing..." : "Buy Now"}
                </button>
                <button data-testid="msg-farmer-btn" onClick={messageFarmer} className="px-5 py-3 rounded-full border-2 border-earth-primary text-earth-primary hover:bg-earth-primary hover:text-white transition-colors">
                  <MessageCircle size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <h2 className="font-serif text-3xl text-earth-text mb-6">Reviews</h2>

          {user?.role === "buyer" && (
            <div className="p-6 rounded-2xl bg-white border border-earth-border soft-shadow mb-6">
              <p className="text-sm text-earth-subtle mb-3">Your rating</p>
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(n => (
                  <button key={n} data-testid={`star-${n}`} onClick={() => setRating(n)}>
                    <Star size={24} className={n <= rating ? "fill-earth-clay text-earth-clay" : "text-earth-border"} />
                  </button>
                ))}
              </div>
              <textarea data-testid="review-comment-input" rows={2} value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..." className="w-full px-4 py-3 rounded-xl border border-earth-border bg-earth-bg focus:outline-none focus:ring-2 focus:ring-earth-primary" />
              <button data-testid="submit-review-btn" onClick={submitReview} className="mt-3 px-5 py-2 rounded-full bg-earth-primary text-white hover:bg-earth-primary/90 transition-colors">Post Review</button>
            </div>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-earth-subtle">No reviews yet. Be the first!</p>
            ) : reviews.map(r => (
              <div key={r.review_id} className="p-5 rounded-2xl bg-white border border-earth-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{r.buyer_name}</p>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => <Star key={n} size={14} className={n <= r.rating ? "fill-earth-clay text-earth-clay" : "text-earth-border"} />)}
                  </div>
                </div>
                <p className="text-sm text-earth-subtle">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
