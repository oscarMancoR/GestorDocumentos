import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/principal.css";
import { handleAdjuntar } from "../utiliti/handleAdjuntar";
import { obtenerCarpetaPostulante } from "../services/api";


//definimos los estados 
const Principal = ({ postulante }) => {   //recibimos los documentos  que requiere el postulante como parametro desde app.js
  
  const [documentosObligatorios, setDocumentosObligatorios] = useState([]);
  const [documentosOpcionales, setDocumentosOpcionales] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [archivosAdjuntos, setArchivosAdjuntos] = useState({});
  const [archivosBase64, setArchivosBase64] = useState({});
  const [esperandoRevision, setEsperandoRevision] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [animarBoton, setAnimarBoton] = useState(false);
  const [enviando, setEnviando] = useState(false); // Estado para mostrar el spinner

  //iniciamos con la carga de los documentos requeridos al postulante
  useEffect(() => {
    const cargarDatos = async () => {
      if (!postulante) {  //si el postulante  no existe  se detiene la carga
        setIsLoading(false);
        return;
      }

              // Si es Masculino, agregamos "Certificado situación Militar"
              if (
                postulante.genero === "Masculino" && 
                !postulante.documentos.some(doc => doc.nombreDocumento === "Certificado situación Militar")
              ) {
                postulante.documentos.push({
                  nombreDocumento: "Certificado situación Militar",
                  requerido: "obligatorio"
                });
              }

      // un try catch para  obtener los datos de la carpeta 
      try {
        console.log("🔄 Cargando datos para postulante:", postulante);

        const datosCarpeta = await obtenerCarpetaPostulante(postulante.nombre, postulante.id);
        console.log("📂 Datos de la carpeta:", datosCarpeta);

        //verificamos que la carpeta existe, en caso de no existir  mostramos todos los datos 
        if (!datosCarpeta.existe) {
          console.warn("La carpeta no existe. Mostrando todos los documentos.");
          setEsperandoRevision(false); // bajamos la vandera de la revision de datos ya que no existe la carpeta

           // Separar en obligatorios y opcionales
          const documentosObligatorios = postulante.documentos.filter(doc => doc.requerido === "obligatorio");
          const documentosOpcionales = postulante.documentos.filter(doc => doc.requerido === "opcional");

            // Guardamos en estados separados
          setDocumentosObligatorios(documentosObligatorios.map(doc => ({ nombre: doc.nombreDocumento, adjuntado: null })));
          setDocumentosOpcionales(documentosOpcionales.map(doc => ({ nombre: doc.nombreDocumento, adjuntado: null })));



          //si la carpeta no existe entonces muestra todos los datos de postulante 
          setDocumentos(postulante.documentos.map((doc) => ({ nombre: doc.nombreDocumento, adjuntado: null })));
          return;
        }

        //si la carpeta si existe entonces extrameos los datos 
        let archivosEnCarpeta = [];  // se inicializa con un array vacio para almacenar los nombres de los archivos 
        if (datosCarpeta.archivos) {
          try {
            //Se intenta convertir datosCarpeta.archivos de texto a objeto JavaScript usando JSON.parse().
            const parsedData = JSON.parse(datosCarpeta.archivos);
            //vaidamos que parsedData.body exista y que sea un array.
            if (parsedData.body && Array.isArray(parsedData.body)) { 
              //si se cuemple el if,  recorremos el parsedData.body , y con el split , se divide donde encuentre un . y solo toma la primera parte
              archivosEnCarpeta = parsedData.body.map((archivo) =>
                archivo.nombreArchivo.split(".")[0]
              );
            }
          } catch (error) {
            console.error("❌ Error al parsear archivos de carpeta:", error);
          }
        }
        
     

        // Extraemos solo los nombres de los documentos requeridos
        const nombresDocumentosRequeridos = postulante.documentos.map(doc => doc.nombreDocumento); 

        console.log("📂 Documentos en carpeta sin extensión:", archivosEnCarpeta);
        console.log("📂 Documentos postulante:", nombresDocumentosRequeridos);

        const documentosFaltantes = postulante.documentos.filter(
          (doc) => !archivosEnCarpeta.some(nombre => nombre === doc.nombreDocumento)
        );
                // Filtramos los documentos faltantes en dos categorías
        // Separar en obligatorios y opcionales
        const documentosObligatorios = documentosFaltantes.filter(doc => doc.requerido === "obligatorio");
        const documentosOpcionales = documentosFaltantes.filter(doc => doc.requerido === "opcional");

         // Guardamos en estados separados
        setDocumentosObligatorios(documentosObligatorios.map(doc => ({ nombre: doc.nombreDocumento, adjuntado: null })));
        setDocumentosOpcionales(documentosOpcionales.map(doc => ({ nombre: doc.nombreDocumento, adjuntado: null })));

        console.log("📜 Documentos faltantes faltantes:", documentosFaltantes);
        console.log("📜 Documentos faltantes obligatorios:", documentosObligatorios);
        console.log("📜 Documentos faltantes opcionales:", documentosOpcionales);

        //si hay documentos pendientes  esperandoRevision se coloca en false , solo es true cuando ya no hay mas documentos pendientes
        setEsperandoRevision(documentosFaltantes.length === 0);
        setDocumentos(documentosFaltantes.map((doc) => ({ nombre: doc.nombreDocumento, adjuntado: null })));
        
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        alert("Hubo un error al cargar los datos. Intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, [postulante]);


  //funcion asincrona para enviar los documentos 
  const handleEnviar = async () => {
    // si no hay un postulante la funcion no hace nada
    if (!postulante) return;

    setEnviando(true); // Mostrar spinner
    setAnimarBoton(true); // inicia animacion en el boton

    //cambia la animacion despues de 500 milisegundos
    setTimeout(() => {
      setAnimarBoton(false);
    }, 500);

    //constrimos los datos que vamos a enviar
    const payload = {
      idPostulante: postulante.id,
      nombrePostulante: postulante.nombre,
      documentos: Object.values(archivosBase64),
    };

    //enviar los datos al sevidor
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

  //metodos para activar el button enviar

    // Filtrar solo los documentos obligatorios
    const indicesObligatorios = documentosObligatorios.map((_, index) => `obligatorio-${index}`);
    // Filtrar solo los documentos opcionales
    const indicesOpcionales = documentosOpcionales.map((_, index) => `opcional-${index}`);

    // Verificar si TODOS los documentos obligatorios están adjuntos
    const obligatoriosCompletos = indicesObligatorios.length > 0 && 
    indicesObligatorios.every(key => archivosAdjuntos[key] === "success");

    // Verificar si hay documentos opcionales y si TODOS están adjuntos
    const opcionalesCompletos = indicesOpcionales.length > 0 &&
    indicesOpcionales.every(key => archivosAdjuntos[key] === "success");

    // Determinar si se puede enviar
    const isReadyToSend = 
    (documentosObligatorios.length > 0 && obligatoriosCompletos) ||  // Si hay obligatorios, deben estar completos
    (documentosObligatorios.length === 0 && documentosOpcionales.length > 0 && opcionalesCompletos); // Si no hay obligatorios, revisar opcionales

   // console.log("✅ ¿Listo para enviar?", isReadyToSend);



  //para activar el button de enviar verifica que haya documentos pendientes de enviar, y que todos tengan datos adjuntos
  /*const isReadyToSend = documentos.length > 0 && 
    documentos.every((doc, index) => archivosAdjuntos[index] === "success"); */
   // console.log("📜 Documentos cargados:", documentos);

   console.log(documentos);

  return (
    <div className="principal-container">
      
      <h2 className="bienvenida">
        Bienvenido {postulante?.nombre || "Postulante"}, te invitamos a adjuntar todos los documentos requeridos para continuar con tu proceso dentro de la institución.
      </h2>

      <p className="correo">{postulante?.correo || "No disponible"}</p>

      {/* 🔹 DOCUMENTOS OBLIGATORIOS */}
      <h3 className="titulo-Requerido">Documentos Obligatorios</h3>   
      <hr className="linea-divisoria" />         

      <div className="document-container">
        {isLoading ? (
          <p>⏳ Cargando documentos...</p>
        ) : esperandoRevision ? (
          <p>✅ Esperando por revisar datos.</p>
        ) : documentosObligatorios.length > 0 ? (
          documentosObligatorios.map((doc, index) => (
            <div key={index} className="document-item">
              <span className="document-name">{doc.nombre}</span>
              <div className="boton-container">
                <button className="upload-button" onClick={() => handleAdjuntar(`obligatorio-${index}`, doc.nombre, setArchivosBase64, setArchivosAdjuntos)}>
                  Adjuntar
                </button>
                <span className="status-icon">
                 {archivosAdjuntos[`obligatorio-${index}`] === "success" ? "✅" : archivosAdjuntos[`obligatorio-${index}`] === "error" ? "❌" : ""}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No hay documentos requeridos.</p>
        )}
      </div>

        {/* 🔹 DOCUMENTOS OPCIONALES */}
      <h3 className="titulo-Requerido">Documentos Opcionales</h3>   
      <hr className="linea-divisoria" />  

      <div className="document-container">
        {isLoading ? (
          <p>⏳ Cargando documentos...</p>
        ) : esperandoRevision ? (
          <p>✅ Esperando por revisar datos.</p>
        ) : documentosOpcionales.length > 0 ? (
          documentosOpcionales.map((doc, index) => (
            <div key={index} className="document-item">
              <span className="document-name">{doc.nombre}</span>
              <div className="boton-container">
                <button className="upload-button" onClick={() => handleAdjuntar(`opcional-${index}`, doc.nombre, setArchivosBase64, setArchivosAdjuntos)}>
                  Adjuntar
                </button>
                <span className="status-icon">
                   {archivosAdjuntos[`opcional-${index}`] === "success" ? "✅" : archivosAdjuntos[`opcional-${index}`] === "error" ? "❌" : ""}
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
