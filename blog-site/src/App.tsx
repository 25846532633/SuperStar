import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import NoteDetail from "./pages/NoteDetail";
import Links from "./pages/Links";
import About from "./pages/About";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="notes" element={<Notes />} />
          <Route path="notes/:slug" element={<NoteDetail />} />
          <Route path="links" element={<Links />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
