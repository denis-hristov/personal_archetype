// App.jsx
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";

export default function App() {
  return (
    <div className="p-6">
      <nav className="pa-topnav">
        <NavLink to="/" end className="pa-link">Home</NavLink>
        <NavLink to="/about" className="pa-link">About</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}