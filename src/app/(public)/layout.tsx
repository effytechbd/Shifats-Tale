import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-soft text-text flex flex-col selection:bg-accent selection:text-primary relative">
      {/* Public Header Navbar */}
      <Navbar />

      {/* Main Sections Body */}
      <main className="flex-grow">{children}</main>

      {/* Page Layout Footer */}
      <Footer />
    </div>
  );
}
