
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/principal.css";
import FileService from "../components/FileUploader";

const Principal = ({ postulante }) => {
  const [documentos, setDocumentos] = useState([]);
  const [archivosAdjuntos, setArchivosAdjuntos] = useState({});
  const [archivosBase64, setArchivosBase64] = useState({});

  useEffect(() => {
    if (postulante?.documentos?.body) {
      setDocumentos(postulante.documentos.body);
    }
  }, [postulante]);

  const handleAdjuntar = async (index, documentName) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.png,.docx"; // Extensiones permitidas

    input.onchange = async (event) => {
      const file = event.target.files[0];

      if (file) {
        try {
          const base64 = await toBase64(file);
          setArchivosBase64((prevState) => ({
            ...prevState,
            [index]: { nombreDocumento: file.name, contenidoBase64: base64 }
          }));

          setArchivosAdjuntos((prevState) => ({
            ...prevState,
            [index]: "success"
          }));
        } catch (error) {
          setArchivosAdjuntos((prevState) => ({
            ...prevState,
            [index]: "error"
          }));
        }
      }
    };

    input.click();
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Eliminar el prefijo 'data:application/pdf;base64,'
      reader.onerror = (error) => reject(error);
    });
  };

  const handleEnviar = async () => {
    if (!postulante) return;

    const payload = {
      idPostulante: postulante.id || "ID_NO_DISPONIBLE",
      nombrePostulante: postulante.nombre || "NOMBRE_NO_DISPONIBLE",
      documentos: Object.values(archivosBase64)
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

  // Verificar si todos los documentos están adjuntados correctamente
  const isReadyToSend = documentos.length > 0 &&
    documentos.every((_, index) => archivosAdjuntos[index] === "success");

  return (
    <div className="principal-container">
      {/* Mensaje de bienvenida */}
      <h2 className="bienvenida">
        Bienvenido {postulante?.nombre || "Postulante"}, te invitamos a adjuntar todos los documentos requeridos para continuar con tu proceso dentro de la institución.
      </h2>

      {/* Correo debajo del mensaje */}
      <p className="correo">{postulante?.correo || "No disponible"}</p>

      {/* Documentos */}
      <div className="document-container">
        {documentos.length > 0 ? (
          documentos.map((doc, index) => (
            <div key={index} className="document-item">
              <span className="document-name">{doc.nombreDocumento}</span>

              <div className="boton-container">
                <button className="upload-button" onClick={() => handleAdjuntar(index, doc.nombreDocumento)}>
                  Adjuntar
                </button>

                {/* Espacio para el icono de estado */}
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

      {/* Botón enviar */}
      <div className="enviar-container">
        <button className="enviar-button" disabled={!isReadyToSend} onClick={handleEnviar}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Principal;
