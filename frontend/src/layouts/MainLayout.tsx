import { Outlet } from "react-router-dom";
import Footer from "../components/shared/Footer";
import React from "react";


export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-grow flex flex-col">

        <Outlet />
      </main>
      <Footer />
    </div>

  
  );
};