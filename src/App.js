import React, { useState, useEffect } from "react";
import { obtenerPostulante } from "./services/api";
import Principal from "./pages/Principal";
import "./App.css";
import Header from "./components/Header";

const App = () => {
  const [postulante, setPostulante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Cargando datos...</p>;
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