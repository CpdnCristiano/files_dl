import { File } from '@prisma/client';
import prisma from '../prisma';
import { FileModel } from '../models/file.model';

const createManyFiles = async (
  filesModel: FileModel[],
  url: string
): Promise<File[]> => {
  var urlModel = await prisma.url.update({
    where: { url: url },
    data: {
      files: {
        createMany: {
          data: filesModel.map((fileModel) => {
            return {
              size: fileModel.size,
              path: fileModel.path,
              errorMessage: fileModel.errorMessage,
              quality: fileModel.quality,
              type: fileModel.type,
              hash: fileModel.hash,
            };
          }),
        },
      },
    },
    include: {
      files: true,
    },
  });
  return urlModel.files;
};
export default createManyFiles;
