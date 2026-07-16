import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function Cart() {
  return (
    <div className="min-h-screen bg-earth-bg">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 lg:px-10 py-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-earth-muted flex items-center justify-center mb-6">
          <ShoppingBag className="text-earth-primary" />
        </div>
        <h1 className="font-serif text-4xl text-earth-text mb-3">Buy directly, no cart needed</h1>
        <p className="text-earth-subtle mb-8 max-w-lg mx-auto">AgroLink connects you straight to farmers. Head to the marketplace, pick a product and buy directly.</p>
        <Link to="/marketplace" data-testid="cart-market-btn" className="inline-flex px-7 py-3.5 rounded-full bg-earth-primary text-white hover:bg-earth-primary/90 transition-colors">Browse Marketplace</Link>
      </main>
    </div>
  );
}
