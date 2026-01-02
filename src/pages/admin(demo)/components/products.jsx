import { useState } from "react";
import { Box, Typography, Button, Chip, Checkbox, IconButton } from "@mui/joy";
import { Trash2 } from "lucide-react";

const allProducts = [
  { name: "Gabriela Cashmere Blazer", sku: "SKU 11456", price: "₦113.99", stock: "1113", status: "Active" },
  { name: "Loewe Hooded Jacket - Blue", sku: "SKU 11456", price: "₦113.99", stock: "721", status: "Active" },
  { name: "Sandro Jacket - Black", sku: "SKU 11456", price: "₦113.99", stock: "407", status: "Active" },
  { name: "Prada Leather Coat", sku: "SKU 11457", price: "₦299.99", stock: "312", status: "Active" },
  { name: "Balenciaga Hoodie", sku: "SKU 11458", price: "₦199.99", stock: "523", status: "Active" },
  { name: "Gucci Sneakers", sku: "SKU 11459", price: "₦399.99", stock: "214", status: "Active" },
  { name: "Burberry Trench Coat", sku: "SKU 11460", price: "₦499.99", stock: "112", status: "Active" },
  { name: "Versace Sunglasses", sku: "SKU 11461", price: "₦149.99", stock: "801", status: "Active" },
];

function SortHeader({ label }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography fontSize={13}>{label}</Typography>
    </Box>
  );
}

export default function ProductsTable() {
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = allProducts.slice(startIndex, startIndex + itemsPerPage);

  const allChecked = selected.length === currentProducts.length;

  const toggleAll = () => {
    if (allChecked) {
      setSelected([]);
    } else {
      setSelected(currentProducts.map((_, i) => i));
    }
  };

  const toggleItem = (index) => {
    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index));
    } else {
      setSelected([...selected, index]);
    }
  };

  const totalPages = Math.ceil(allProducts.length / itemsPerPage);

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <Box
        sx={{
          minWidth: 800,
          backgroundColor: "#fff",
          borderRadius: "2px",
          border: "1px solid",
          borderColor: "neutral.200",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "40px 3fr 1.4fr 1.2fr 1fr 1fr",
            px: 3,
            py: 2,
            fontSize: 13,
            color: "neutral.600",
            borderBottom: "1px solid",
            borderColor: "neutral.200",
            alignItems: "center",
          }}
        >
          <Checkbox size="sm" checked={allChecked} onChange={toggleAll} />
          <SortHeader label="Product Name" />
          <SortHeader label="Purchase Unit Price" />
          <SortHeader label="Stock" />
          <Typography className="text-[13px]!">Status</Typography>
          <Typography className="text-[13px]!">Action</Typography>
        </Box>

        {/* Rows */}
        {currentProducts.map((product, index) => (
          <Box
            key={index}
            sx={{
              display: "grid",
              gridTemplateColumns: "40px 3fr 1.4fr 1.2fr 1fr 1fr",
              px: 3,
              py: 2,
              alignItems: "center",
              borderBottom: index !== currentProducts.length - 1 ? "1px solid" : "none",
              borderColor: "neutral.100",
              "&:hover": { backgroundColor: "neutral.50" },
            }}
          >
            <Checkbox
              size="sm"
              checked={selected.includes(index)}
              onChange={() => toggleItem(index)}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: "8px", backgroundColor: "neutral.200" }} />
              <Box>
                <Typography level="body-sm" fontWeight={600}>
                  {product.name}
                </Typography>
                <Typography level="body-xs" color="neutral">
                  {product.sku}
                </Typography>
              </Box>
            </Box>

            <Typography level="body-sm">{product.price}</Typography>
            <Typography level="body-sm">{product.stock}</Typography>

            <Chip size="sm" color="success" variant="soft">
              {product.status}
            </Chip>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                size="sm"
                variant="soft"
                sx={{
                  backgroundColor: "neutral.100",
                  color: "neutral.800",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "neutral.200" },
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="plain"
                sx={{
                  minWidth: 32,
                  px: 0,
                  color: "neutral.500",
                  "&:hover": { color: "danger.500", backgroundColor: "transparent" },
                }}
              >
                <Trash2 size={16} />
              </Button>
            </Box>
          </Box>
        ))}

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1,
            px: 3,
            py: 2,
            borderTop: "1px solid",
            borderColor: "neutral.200",
            backgroundColor: "neutral.50",
          }}
        >
          <Button
            size="sm"
            variant="outlined"
            className="bg-neutral-100! text-neutral-700! border-neutral-500! hover:bg-neutral-200!"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <Typography level="body-sm">
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            size="sm"
            variant="outlined"
            className="border-neutral-500! text-neutral-700! bg-neutral-50! hover:bg-neutral-200!"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
