import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuroraBackground from "./AuroraBackground";

export default function Layout() {
  return (
    <>
      <AuroraBackground />
      <Navbar />
      <main className="page-layout">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
