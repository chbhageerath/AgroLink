import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import { Search } from "lucide-react";

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    api.get("/products", { params }).then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="min-h-screen bg-earth-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-earth-clay mb-3">Marketplace</p>
          <h1 className="font-serif text-5xl text-earth-text">Fresh from the field.</h1>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-subtle" size={18} />
          <input data-testid="market-search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search produce, farmer, region..." className="w-full pl-12 pr-4 py-3.5 rounded-full border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto">
          <button data-testid="cat-all-btn" onClick={() => setCategory("")} className={`px-4 py-2 rounded-full text-sm transition-colors ${category === "" ? "bg-earth-primary text-white" : "bg-white border border-earth-border text-earth-text hover:bg-earth-muted"}`}>All</button>
          {categories.map(c => (
            <button key={c.id} data-testid={`cat-${c.id}-btn`} onClick={() => setCategory(c.id)} className={`px-4 py-2 rounded-full text-sm transition-colors ${category === c.id ? "bg-earth-primary text-white" : "bg-white border border-earth-border text-earth-text hover:bg-earth-muted"}`}>{c.name}</button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-earth-subtle">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-earth-text">No produce found</p>
            <p className="text-earth-subtle mt-2">Try different filters or come back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.product_id} product={p} />)}
          </div>
        )}
      </main>
    </div>
  );
}
