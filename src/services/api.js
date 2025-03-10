import axios from "axios";

const BASE_URL = "https://prod-14.brazilsouth.logic.azure.com/workflows/3dbf040bd4534cba8c4bf51330395b66/triggers/manual/paths/invoke/ObtenerPostulante";

// Función para obtener datos del postulante desde Power Automate
export const obtenerPostulante = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=24-8-v-hbs5uMOyS68MIEcxpbx5KCGrlHfLNjCBhbwU`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna el objeto con id, nombre y correo
  } catch (error) {
    console.error("Error al obtener el postulante:", error);
    throw new Error("No se pudo obtener la información del postulante.");
  }
};