import axios from "axios";

const BASE_URL = "https://prod-14.brazilsouth.logic.azure.com/workflows/3dbf040bd4534cba8c4bf51330395b66/triggers/manual/paths/invoke/ObtenerPostulante";

const BASE_URL_CARPETA = "https://prod-30.brazilsouth.logic.azure.com:443/workflows/bdf2b947d32946dda9f495873a3830e3/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=f9SpU9XQensquN-XIGJ-OXT35YNdL8gCxBj7Kt_FaZ0";

// Función para obtener datos del postulante desde Power Automate
export const obtenerPostulante = async (id) => {
  try {
    console.log("🔍 este es el id:", id);
    console.log("🔍 este es la base:", BASE_URL);
    const response = await axios.get(`${BASE_URL}/${id}?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=24-8-v-hbs5uMOyS68MIEcxpbx5KCGrlHfLNjCBhbwU`, {
    
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("🔍 este es la respuesta:", response);  
    return response.data; // Retorna el objeto con id, nombre y correo
  } catch (error) {
    console.error("Error al obtener el postulante:", error);
    throw new Error("No se pudo obtener la información del postulante.");
  }
};


// Función para obtener datos de la carpeta del postulante en Power Automate
export const obtenerCarpetaPostulante = async (nombreUsuario, idUsuario) => {
  try {
    const body = {
      nombreCarpeta: `${nombreUsuario}_${idUsuario}` // Construimos el nombre de la carpeta
    };

    const response = await axios.post(BASE_URL_CARPETA, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; // Retorna los datos de la carpeta (ejemplo: archivos dentro)
  } catch (error) {
    console.error("Error al obtener la carpeta del postulante:", error);
    throw new Error("No se pudo obtener la información de la carpeta.");
  }
};