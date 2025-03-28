import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/principal.css";
import { handleAdjuntar } from "../utiliti/handleAdjuntar";
import { obtenerCarpetaPostulante } from "../services/api";

const Principal = ({ postulante }) => {  
  const [documentos, setDocumentos] = useState([]);
  const [archivosAdjuntos, setArchivosAdjuntos] = useState({});
  const [archivosBase64, setArchivosBase64] = useState({});
  const [esperandoRevision, setEsperandoRevision] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [animarBoton, setAnimarBoton] = useState(false);
  const [enviando, setEnviando] = useState(false); // Estado para mostrar el spinner

  useEffect(() => {
    const cargarDatos = async () => {
      if (!postulante) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("🔄 Cargando datos para postulante:", postulante);

        const datosCarpeta = await obtenerCarpetaPostulante(postulante.nombre, postulante.id);
        console.log("📂 Datos de la carpeta:", datosCarpeta);

        if (!datosCarpeta.existe) {
          console.warn("La carpeta no existe. Mostrando todos los documentos.");
          setEsperandoRevision(false);
          setDocumentos(postulante.documentos.map((doc) => ({ nombre: doc, adjuntado: null })));
          return;
        }

        let archivosEnCarpeta = [];
        if (datosCarpeta.archivos) {
          try {
            const parsedData = JSON.parse(datosCarpeta.archivos);
            if (parsedData.body && Array.isArray(parsedData.body)) {
              archivosEnCarpeta = parsedData.body.map((archivo) =>
                archivo.nombreArchivo.split(".")[0]
              );
            }
          } catch (error) {
            console.error("❌ Error al parsear archivos de carpeta:", error);
          }
        }

        console.log("📂 Documentos en carpeta sin extensión:", archivosEnCarpeta);

        const documentosFaltantes = postulante.documentos.filter(
          (doc) => !archivosEnCarpeta.includes(doc)
        );

        console.log("📜 Documentos faltantes:", documentosFaltantes);

        setEsperandoRevision(documentosFaltantes.length === 0);
        setDocumentos(documentosFaltantes.map((doc) => ({ nombre: doc, adjuntado: null })));
        
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        alert("Hubo un error al cargar los datos. Intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, [postulante]);

  const handleEnviar = async () => {
    if (!postulante) return;

    setEnviando(true); // Mostrar spinner
    setAnimarBoton(true);

    setTimeout(() => {
      setAnimarBoton(false);
    }, 500);

    const payload = {
      idPostulante: postulante.id,
      nombrePostulante: postulante.nombre,
      documentos: Object.values(archivosBase64),
    };

    try {
      console.log("📤 Payload enviado:", JSON.stringify(payload, null, 2));
      const response = await axios.post(
        "https://prod-03.brazilsouth.logic.azure.com:443/workflows/53bbfdc7e23b47aeb192e1953a293db4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=NBENSTHDHtcxsIIEPMuDXraLnGjGq1yUy4ACGi6KdtM",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ Enviado con éxito:", response.data);
      alert("Documentos enviados correctamente.");
    } catch (error) {
      console.error("❌ Error al enviar:", error);
      alert("Hubo un error al enviar los documentos.");
    } finally {
      setEnviando(false); // Ocultar spinner
    }
  };

  const isReadyToSend = documentos.length > 0 && 
    documentos.every((doc, index) => archivosAdjuntos[index] === "success"); 

  return (
    <div className="principal-container">
      <h2 className="bienvenida">
        Bienvenido {postulante?.nombre || "Postulante"}, te invitamos a adjuntar todos los documentos requeridos para continuar con tu proceso dentro de la institución.
      </h2>

      <p className="correo">{postulante?.correo || "No disponible"}</p>

      <div className="document-container">
        {isLoading ? (
          <p>⏳ Cargando documentos...</p>
        ) : esperandoRevision ? (
          <p>✅ Esperando por revisar datos.</p>
        ) : documentos.length > 0 ? (
          documentos.map((doc, index) => (
            <div key={index} className="document-item">
              <span className="document-name">{doc.nombre}</span>
              <div className="boton-container">
                <button className="upload-button" onClick={() => handleAdjuntar(index, doc.nombre, setArchivosBase64, setArchivosAdjuntos)}>
                  Adjuntar
                </button>
                <span className="status-icon">
                  {archivosAdjuntos[index] === "success" ? "✅" : archivosAdjuntos[index] === "error" ? "❌" : ""}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No hay documentos requeridos.</p>
        )}
      </div>

      {!isLoading && !esperandoRevision && (
        <div className="enviar-container">
          <button 
            className={`enviar-button ${animarBoton ? "boton-enviar-animado" : ""}`} 
            disabled={!isReadyToSend || enviando} 
            onClick={handleEnviar}
          >
            Enviar
          </button>
        </div>
      )}

      {enviando && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Principal;
