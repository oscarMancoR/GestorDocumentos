import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>Gestor Documental</h2>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/documentos">Mis Documentos</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;