import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Sprout, TrendingUp, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/uploads/141247613151541c06062/c15fb37d?crop=entropy&cs=srgb&fm=jpg&w=1600&q=80";
const FARMER_IMG = "https://images.unsplash.com/photo-1627829382469-f4bce7df99ba?w=800&q=80";
const APPLES_IMG = "https://images.unsplash.com/photo-1599275247787-40daab5777bc?w=600&q=80";
const RADISH_IMG = "https://images.unsplash.com/photo-1576072115035-5fe30e447e60?w=600&q=80";
const BUYERS_IMG = "https://images.unsplash.com/photo-1761839257664-ecba169506c1?w=800&q=80";

export default function Landing() {
  return (
    <div className="min-h-screen bg-earth-bg">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden grain">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-earth-muted text-xs uppercase tracking-wider text-earth-subtle">
              <Sprout size={12} /> Farmer-to-Buyer Marketplace
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-earth-text tracking-tight">
              From the <em className="text-earth-primary not-italic italic">soil</em>,<br/>
              straight to your <span className="text-earth-clay">table</span>.
            </h1>
            <p className="text-lg text-earth-subtle max-w-xl leading-relaxed">
              AgroLink connects farmers and buyers directly — no middlemen, no markups. Fair prices for growers, fresh harvests for you.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/marketplace" data-testid="hero-shop-btn" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-earth-primary text-white hover:bg-earth-primary/90 active:scale-95 transition-all">
                Shop Fresh <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/signup" data-testid="hero-sell-btn" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-earth-primary text-earth-primary hover:bg-earth-primary hover:text-white transition-all">
                Sell on AgroLink
              </Link>
            </div>
            <div className="flex items-center gap-8 pt-6 text-sm text-earth-subtle">
              <div><div className="font-serif text-2xl text-earth-text">1200+</div>Farmers</div>
              <div><div className="font-serif text-2xl text-earth-text">8,500+</div>Orders</div>
              <div><div className="font-serif text-2xl text-earth-text">4.8★</div>Rating</div>
            </div>
          </div>
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden soft-shadow border border-earth-border">
              <img src={HERO_IMG} alt="Farm at sunset" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 soft-shadow border border-earth-border w-56 hidden md:block">
              <div className="flex items-center gap-3">
                <img src={FARMER_IMG} className="w-12 h-12 rounded-full object-cover" alt="" />
                <div>
                  <p className="text-xs text-earth-subtle">Featured Farmer</p>
                  <p className="font-serif text-lg text-earth-text">Ravi K.</p>
                </div>
              </div>
              <p className="text-xs text-earth-subtle mt-2">"Doubled my income in 6 months."</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-widest text-earth-clay mb-3">Why AgroLink</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-earth-text">Built for the way farms actually work.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: TrendingUp, title: "Better Margins", body: "Skip layers of middlemen. Keep more of every sale in the farmer's pocket." },
            { icon: ShieldCheck, title: "Trusted Buyers", body: "Verified accounts, real reviews, and direct chat build trust that lasts." },
            { icon: Sparkles, title: "AI Price Insights", body: "Get smart pricing suggestions based on region, season and current demand." },
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-2xl border border-earth-border bg-white soft-shadow">
              <div className="w-12 h-12 rounded-full bg-earth-muted flex items-center justify-center text-earth-primary mb-6">
                <f.icon size={20} />
              </div>
              <h3 className="font-serif text-2xl text-earth-text mb-2">{f.title}</h3>
              <p className="text-earth-subtle">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="bg-earth-muted/40 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-earth-clay mb-3">Fresh today</p>
              <h2 className="font-serif text-4xl sm:text-5xl text-earth-text">Handpicked from the fields</h2>
            </div>
            <Link to="/marketplace" className="hidden md:inline-flex items-center gap-1 text-earth-primary hover:gap-2 transition-all">Browse all <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: APPLES_IMG, name: "Shimla Apples", price: "₹120/kg" },
              { img: RADISH_IMG, name: "Fresh Radishes", price: "₹25/kg" },
              { img: HERO_IMG, name: "Organic Wheat", price: "₹32/kg" },
              { img: BUYERS_IMG, name: "Seasonal Bundle", price: "₹450" },
            ].map((p, i) => (
              <div key={i} className="bg-white rounded-2xl border border-earth-border overflow-hidden soft-shadow hover:-translate-y-1 transition-transform">
                <div className="aspect-square overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg text-earth-text">{p.name}</h3>
                  <p className="text-earth-primary font-medium">{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="relative rounded-[3rem] overflow-hidden bg-earth-primary text-white p-12 lg:p-20 grain">
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-serif text-4xl sm:text-5xl leading-tight mb-6">Ready to grow with us?</h2>
            <p className="text-white/80 text-lg mb-8">Join thousands of farmers and buyers building a fairer food economy.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup" data-testid="cta-signup-btn" className="px-7 py-3.5 rounded-full bg-white text-earth-primary hover:bg-earth-bg transition-colors">Create free account</Link>
              <Link to="/marketplace" className="px-7 py-3.5 rounded-full border border-white/40 hover:bg-white/10 transition-colors">Explore market</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-earth-border py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-sm text-earth-subtle text-center">
          © 2026 AgroLink — Bridging fields and forks.
        </div>
      </footer>
    </div>
  );
}
