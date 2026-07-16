import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function ProductCard({ product }) {
  const img = product.images?.[0] || "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800";
  return (
    <Link to={`/products/${product.product_id}`} data-testid={`product-card-${product.product_id}`}
      className="group block bg-white rounded-2xl border border-earth-border overflow-hidden soft-shadow hover:-translate-y-1 transition-transform duration-300">
      <div className="aspect-[4/3] bg-earth-muted overflow-hidden">
        <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-serif text-xl text-earth-text leading-tight">{product.name}</h3>
            <p className="text-xs text-earth-subtle mt-1">by {product.farmer_name} · {product.location}</p>
          </div>
          {product.rating_avg > 0 && (
            <div className="flex items-center gap-1 text-xs text-earth-subtle">
              <Star size={12} className="fill-earth-clay text-earth-clay" />
              {product.rating_avg.toFixed(1)}
            </div>
          )}
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <span className="text-2xl font-serif font-semibold text-earth-primary">₹{product.price}</span>
            <span className="text-sm text-earth-subtle">/{product.unit}</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-earth-muted text-earth-subtle">{product.quantity} {product.unit} left</span>
        </div>
      </div>
    </Link>
  );
}
