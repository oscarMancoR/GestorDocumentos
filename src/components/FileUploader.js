import Dexie from "dexie";

const db = new Dexie("FileDatabase");
db.version(1).stores({
  files: "id, name, data",
});

const FileService = {
  async saveFile(documentName, file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        try {
          await db.files.put({
            id: documentName,
            name: file.name,
            data: event.target.result,
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsDataURL(file);
    });
  },

  async getFiles() {
    return await db.files.toArray();
  },

  async getFile(documentName) {
    return await db.files.get(documentName);
  },
};

export default FileService;
