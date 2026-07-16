import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

export default function CreateListing() {
  const nav = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", category: "vegetables", price: "", unit: "kg", quantity: "", description: "", location: "", images: [] });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get("/categories").then(({data}) => setCategories(data)); }, []);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setForm(f => ({ ...f, images: [...f.images, data.url] }));
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImg = (i) => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/products", {
        ...form,
        price: parseFloat(form.price),
        quantity: parseFloat(form.quantity),
      });
      toast.success("Listing created!");
      nav("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen bg-earth-bg">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 lg:px-10 py-10">
        <p className="text-xs uppercase tracking-widest text-earth-clay mb-3">New Listing</p>
        <h1 className="font-serif text-4xl text-earth-text mb-8">List your harvest</h1>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-sm text-earth-subtle">Product Name</label>
            <input data-testid="listing-name-input" required value={form.name} onChange={set("name")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-earth-subtle">Category</label>
              <select data-testid="listing-category-select" value={form.category} onChange={set("category")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-earth-subtle">Unit</label>
              <select data-testid="listing-unit-select" value={form.unit} onChange={set("unit")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary">
                {["kg","quintal","ton","dozen","piece","litre"].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-earth-subtle">Price per unit (₹)</label>
              <input data-testid="listing-price-input" required type="number" min={0} step="0.01" value={form.price} onChange={set("price")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
            </div>
            <div>
              <label className="text-sm text-earth-subtle">Quantity available</label>
              <input data-testid="listing-qty-input" required type="number" min={0} step="0.01" value={form.quantity} onChange={set("quantity")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
            </div>
          </div>

          <div>
            <label className="text-sm text-earth-subtle">Location</label>
            <input data-testid="listing-location-input" value={form.location} onChange={set("location")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" placeholder="e.g., Punjab" />
          </div>

          <div>
            <label className="text-sm text-earth-subtle">Description</label>
            <textarea data-testid="listing-desc-input" rows={4} value={form.description} onChange={set("description")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
          </div>

          <div>
            <label className="text-sm text-earth-subtle">Images</label>
            <div className="mt-2 grid grid-cols-4 gap-3">
              {form.images.map((im, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-earth-border">
                  <img src={im} className="w-full h-full object-cover" alt="" />
                  <button type="button" onClick={() => removeImg(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center"><X size={12} /></button>
                </div>
              ))}
              <label data-testid="upload-image-btn" className="aspect-square rounded-xl border-2 border-dashed border-earth-border bg-white hover:border-earth-primary transition-colors flex flex-col items-center justify-center cursor-pointer text-earth-subtle">
                <Upload size={18} />
                <span className="text-xs mt-1">{uploading ? "..." : "Upload"}</span>
                <input type="file" accept="image/*" onChange={upload} className="hidden" />
              </label>
            </div>
          </div>

          <button data-testid="listing-submit-btn" disabled={saving} type="submit" className="w-full py-3 rounded-full bg-earth-primary text-white hover:bg-earth-primary/90 active:scale-95 transition-all disabled:opacity-60">
            {saving ? "Publishing..." : "Publish Listing"}
          </button>
        </form>
      </main>
    </div>
  );
}
