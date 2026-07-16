import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", location: "", bio: "", farm_name: "", avatar: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({
      name: user.name || "", phone: user.phone || "", location: user.location || "",
      bio: user.bio || "", farm_name: user.farm_name || "", avatar: user.avatar || "",
    });
  }, [user]);

  const uploadAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
    setForm(f => ({ ...f, avatar: data.url }));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/profile", form);
      await refreshUser();
      toast.success("Profile updated");
    } catch (err) { toast.error("Failed"); }
    finally { setSaving(false); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen bg-earth-bg">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 lg:px-10 py-10">
        <h1 className="font-serif text-4xl text-earth-text mb-8">Profile</h1>
        <form onSubmit={save} className="space-y-5">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-earth-muted border border-earth-border">
              {form.avatar ? <img src={form.avatar} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-earth-subtle text-2xl">{form.name?.[0]}</div>}
            </div>
            <label data-testid="avatar-upload" className="px-4 py-2 rounded-full border border-earth-border bg-white cursor-pointer hover:bg-earth-muted transition-colors">
              Change avatar
              <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
            </label>
          </div>

          <div>
            <label className="text-sm text-earth-subtle">Full name</label>
            <input data-testid="profile-name" value={form.name} onChange={set("name")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-earth-subtle">Phone</label>
              <input data-testid="profile-phone" value={form.phone} onChange={set("phone")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
            </div>
            <div>
              <label className="text-sm text-earth-subtle">Location</label>
              <input data-testid="profile-location" value={form.location} onChange={set("location")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
            </div>
          </div>
          {user?.role === "farmer" && (
            <div>
              <label className="text-sm text-earth-subtle">Farm name</label>
              <input data-testid="profile-farm-name" value={form.farm_name} onChange={set("farm_name")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
            </div>
          )}
          <div>
            <label className="text-sm text-earth-subtle">Bio</label>
            <textarea data-testid="profile-bio" rows={3} value={form.bio} onChange={set("bio")} className="mt-1 w-full px-4 py-3 rounded-xl border border-earth-border bg-white focus:outline-none focus:ring-2 focus:ring-earth-primary" />
          </div>
          <button data-testid="profile-save-btn" disabled={saving} type="submit" className="px-6 py-3 rounded-full bg-earth-primary text-white hover:bg-earth-primary/90 active:scale-95 transition-all disabled:opacity-60">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </main>
    </div>
  );
}
