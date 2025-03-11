/*import React, { useState, useEffect } from "react";
import "../styles/principal.css";

const Principal = () => {

  const [isChecked, setIsChecked] = useState(false);
  const [documentos, setDocumentos] = useState([]);
 
  useEffect(() => {
    const documentosEjemplo = [
      "Cédula de Identidad",
      "Certificado Médico",
      "RUT",
      "Hoja de Vida",
      "Antecedentes Disciplinarios",
      "Registro de Vacunación",
      "Certificado de Estudios",
      "Contrato Firmado",
      "Referencias Laborales",
      "Formulario de Postulación",
    ];
    setDocumentos(documentosEjemplo);
  }, []);

  // Manejo del cambio en el checkbox
  const handledCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  // Dividir documentos en dos columnas equilibradas
  const mitad = Math.ceil(documentos.length / 2);
  const columna1 = documentos.slice(0, mitad);
  const columna2 = documentos.slice(mitad);

  return (
    <div className="principal-container">
      <p>
        Bienvenido xxx, te invitamos a adjuntar todos los documentos requeridos para 
        continuar con tu proceso dentro de la institución.
      </p>

     

   
      /*<div className="checkBox-container">
        <input 
          type="checkbox"
          id="aceptarDatos"
          checked={isChecked}
          onChange={handledCheckboxChange}
        />  
        <label htmlFor="aceptarDatos">
          Acepto el tratamiento de mis datos personales conforme a la política de privacidad.
        </label>                       
      </div>   

    
     /* <div className="document-container">
        <div className="column">
          {columna1.map((doc, index) => (
            <div key={index} className="document-item">
              <span className="document-name">{doc}</span>
              <button className="upload-button">Adjuntar</button>
            </div>
          ))}
        </div>
        <div className="column">
          {columna2.map((doc, index) => (
            <div key={index} className="document-item">
              <span className="document-name">{doc}</span>
              <button className="upload-button">Adjuntar</button>
            </div>
          ))}
        </div>
      </div>
    </div>       
  );
};

export default Principal;*/
import React, { useState, useEffect } from "react";
import "../styles/principal.css";

const Principal = ({ postulante }) => {
  const [documentos, setDocumentos] = useState([]);
  const [archivosAdjuntos, setArchivosAdjuntos] = useState({});
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    if (postulante?.documentos?.body) {
      setDocumentos(postulante.documentos.body);
    }
  }, [postulante]);

  const handleAdjuntar = (index) => {
    setArchivosAdjuntos((prevState) => ({
      ...prevState,
      [index]: true, // Marca el documento como adjunto
    }));
  };

  return (
    <div className="principal-container">
      {/* Mensaje de bienvenida */}
      <h2 className="bienvenida">Bienvenido {postulante?.nombre || "Postulante"}, te invitamos a adjuntar todos los documentos requeridos para continuar con tu proceso dentro de la institución.</h2>
      
      {/* Correo debajo del mensaje */}
      <p className="correo">{postulante?.correo || "No disponible"}</p>

      {/* Documentos */}
      <div className="document-container">
        {documentos.length > 0 ? (
          documentos.map((doc, index) => (
            <div key={index} className={`document-item ${archivosAdjuntos[index] ? "adjunto" : ""}`}>
              <span className="document-name">{doc.nombreDocumento}</span>
              
              <div className="boton-container">
                <button className="upload-button" onClick={() => handleAdjuntar(index)}>
                  Adjuntar
                </button>
                
                {archivosAdjuntos[index] && (
                  <span className="check-icon">✔️</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No hay documentos requeridos.</p>
        )}
      </div>
      
      {/* Checkbox de Autorización */}
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="autorizacion"
          checked={autorizado}
          onChange={() => setAutorizado(!autorizado)}
        />
        <label htmlFor="autorizacion">
          Autorizo el tratamiento de mis datos personales conforme a la ley de protección de datos.
        </label>
      </div>
    </div>
  );
};

export default Principal;
