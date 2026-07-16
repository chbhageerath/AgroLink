import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Sprout, ShoppingCart, MessageCircle, User, LogOut, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#F9F6F0]/85 border-b border-earth-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        <Link to="/" data-testid="logo-link" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-earth-primary text-white flex items-center justify-center">
            <Sprout size={18} />
          </div>
          <span className="font-serif text-2xl font-semibold text-earth-primary">AgroLink</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/marketplace" data-testid="nav-marketplace" className="text-earth-text hover:text-earth-primary transition-colors">Marketplace</Link>
          {user && <Link to="/dashboard" data-testid="nav-dashboard" className="text-earth-text hover:text-earth-primary transition-colors">Dashboard</Link>}
          {user && <Link to="/orders" data-testid="nav-orders" className="text-earth-text hover:text-earth-primary transition-colors">Orders</Link>}
          {user && <Link to="/chat" data-testid="nav-chat" className="text-earth-text hover:text-earth-primary transition-colors">Messages</Link>}
          {user?.role === "admin" && <Link to="/admin" data-testid="nav-admin" className="text-earth-text hover:text-earth-primary transition-colors">Admin</Link>}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/cart" data-testid="nav-cart" className="p-2 rounded-full hover:bg-earth-muted transition-colors"><ShoppingCart size={18} /></Link>
              <Link to="/profile" data-testid="nav-profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-earth-muted hover:bg-earth-border transition-colors">
                {user.avatar ? <img src={user.avatar} className="w-6 h-6 rounded-full object-cover" alt="" /> : <User size={16} />}
                <span className="text-sm">{user.name?.split(" ")[0]}</span>
              </Link>
              <button data-testid="logout-btn" onClick={async () => { await logout(); nav("/"); }} className="p-2 rounded-full hover:bg-earth-muted transition-colors" title="Logout">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" data-testid="login-nav-btn" className="text-sm px-4 py-2 rounded-full hover:bg-earth-muted transition-colors">Log in</Link>
              <Link to="/signup" data-testid="signup-nav-btn" className="text-sm px-5 py-2 rounded-full bg-earth-primary text-white hover:bg-earth-primary/90 transition-colors">Get Started</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} data-testid="mobile-menu-btn"><Menu /></button>
      </div>

      {open && (
        <div className="md:hidden border-t border-earth-border bg-[#F9F6F0]/95 px-6 py-4 space-y-3">
          <Link to="/marketplace" className="block" onClick={() => setOpen(false)}>Marketplace</Link>
          {user && <Link to="/dashboard" className="block" onClick={() => setOpen(false)}>Dashboard</Link>}
          {user && <Link to="/orders" className="block" onClick={() => setOpen(false)}>Orders</Link>}
          {user && <Link to="/chat" className="block" onClick={() => setOpen(false)}>Messages</Link>}
          {user ? (
            <button onClick={async () => { await logout(); nav("/"); }} className="text-earth-clay">Logout</button>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="px-4 py-2 rounded-full bg-earth-muted">Log in</Link>
              <Link to="/signup" className="px-4 py-2 rounded-full bg-earth-primary text-white">Sign up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
