import axios from 'axios';
import fs from 'fs';
import path from 'path';
import mime from 'mime';
import getHashOfFile from './hash_file';
import { FileModel } from '../models/file.model';

const PUBLIC_DIR = process.env.PUBLICR_DIR || 'public';

interface DownloadOptions {
  quality?: string;
}

const downloadFile = async (
  url: string,
  folder: string,
  { quality }: DownloadOptions = {}
): Promise<FileModel> => {
  const uniqueFilename = generateUniqueFilename();
  let errorMessage;
  const dir = path.join(PUBLIC_DIR, folder);
  let filePath = path.join(dir, uniqueFilename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  let mimeType;
  try {
    await dl(url, filePath);
    const buffer = fs.readFileSync(filePath);

    const { fileTypeFromBuffer } = await (eval(
      'import("file-type")'
    ) as Promise<typeof import('file-type')>);

    const type = await fileTypeFromBuffer(buffer);

    if (type) {
      mimeType = type.mime;
      const newFilePath = `${filePath}.${type.ext}`;
      fs.renameSync(filePath, newFilePath);
      filePath = newFilePath;
      return {
        size: fs.statSync(filePath).size,
        path: filePath,
        quality: quality,
        type: getFileType(filePath),
        hash: await getHashOfFile(filePath),
        mime: mimeType || mime.lookup(filePath),
      };
    } else {
      errorMessage = 'Não foi possível terminar o tipo desse arquivo';
    }
  } catch (error: any) {
    errorMessage = error.message;

    console.error(error);
  }
  return {
    size: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0,
    path: filePath,
    quality: quality,
    type: getFileType(filePath),
    errorMessage:
      errorMessage != undefined && errorMessage.length <= 100
        ? errorMessage
        : 'unknown',
  };
};

export default downloadFile;

const dl = async (url: string, filePath: string): Promise<void> => {
  return await new Promise<void>((resolve, reject) => {
    axios
      .get(url, {
        responseType: 'stream',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
        },
      })
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
const generateUniqueFilename = (ext?: string): string => {
  const timestamp = Date.now();

  const uniqueName = `${generateRandomName(8)}_${timestamp}`;
  return ext ? `${uniqueName}.${ext}` : uniqueName;
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

function getFileType(path: string): string {
  const mimeType = mime.lookup(path);
  if (mimeType) {
    const value = mimeType.split('/')[0];

    return value;
  }
  return 'unknown';
}
