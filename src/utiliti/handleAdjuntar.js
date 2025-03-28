export const handleAdjuntar = (index, documentName, setArchivosBase64, setArchivosAdjuntos) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".pdf,.jpg,.png,.docx"; // Extensiones permitidas

  input.onchange = async (event) => {
    const file = event.target.files[0];

    if (file) {      
  
      //restringir el tamaño de archivo
      const maxSize = 5 * 1024 * 1024; // 5 MB en bytes

      if (file.size > maxSize) {
        alert("El archivo es demasiado grande. Máximo permitido: 5 MB");
        return;
      }


      const extension = file.name.split(".").pop();
      const nombreConExtension = `${documentName}.${extension}`;

      try {
        const base64 = await toBase64(file);
        setArchivosBase64((prevState) => ({
          ...prevState,
          [index]: { nombreDocumento: nombreConExtension, contenidoBase64: base64 },
        }));

        setArchivosAdjuntos((prevState) => ({
          ...prevState,
          [index]: "success",
        }));
      } catch (error) {
        setArchivosAdjuntos((prevState) => ({
          ...prevState,
          [index]: "error",
        }));
      }
    }
  };

  input.click();
};

// Función auxiliar para convertir archivo a Base64
const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
};