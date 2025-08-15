import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex-1 pt-16 lg:pt-20"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
};