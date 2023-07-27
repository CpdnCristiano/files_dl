import FileModel from '../models/file.model';
import prisma from '../prisma';

const createManyFiles = async (
  filesModel: FileModel[],
  url: string
): Promise<File> => {
  return await prisma.$transaction<File>(
    filesModel.map((fileModel) =>
      prisma.file.create({
        data: {
          size: fileModel.size,
          path: fileModel.path,
          errorMessage: fileModel.errorMessage,
          quality: fileModel.quality,
          type: fileModel.type,
          url: {
            connect: { url: url },
          },
        },
      })
    )
  );
};
export default createManyFiles;
