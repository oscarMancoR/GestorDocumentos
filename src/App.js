import React, { useState, useEffect } from "react";
import { obtenerPostulante } from "./services/api";
import Principal from "./Pages/Principal";
import "./App.css";
import Header from "./components/Header";
import img1 from "./assets/img1.jpeg";
import img2 from "./assets/img2.jpg";
import img3 from "./assets/img3.jpg";

const images = [img1, img2, img3];

const App = () => {
  const [postulante, setPostulante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPostulante = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id"); // Obtiene el ID de la URL      
      console.log("🔍 ID obtenido de la URL:", id);

      if (!id) {
        setError("No se encontró un ID en la URL.");
        setLoading(false);
        return;
      }

      try {
        console.log("📡 Solicitando datos del postulante...");
        const data = await obtenerPostulante(id);
        setPostulante(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostulante();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="image-slider">
          <img src={images[currentImageIndex]} alt="Cargando..." className="full-screen-image" />
        </div>
      </div>
    );
  }
  
  if (error) return <p>{error}</p>;

  return (
    <div className="App">
      <Header />
      {/* 🔥 Cambio: Pasar el objeto 'postulante' completo en lugar de solo el ID */}
      <Principal postulante={postulante} /> 
    </div>
  );
};

export default App;
