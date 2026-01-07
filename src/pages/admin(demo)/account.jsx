// import { Box, Typography, Avatar, IconButton, Select, Option, Input, Button, Drawer, Textarea, } from "@mui/joy";
// import Sidebar from "./components/sidebar";
// import ProductsTable from "./components/products";
// import { Bell, HelpCircle, LayoutDashboard, Menu, MessageCircle, Package, Plus, Search, Settings, ShoppingBag, ShoppingCart, Users, X } from "lucide-react";
// import { Link } from "react-router-dom";
// import { useState } from "react";
// import Header from "../../components/mainheader";
// import { Label } from "@mui/icons-material";
// import AddProductForm from "./components/addProducts";
// import DemoHome from "../(demo)/home";
// import { div } from "framer-motion/client";

// export default function Account({ setMode }) {
//   const [mobileOpen, setMobileOpen] = useState(false); // drawer state
//   const [demo, setDemo] = useState(false);
//   const [productMode, createProductMode] = useState(false);
// const navSection = {
//   main: [
//     { label: "Dashboard", icon: LayoutDashboard },
//     { label: "Orders", icon: ShoppingBag },
//     { label: "Customers", icon: Users },
//     { label: "Categories", icon: MessageCircle },
//     { label: "Products", icon: Package, active: true },

//   ],
//   settings: [
//     { label: "Settings", icon: Settings },
//     { label: "Help", icon: HelpCircle },
//   ],
// };
//   return (
//     <div className="">
//       <div className="bg-neutral-800/30 mb-3">
//       <Header/>
//       </div>
//       {/* Top Checkout + Go back */}
//       <div className="mt-4 mx-3 md:ms-3">
//         <div className="flex items-center justify-between md:mx-6 mb-4 ">
//           { !demo && (<Button
//             variant="solid"
//             className="bg-neutral-100! text-neutral-700!"
//             onClick={() => setDemo(!demo)}
//             startDecorator={<ShoppingCart size={16} />}
//             sx={{ borderRadius: "8px", px: 3 }}
//           >
//             Check Out StoreFront
//           </Button>)}
//           <div>
//             <Link onClick={() => setMode(false)}>Go back</Link>
//           </div>
//         </div>


//         {demo && <div className="md:m-10 m-3 shadow-lg"><DemoHome /></div>}
//         {!demo && <div className="md:m-10 m-3 shadow-lg">
//           <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
//             {/* TOP HEADER */}
//             <AdminHeader onMenuClick={() => setMobileOpen(true)} />

//             {/* MAIN LAYOUT */}
//             <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
//               {/* Desktop Sidebar */}
//               <Box sx={{ display: { xs: "none", md: "block" } }}>
//                 <Sidebar />
//               </Box>

//               {demo && <DemoHome />}

//               {/* Main content */}
//               {!productMode && (<Box
//                 sx={{
//                   flex: 1,
//                   p: { xs: 2, md: 2 },
//                   overflowX: "auto",
//                   backgroundColor: "#f5f5f5",
//                 }}
//               >
//                 {/* Products Controls Bar */}
//                 <Box
//                   sx={{
//                     mb: 0.5,
//                     display: "flex",
//                     flexDirection: { xs: "column", md: "row" },
//                     gap: 2,
//                     backgroundColor: "#fff",
//                     alignItems: { md: "center" },
//                     justifyContent: "space-between",
//                     px: 1,
//                     py: 3,
//                   }}
//                 >
//                   {/* Left: Title */}
//                   <Box>
//                     <Typography level="h4" fontWeight={700}>
//                       Products
//                     </Typography>
//                     <Typography level="body-sm" color="neutral">
//                       Manage your store inventory and listings
//                     </Typography>
//                   </Box>

//                   {/* Right: Controls */}
//                   <Box
//                     sx={{
//                       display: "flex",
//                       flexWrap: "wrap",
//                       gap: 1.5,
//                       alignItems: "center",
//                     }}
//                   >
//                     {/* Search */}
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         border: "1px solid #d1d5db",
//                         borderRadius: 6,
//                         padding: "4px 8px",
//                         width: 220,
//                       }}
//                     >
//                       <Search size={16} style={{ marginRight: 6 }} />
//                       <input
//                         type="text"
//                         placeholder="Search products..."
//                         style={{
//                           border: "none",
//                           outline: "none",
//                           width: "100%",
//                           fontSize: 14,
//                         }}
//                       />
//                     </div>

//                     {/* Status Filter */}
//                     <Select size="sm" defaultValue="all">
//                       <Option value="all">All status</Option>
//                       <Option value="active">Active</Option>
//                     </Select>

//                     {/* Sort */}
//                     <Select size="sm" defaultValue="default">
//                       <Option value="default">Sort by</Option>
//                       <Option value="price">Price</Option>
//                       <Option value="date">Date</Option>
//                     </Select>

//                     {/* Add Product */}
//                     <Button
//                       size="sm"
//                       startDecorator={<Plus size={16} />}
//                       sx={{
//                         backgroundColor: "neutral.600",
//                         color: "#fff",
//                         fontWeight: 600,
//                         px: 1,
//                         "&:hover": { backgroundColor: "neutral.500" },
//                       }}
//                       onClick={() => createProductMode(!productMode)}
//                     >
//                       Add product
//                     </Button>
//                   </Box>
//                 </Box>

//                 {/* Products Table */}
//                 <ProductsTable />
//               </Box>)}

//               {productMode && <AddProductForm setProductMode={createProductMode} />}
//             </Box>

//             {/* Mobile Drawer: Move OUTSIDE flex content */}
//             <Drawer
//               open={mobileOpen}
//               onClose={() => setMobileOpen(false)}
//               variant="temporary"
//               sx={{
//                 display: { xs: "block", md: "none" },
//                 "& .MuiDrawer-paper": { width: 260, p: 3 },
//               }}
//             >
//               {/* Close button */}
//               <Box className="pt-3!" sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
//                 <IconButton onClick={() => setMobileOpen(false)}>
//                   <X />
//                 </IconButton>
//               </Box>

//               {/* Mobile Sidebar Content */}
//               <Box className="p-3!" sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
//                 {/* MAIN Links */}
//                 <NavGroup title="MAIN" items={navSection.main} />

//                 {/* SETTINGS Links */}
//                 <NavGroup title="SETTINGS" items={navSection.settings} />
//               </Box>
//             </Drawer>

//           </Box>
//         </div>}
//       </div>

//     </div>
//   );
// }


// function AdminHeader({ onMenuClick }) {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         px: { xs: 2, md: 4 },
//         py: 2,
//         backgroundColor: "#fff",
//         position: "sticky",
//         top: 0,
//         zIndex: 10,
//         borderBottom: "1px solid",
//         borderColor: "neutral.200",
//       }}
//     >
//       {/* Left: Mobile menu button + Brand */}
//       <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//         {/* Mobile menu button */}
//         <IconButton
//           onClick={onMenuClick} // pass toggle function from parent
//           sx={{
//             display: { xs: "flex", md: "none" },
//           }}
//           className="lg:hidden block"
//         >
//           <Menu size={20} />
//         </IconButton>

//         {/* Brand */}
//         <Typography className="lg:block! hidden!" level="h4" sx={{ fontWeight: 700 }}>
//           LaiyeMart
//         </Typography>
//       </Box>

//       {/* Right: User Section */}
//       <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//         <Typography level="body-sm" sx={{ fontWeight: 500 }}>
//           Welcome, Favour
//         </Typography>
//         <Avatar src="/avatar.png" size="sm" />
//         <IconButton
//           variant="plain"
//           color="neutral"
//           sx={{
//             "&:hover": { backgroundColor: "transparent" },
//           }}
//         >
//           <Bell size={20} />
//         </IconButton>
//       </Box>
//     </Box>
//   );
// }


// function NavGroup({
//   title,
//   items,
// }) {
//   return (
//     <Box sx={{ mb: 4 }}>
//       <Typography
//         level="body-xs"
//         sx={{
//           color: "neutral.500",
//           fontWeight: 600,
//           mb: 1.5,
//           letterSpacing: 1,
//         }}
//       >
//         {title}
//       </Typography>

//       <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
//         {items.map(({ label, icon: Icon, active }) => (
//           <Box
//             key={label}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1.5,
//               px: 2,
//               py: 1.2,
//               borderRadius: "10px",
//               cursor: "pointer",
//               fontSize: 14,
//               fontWeight: active ? 600 : 500,
//               backgroundColor: active ? "neutral.600" : "transparent",
//               color: active ? "#fff" : "neutral.700",
//               transition: "background-color 0.2s ease",
//               "&:hover": {
//                 backgroundColor: active ? "neutral.400" : "neutral.100",
//               },
//             }}
//           >
//             <Icon size={16} />
//             {label}
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   );
// }
import React, { useState } from "react";
import DashboardLayout from "./components/dashboardlayout";
import SalesActivity from "./components/sales";
import RecentOrders from "./components/order-table";
import ProductsTable from "./components/products";
import Analytics from "./components/analytics";
import CategoriesTable from "./components/categories";
import OrderListComponent from "./components/orderComp";
import DemoHome from "../(demo)/home";
import CustomerList from "./components/customerList";
import { ArrowLeftFromLine } from "lucide-react";

export default function Account() {
  const [isDark, setIsDark] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [demo, setDemo] = useState(false); // ✅ FIX: missing state

  return (
    <div className="min-h-screen ">
      {/* Demo overlay */}
      {demo && (
        <div className=" my-2 shadow-lg" >
          <div className="flex items-center gap-2 mb-2 ms-3" >
            <button
              onClick={() => setDemo(false)}
            >
              {demo && <ArrowLeftFromLine size={20} className="inline-block me-2" />}
            </button>
            <div className="w-8 h-8 rounded-md bg-red-500" />
            <span className={`font-bold text text-[13px] ${isDark ? "text-slate-200" : "text-gray-900"}`}>LAYEMART ONLINE STORE</span>
          </div>
          <DemoHome />
        </div>
      )}

      {/* Normal dashboard */}
      {!demo && (
        <DashboardLayout
          demo={demo}
          setDemo={setDemo}
          activePage={activePage}
          setActivePage={setActivePage}
        >
          {activePage === "dashboard" && <DashboardAnalytics isDark={isDark} />}
          {activePage === "products" && <ProductsTable isDark={isDark} />}
          {activePage === "categories" && <CategoriesTable isDark={isDark} />}
          {activePage === "orders" && <OrderListComponent isDark={isDark} />}
          {activePage === "customers" && <CustomerList isDark={isDark} /> }
        </DashboardLayout>
      )}


      {demo  && (
        <div>
          <div className="fixed bottom-3 left-2  z-20 lg:block hidden">
            <button
              onClick={() => setDemo(false)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-slate-600"
            >
              {demo ? 'Go Back to Dashboard' : 'Store Front'}
            </button>
          </div>
          <div className="fixed bottom-3 left-2  z-20 lg:hidden! block!">
            <button
              onClick={() => setDemo(false)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-slate-600"
            >
              {demo ? 'Dashboard' : 'Store Front'}
            </button>
          </div>
        </div>

    )}
    </div>
  );
}

/* ✅ Renamed for clarity */
function DashboardAnalytics({ isDark }) {
  return (
    <div
      className={` mb-6 rounded-lg ${
        isDark ? "bg-slate-800 text-slate-200" : "bg-white text-gray-900"
      }`}
    >
      <Analytics isDark={isDark} />
      <SalesActivity isDark={isDark} />
      <RecentOrders isDark={isDark} />
    </div>
  );
}
