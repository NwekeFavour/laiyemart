import React from "react";
import { Star } from "lucide-react";
import {Rating} from "@mui/material";    
const AllProductsSection = ({ products }) => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            All Products
          </h2>
          <p className="text-gray-500 mt-2">
            Browse our full collection of premium clothing and accessories.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer transition hover:scale-105"
            >
              <div className="relative w-full h-80 overflow-hidden rounded-md bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400";
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="mt-2">
                <p className="text-gray-500 text-xs font-semibold">{product.brand}</p>
                <h3 className="text-gray-900 font-bold text-sm truncate">{product.name}</h3>
                <p className="text-gray-900 font-bold mt-1">${product.price.toFixed(2)}</p>
                <p className="text-gray-500 text-xs">
                  Available in {product.colors} colors
                </p>

                {/* Rating */}
                <div className="flex items-center mt-1">
                    <Rating value={5} size="small" readOnly sx={{ color: '#E67E22' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-10">
          <button className="px-6 py-3 bg-neutral-500 text-white font-semibold rounded-md hover:bg-neutral-600 transition">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

// Dummy data example
const PRODUCTS = [
  {
    id: 1,
    brand: "MAJESTIC",
    name: "RELAXED WOOL COAT",
    price: 180,
    colors: 2,
    image:
      "https://images.unsplash.com/photo-1620247405612-18f042ea68cf?q=80&w=388&auto=format&fit=crop",
  },
  {
    id: 2,
    brand: "KOMONO",
    name: "MINIMAL LEATHER BELT",
    price: 55,
    colors: 3,
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    brand: "CLOUDNOLA",
    name: "OVERSIZED KNIT SWEATER",
    price: 72,
    colors: 4,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 4,
    brand: "KALEIDOSCOPE",
    name: "TAILORED TROUSERS",
    price: 98,
    colors: 2,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400&auto=format&fit=crop",
  },
];

export default function AllProducts() {
  return <AllProductsSection products={PRODUCTS} />;
}
