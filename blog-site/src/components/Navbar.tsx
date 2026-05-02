import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "首页" },
  { path: "/notes", label: "笔记" },
  { path: "/links", label: "Links" },
  { path: "/about", label: "关于" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Aurora Garden
      </Link>
      <ul className="navbar-links">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? "active" : ""}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
