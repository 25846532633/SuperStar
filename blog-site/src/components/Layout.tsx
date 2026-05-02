import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuroraBackground from "./AuroraBackground";
import CursorGlow from "./CursorGlow";

export default function Layout() {
  return (
    <>
      <AuroraBackground />
      <CursorGlow />
      <Navbar />
      <main className="page-layout">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
