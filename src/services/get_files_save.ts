import { File } from '@prisma/client';
import prisma from '../prisma';

const getSavedFiles = async (url: string): Promise<File[]> => {
  try {
    const savedFiles = await prisma.file.findMany({
      where: {
        url: {
          url,
        },
      },
    });
    return savedFiles;
  } catch (error) {
    console.error('Erro ao obter os arquivos salvos:', error);
    throw error;
  }
};

export default getSavedFiles;
