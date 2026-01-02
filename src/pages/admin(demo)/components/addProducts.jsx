import { Box, Typography, Input, Textarea, Button, Chip } from "@mui/joy";
import { Check } from "lucide-react";
import { useState } from "react";

export default function AddProductForm({ createProductMode }) {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() && !categories.includes(categoryInput.trim())) {
      setCategories([...categories, categoryInput.trim()]);
      setCategoryInput("");
    }
  };

  const handleRemoveCategory = (cat) => {
    setCategories(categories.filter((c) => c !== cat));
  };

  return (
    <Box
      sx={{
        flex: 1,
        p: { xs: 2, md: 3 },
        overflowX: "auto",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography level="h4" fontWeight={700} mb={3}>
        Add New Product
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          backgroundColor: "#fff",
          p: 3,
          borderRadius: 2,
        }}
      >

        <Box className="lg:hidden! block! mb-4!" sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography level="body-md" fontWeight={600}>
            Product Images
          </Typography>
          <input
            type="file"
            accept="image/*"
            multiple
            className="w-full"
            onChange={handleImageUpload}
            style={{ border: "1px dashed #ccc", padding: 8, borderRadius: 6 }}
          />

          {images.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
              {/* First image large */}
              <Box
                sx={{
                  width: "100%",
                  height: 200,
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={URL.createObjectURL(images[0])}
                  alt="main"
                  className="w-fit!"
                  style={{ objectFit: "contain", width: "100%", height: "100%" }}
                />
              </Box>

              {/* Remaining images small */}
              {images.length > 1 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {images.slice(1).map((img, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        width: 80,
                        height: 80,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`thumb-${idx}`}
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          <Typography level="body-md" fontWeight={600}>
            Categories
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {categories.map((cat, idx) => (
              <Chip
                key={idx}
                variant="soft"
                color="neutral"
                endDecorator={<span onClick={() => handleRemoveCategory(cat)}>×</span>}
              >
                {cat}
              </Chip>
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Input
              placeholder="Type category and press Add"
              value={categoryInput}
              className="bg-neutral-200/50!"
              onChange={(e) => setCategoryInput(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button className="bg-gray-900!" onClick={handleAddCategory}>
              Add
            </Button>
          </Box>
        </Box>
        {/* Left: Product Details */}
        <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <label className="font-semibold!">Product Name</label>
          <Input className="bg-neutral-200/50!" placeholder="Product Name" />

          <label className="font-semibold!">Description</label>
          <Textarea
            className="bg-neutral-200/50! md:h-37.5"
            placeholder="Describe your product"
            multiline={"true"}
            minRows={4}
          />

          <label className="font-semibold!">Price</label>
          <Input className="bg-neutral-200/50!" placeholder="Price" type="number" />

          <label className="font-semibold!">SKU / Stock Keeping Unit</label>
          <Input className="bg-neutral-200/50!" placeholder="SKU" />

          <Typography level="body-xs" color="neutral.500">
            * You can upload multiple images. Recommended size: 800x800px. <br />
            * Categories help customers find your product easily. <br />
            * SKU is optional but useful for inventory management.
          </Typography>

            <Button
                variant="solid"
                startDecorator={<Check size={16} />} // ✅ Added check icon
                sx={{
                    backgroundColor: "neutral.600",
                    color: "#fff",
                    fontWeight: 600,
                    px: 1,
                    "&:hover": { backgroundColor: "neutral.500" },
                    mt: 2,
                }}
                onClick={() => createProductMode(false)}
                >
                Save Product
            </Button>
        </Box>

        {/* Right: Images + Category */}
        <Box className="lg:block! hidden!" sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography level="body-md" fontWeight={600}>
            Product Images
          </Typography>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{ border: "1px dashed #ccc", padding: 4, borderRadius: 6 }}
          />

          {images.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
              {/* First image large */}
              <Box
                sx={{
                  width: "100%",
                  height: 200,
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={URL.createObjectURL(images[0])}
                  alt="main"
                  style={{ objectFit: "contain", width: "100%", height: "100%" }}
                />
              </Box>

              {/* Remaining images small */}
              {images.length > 1 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {images.slice(1).map((img, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        width: 80,
                        height: 80,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`thumb-${idx}`}
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          <Typography level="body-md" fontWeight={600}>
            Categories
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {categories.map((cat, idx) => (
              <Chip
                key={idx}
                variant="soft"
                color="neutral"
                endDecorator={<span onClick={() => handleRemoveCategory(cat)}>×</span>}
              >
                {cat}
              </Chip>
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Input
              placeholder="Type category and press Add"
              value={categoryInput}
              className="bg-neutral-200/50!"
              onChange={(e) => setCategoryInput(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button className="bg-gray-900!" onClick={handleAddCategory}>
              Add
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
