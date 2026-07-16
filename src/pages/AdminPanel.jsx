import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  useEffect(() => { api.get("/admin/users").then(({ data }) => setUsers(data)); }, []);

  return (
    <div className="min-h-screen bg-earth-bg">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        <p className="text-xs uppercase tracking-widest text-earth-clay mb-3">Admin</p>
        <h1 className="font-serif text-4xl text-earth-text mb-8">User Management</h1>

        <div className="bg-white rounded-2xl border border-earth-border soft-shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-earth-muted text-earth-subtle text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Location</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.user_id} data-testid={`admin-user-${u.user_id}`} className="border-t border-earth-border">
                  <td className="p-4">{u.name}</td>
                  <td className="p-4 text-earth-subtle">{u.email}</td>
                  <td className="p-4"><span className="text-xs px-2 py-1 rounded-full bg-earth-muted capitalize">{u.role}</span></td>
                  <td className="p-4 text-earth-subtle">{u.location || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
