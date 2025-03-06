import React, { useState, useEffect } from "react";
import "../styles/principal.css";

const Principal = () => {
  const [isChecked, setIsChecked] = useState(false); // Estado para el checkbox
  const [documentos, setDocumentos] = useState([]); // Estado para almacenar documentos

  // Simulación de carga de documentos desde Dataverse
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
        Bienvenido xxxxx, te invitamos a adjuntar todos los documentos requeridos para 
        continuar con tu proceso dentro de la institución.
      </p>

      {/* Checkbox para aceptar el tratamiento de datos */}
      <div className="checkBox-container">
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

      {/* Contenedor de documentos en dos columnas */}
      <div className="document-container">
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

export default Principal;