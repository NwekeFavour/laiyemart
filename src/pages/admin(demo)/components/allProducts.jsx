import React from "react";
import { Rating } from "@mui/material";

const AllProductsSection = ({ products }) => {

  if (!products || products.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <ShoppingBagOutlined sx={{ fontSize: 32, color: '#9ca3af' }} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            COLLECTION COMING SOON
          </h2>
          <p className="text-gray-500 mt-2 max-w-sm">
            We are currently curating our full catalog. Check back shortly to 
            discover our premium range of clothing and accessories.
          </p>
        </div>
      </section>
    );
  }
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
          {products.map((product) => {
            // Helper to handle the API's images[0].url vs Dummy image string
            const mainImage = product.images?.length > 0 
              ? product.images[0].url 
              : product.image;

            return (
              <div
                key={product._id || product.id}
                className="group cursor-pointer transition hover:scale-105"
              >
                <div className="relative w-full h-80 overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400";
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="mt-2">
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    {product.brand || "Collection"}
                  </p>
                  <h3 className="text-gray-900 font-bold text-sm truncate">
                    {product.name}
                  </h3>
                  <p className="text-gray-900 font-bold mt-1">
                    ${(product.price || 0).toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {product.colors ? `Available in ${product.colors} colors` : "Original Edition"}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mt-1">
                    <Rating value={5} size="small" readOnly sx={{ color: '#E67E22' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-10">
          <button className="px-8 py-3 bg-black text-white text-sm font-bold rounded-full hover:bg-neutral-800 transition shadow-lg">
            VIEW ALL PRODUCTS
          </button>
        </div>
      </div>
    </section>
  );
};

import { useEffect, useState } from "react";
import { useProductStore } from "../../../../services/productService";
import { getSubdomain } from "../../../../storeResolver";
import { ShoppingBagOutlined } from "@mui/icons-material";

const DUMMY_PRODUCTS = [
  { id: 1, brand: "MAJESTIC", name: "RELAXED WOOL COAT", price: 180, colors: 2, image: "https://images.unsplash.com/photo-1620247405612-18f042ea68cf?q=80&w=388" },
  { id: 2, brand: "KOMONO", name: "MINIMAL LEATHER BELT", price: 55, colors: 3, image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=400" },
  { id: 3, brand: "CLOUDNOLA", name: "OVERSIZED KNIT SWEATER", price: 72, colors: 4, image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400" },
  { id: 4, brand: "KALEIDOSCOPE", name: "TAILORED TROUSERS", price: 98, colors: 2, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400" },
];

export default function AllProducts() {
  const { fetchStoreProducts, setLocalProducts, products, loading } = useProductStore();
  const [displayProducts, setDisplayProducts] = useState([]);

  useEffect(() => {
    const initPage = async () => {
      const isDemo = localStorage.getItem("demo") === "true";
      const subdomain = getSubdomain();

      if (isDemo || !subdomain) {
        // Set Zustand store and local state with dummy data
        setLocalProducts(DUMMY_PRODUCTS);
        setDisplayProducts(DUMMY_PRODUCTS);
      } else {
        // Fetch from API for the specific store
        await fetchStoreProducts(subdomain);
      }
    };

    initPage();
  }, [fetchStoreProducts, setLocalProducts]);

  // Update local display state when Zustand products change
  useEffect(() => {
    if (products) {
      setDisplayProducts(products);
    }
  }, [products]);

  if (loading) return <div className="py-20 text-center">Loading collection...</div>;

  return <AllProductsSection products={displayProducts} />;
}