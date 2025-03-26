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
  const [isLoading, setIsLoading] = useState(true);  // 🔥 Estado de carga

  useEffect(() => {
    const cargarDatos = async () => {
      if (!postulante) {
        setIsLoading(false); // 🔥 Evita que la carga quede infinita si no hay postulante
        return;
      }

      try {
        console.log("🔄 Cargando datos para postulante:", postulante);

        const datosCarpeta = await obtenerCarpetaPostulante(
          postulante.nombre, 
          postulante.id 
        );

        console.log("📂 Datos de la carpeta (JSON bruto):", datosCarpeta);

        // 🔍 Extraer nombres de archivos de "body" y quitar extensión
        const archivosSinExtension = JSON.parse(datosCarpeta.archivos).body.map(
          (archivo) => archivo.nombreArchivo.split(".")[0]
        );

        console.log("📂 Documentos en carpeta sin extensión:", archivosSinExtension);

        //  Filtrar documentos NO adjuntados
        const documentosFaltantes = postulante.documentos.filter(
          (doc) => !archivosSinExtension.includes(doc)
        );

        console.log("📜 Documentos faltantes por adjuntar:", documentosFaltantes);

        // Si no hay documentos pendientes, activar el mensaje de revisión
        setEsperandoRevision(documentosFaltantes.length === 0);

        // Guardar los documentos que faltan en el estado
        setDocumentos(documentosFaltantes.map((doc) => ({ nombre: doc, adjuntado: null })));
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
      } finally {
        setIsLoading(false);  // 🔥 Finaliza la carga
      }
    };

    cargarDatos();
  }, [postulante]); 

  const handleEnviar = async () => {
    if (!postulante) return;

    const payload = {
      idPostulante: postulante.id,
      nombrePostulante: postulante.nombre,
      documentos: Object.values(archivosBase64),
    };

    try {
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
          <p>⏳ Cargando documentos...</p>  // 🔥 Mensaje de carga
        ) : esperandoRevision ? (
          <p>✅ Esperando por revisar datos.</p>
        ) : documentos.length > 0 ? (
          documentos.map((doc, index) => (
            <div key={index} className="document-item">
              <span className="document-name">{doc.nombre}</span>
              <div className="boton-container">
                <button className="upload-button" onClick={() => handleAdjuntar(index, doc, setArchivosBase64, setArchivosAdjuntos)}>
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
          <button className="enviar-button" disabled={!isReadyToSend} onClick={handleEnviar}>
            Enviar
          </button>
        </div>
      )}
    </div>
  );
};

export default Principal;