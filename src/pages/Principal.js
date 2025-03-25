import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/principal.css";
import { handleAdjuntar } from "../utiliti/handleAdjuntar"; // Importar la función

const Principal = ({ postulante }) => {
  //Estado para almacenar la lista de documentos requeridos
  const [documentos, setDocumentos] = useState([]);
  //Estado para almacenar los archivos adjuntados
  const [archivosAdjuntos, setArchivosAdjuntos] = useState({});
  //Estado para almacenar los archivos en formato Base64 antes de enviarlos
  const [archivosBase64, setArchivosBase64] = useState({});

  //useEffect: Cuando cambia el postulante, cargamos sus documentos
  useEffect(() => {
    
    if (postulante?.documentos) {
      console.log("Documentos recibidos:", postulante?.documentos);
      setDocumentos(postulante.documentos);
    }
  }, [postulante]);
 
  //Función para enviar los documentos adjuntados a la API
  const handleEnviar = async () => {
    if (!postulante) return;

    // 📌 Creamos el objeto con la información del postulante y sus documentos  
    const payload = {
      idPostulante: postulante.id || "ID_NO_DISPONIBLE",
      nombrePostulante: postulante.nombre || "NOMBRE_NO_DISPONIBLE",
      documentos: Object.values(archivosBase64)
    };

    try {
      //Hacemos una petición POST a la API con los documentos adjuntos
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
     //Validamos si todos los documentos han sido adjuntados para habilitar el botón "Enviar" 
     const isReadyToSend =
     documentos.length > 0 &&
     documentos.every((_, index) => archivosAdjuntos[index] === "success");

  return (
    
    <div className="principal-container">
      <h2 className="bienvenida">
        Bienvenido {postulante?.nombre || "Postulante"}, te invitamos a adjuntar todos los documentos requeridos para continuar con tu proceso dentro de la institución.
      </h2>
       {/*  Mostramos el correo del postulante */}
      <p className="correo">{postulante?.correo || "No disponible"}</p>

       {/*  Sección para mostrar los documentos requeridos */}
      <div className="document-container">
        {documentos.length > 0 ? (

          documentos.map((doc, index) => (
          <div key={index} className="document-item">

            {/* 📜 Mostramos el nombre del documento */}
           <span className="document-name">{doc}</span> {/* Antes era doc.nombreDocumento */}

           <div className="boton-container">

             {/*  Botón para adjuntar archivos */}
           <button className="upload-button" onClick={() => handleAdjuntar(index, doc,setArchivosBase64,
                      setArchivosAdjuntos)}>Adjuntar
           </button>

                 {/*  Iconos de estado (Adjuntado o error) */}
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

        {/*  Botón de envío (deshabilitado hasta que todos los documentos sean adjuntados) */}
      <div className="enviar-container">
      <button
          className="enviar-button"
          disabled={!isReadyToSend}
          onClick={handleEnviar}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Principal;
