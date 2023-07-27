import axios from 'axios';
import FileModel from '../models/file.model';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

const PUBLIC_DIR = process.env.PUBLICR_DIR || 'public';

interface DownloadOptions {
  extension?: string;
  quality?: string;
}
const downloadFile = async (
  url: string,
  folder: string,
  { extension, quality }: DownloadOptions = {}
): Promise<FileModel> => {
  extension ??= await getFileExtension(url);
  const uniqueFilename = generateUniqueFilename(extension);
  const dir = path.join(PUBLIC_DIR, folder);
  const filePath = path.join(dir, uniqueFilename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  try {
    await dl(url, filePath);
    return new FileModel({
      size: fs.statSync(filePath).size,
      path: filePath,

      quality: quality,
      type: getFileType(extension),
    });
  } catch (error: any) {
    return new FileModel({
      size: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0,
      path: filePath,
      quality: quality,
      type: getFileType(extension),
      errorMessage:
        error.message != undefined
          ? error.message
          : 'Falha oa baixar um arquivo',
    });
  }
};

export default downloadFile;

const dl = async (url: string, filePath: string): Promise<void> => {
  return await new Promise<void>((resolve, reject) => {
    axios
      .get(url, { responseType: 'stream' })
      .then((response) => {
        response.data.pipe(fs.createWriteStream(filePath));
        response.data.on('end', () => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
        response.data.on('error', () => {
          reject('Error while downloading file');
        });
      })
      .catch((err) => reject('Error while downloading file'));
  });
};
const generateUniqueFilename = (ext: string): string => {
  const timestamp = Date.now();

  const uniqueName = `${generateRandomName(8)}_${timestamp}.${ext}`;
  return uniqueName;
};
const getFileExtension = async (url: string): Promise<string> => {
  try {
    const { headers } = await axios.head(url);
    const contentType = headers['content-type'];
    const fileExtension = mime.extension(contentType);
    if (fileExtension) {
      return fileExtension;
    }
  } catch (error) {
    console.error('Error retrieving file extension:', error);
  }
  return 'txt';
};

const generateRandomName = (size: number): string => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomName = '';

  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomName += charset.charAt(randomIndex);
  }

  return randomName;
};

function getFileType(extension: string): string {
  const mimeType = mime.lookup(extension);
  if (mimeType) {
    const value = mimeType.split('/')[0];
    if (value === 'mpga') {
      return 'mp3';
    }
    return value;
  }
  return 'unknown';
}
