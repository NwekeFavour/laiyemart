import React from "react";

const FEATURED_PRODUCTS = [
  {
    id: 1,
    brand: "MAJESTIC",
    name: "RELAXED WOOL COAT",
    price: 180,
    colors: 2,
    image:
      "https://images.unsplash.com/photo-1620247405612-18f042ea68cf?q=80&w=400&auto=format&fit=crop",
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

const FeaturedPicksGrid = () => {
  return (
    <section className="px-4 py-12 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h2 className="lg:text-[34px]! md:text-[30px]! text-[26px]! font-extrabold! tracking-tight">FEATURED PICKS</h2>
        <p className="text-gray-500 mt-2">
          Hand-selected styles curated for everyday wear.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {FEATURED_PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="cursor-pointer group overflow-hidden rounded-md"
          >
            {/* Image */}
            <div className="relative w-full h-[360px] sm:h-[400px] md:h-[420px] overflow-hidden rounded-md bg-gray-200">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400";
                }}
              />
            </div>

            {/* Info */}
            <div className="mt-2">
              <p className="text-gray-500 text-sm font-semibold">{product.brand}</p>
              <p className="font-semibold text-base truncate">{product.name}</p>
              <p className="font-semibold text-base mt-1">${product.price.toFixed(2)}</p>
              <p className="text-gray-500 text-sm">Available in {product.colors} colors</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedPicksGrid;
