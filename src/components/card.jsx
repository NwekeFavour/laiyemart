import { Box, Typography, Card, CardContent } from "@mui/joy";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const items = [
  {
    title: "Launch faster",
    description: "Go from idea to a live store in days, not weeks.",
  },
  {
    title: "Built to convert",
    description:
      "Clean, professional layouts optimized for real ecommerce sales.",
  },
  {
    title: "Flexible & scalable",
    description:
      "Customize freely and grow without needing to rebuild your store.",
  },
  {
    title: "No setup friction",
    description:
      "Products, payments, and checkout are ready out of the box.",
  },
];

export default function ValuePropsSection() {
  return (
    <Box
      component="section"
      sx={{
        backgroundColor: "neutral.50",
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
      }}
    >
      {/* Heading */}
      <Box
        sx={{
          maxWidth: 720,
          mx: "auto",
          textAlign: "center",
          mb: { xs: 6, md: 10 },
        }}
      >
        <Typography className="md:text-[32px]! text-[24px]! lg:text-[40px]!" level="h2" sx={{ mb: 2, fontWeight: 600 }}>
          Everything you need to launch, without the complexity
        </Typography>

        <Typography level="body-md" sx={{ color: "neutral.600" }}>
          Built for ecommerce owners who want speed, structure, and room to grow.
        </Typography>
      </Box>

      {/* Value Panels */}
      <Box
        sx={{
          maxWidth: 1120,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {items.map((item, index) => (
          <MotionCard
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            sx={{
              borderRadius: "lg",
              backgroundColor: "#f1f1ee",
              border: "none",
              borderColor: "neutral.200",
              boxShadow: "none",
              cursor: "default",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                level="title-md"
                sx={{ mb: 1.5, fontWeight: 600 }}
              >
                {item.title}
              </Typography>

              <Typography
                level="body-sm"
                sx={{ color: "neutral.600", lineHeight: 1.6 }}
              >
                {item.description}
              </Typography>
            </CardContent>
          </MotionCard>
        ))}
      </Box>
    </Box>
  );
}
