import React, { useState, useEffect } from "react";
import "../styles/Documentos.css";

const Documentos = () => {
    // Simulación de documentos (después se reemplazará con datos de Dataverse)
    const [documentos, setDocumentos] = useState([]);

    useEffect(() => {
        // Simulación de carga de documentos desde Dataverse
        const documentosEjemplo = [
            { id: 1, nombre: "Cédula de Identidad" },
            { id: 2, nombre: "Certificado Médico" },
            { id: 3, nombre: "Hoja de Vida" },
        ];
        setDocumentos(documentosEjemplo);
    }, []);

    return (
        <div className="documentos-container">
            <h2>Documentos requeridos</h2>
            <ul>
                {documentos.map((doc) => (
                    <li key={doc.id} className="documento-item">
                        {doc.nombre}
                        <button className="btn-adjuntar">Adjuntar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Documentos;