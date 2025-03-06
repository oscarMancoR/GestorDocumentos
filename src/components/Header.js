import React from "react";
import "../styles/Header.css";
import logo from "../assets/logo.png";
import userPhoto from "../assets/userPhoto.jpeg";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={logo} alt="Logo" className="logo" />
        <div className="header-info">
          <h1 className="header-title">Hospital San Antonio de Mitú</h1>
          <p className="header-subtitle">NIT: 123456789</p>
          <p className="header-subtitle">Dirección: Calle 1 #2-3</p>
          <p className="header-subtitle">Mitú, Vaupés</p>
        </div>
      </div>
      <h1 className="header-center">Gestor Documental</h1>
      <img src={userPhoto} alt="Usuario" className="header-photo" />
    </header>
  );
};

export default Header;