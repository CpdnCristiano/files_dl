import { getHost, isUrl } from '../utils/url_utils';
import { ApiError } from '../core/api_error';
import downloadVideosFromAllPlatforms from '../utils/videos/all';
import prisma from '../prisma';
import getSavedFiles from './get_files_save';
import { File } from '@prisma/client';
import createOrFindUrl from './createOrFinUrl';
import FileModel from '../models/file.model';
import { Host } from '../models/host.enum';
type CallbackFileDl = (url: string) => Promise<FileModel[]>;

const hostDl: any = {
  [Host.FACEBOOK]: () => {},

  [Host.TWITTER]: () => {},

  [Host.INSTAGRAM]: () => {},
  [Host.INSTAGRAM_PROFILE]: () => {},
  [Host.PINTEREST]: () => {},
};

const downloadService = async (url: string): Promise<File[]> => {
  if (!isUrl(url)) {
    throw new ApiError(400, 'Invalid URL');
  }

  const savedFiles = await getSavedFiles(url);
  if (savedFiles.length > 0) {
    return savedFiles!;
  }

  let filesModel: FileModel[] = [];
  const host = getHost(url);
  if (hostDl.hasOwnProperty(host)) {
    filesModel = await (hostDl[host] as CallbackFileDl)(url);
  } else {
    filesModel = await downloadVideosFromAllPlatforms(url);
  }
  await createOrFindUrl(url);
  const result: File[] = [];

  for (const fileModel of filesModel) {
    const createdFile = await prisma.file.create({
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
    });
    result.push(createdFile);
  }
  return result;
};

export default downloadService;
