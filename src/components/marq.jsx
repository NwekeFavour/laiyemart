import { Box, Typography } from "@mui/joy";
import { motion } from "framer-motion";

const phrases = [
  "Launch Your Store in Days",
  "No Headaches, Just Sales",
  "Built to Convert, Optimized to Grow",
  "Flexible, Scalable, Fast",
  "Your Ecommerce, Done Right",
];

export default function MarqueeSection() {
  return (
    <Box
      sx={{
        overflow: "hidden",
        backgroundColor: "neutral.50",
        py: 4,
        position: "relative",
      }}
    >
      <motion.div
        style={{
          display: "flex",
          whiteSpace: "nowrap",
        }}
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 40,
          ease: "linear",
        }}
      >
        {phrases.map((text, index) => (
          <Typography
            key={index}
            level="h4"
            sx={{
              mx: 6,
              fontWeight: 700,
              fontSize: { xs: "1.5rem", md: "1.5rem" },
              display: "inline-block",
            }}
            className="flex! gap-2 text lg:text-[px]"
          >
            <span className="flex items-center justify-center w-fit h-12 text-[40px]!">*</span> {text} 
          </Typography>
        ))}
      </motion.div>
    </Box>
  );
}
