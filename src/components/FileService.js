import Dexie from 'dexie';

// Configurar IndexedDB
const db = new Dexie("DocumentUploadDB");
db.version(1).stores({ files: 'id, name, file' });

const FileService = {
  async saveFile(documentName, file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          await db.files.put({ id: documentName, name: file.name, file: reader.result });
          resolve(true);
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

  async clearFiles() {
    await db.files.clear();
  }
};

export default FileService;