import { getProvider, isUrl } from '../utils/url_utils';
import { ApiError } from '../core/api_error';
import downloadVideosFromAllPlatforms from '../utils/videos/all';
import getSavedFiles from './get_files_save';
import { File } from '@prisma/client';

import FileModel from '../models/file.model';
import { Host } from '../models/host.enum';
import tikTokVideoDl from '../utils/videos/tiktok';
import createManyFiles from './create_file';
import createUrlIfNotExists from './create_url_if_not_exists';
import prisma from '../prisma';
type CallbackFileDl = (url: string) => Promise<FileModel[]>;

const hostDl: any = {
  [Host.TIKTOK]: tikTokVideoDl,
  [Host.FACEBOOK]: undefined,
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
  const host = getProvider(url);
  if (hostDl[host] !== undefined) {
    filesModel = await (hostDl[host] as CallbackFileDl)(url);
  }
  if (filesModel.length == 0)
    filesModel = await downloadVideosFromAllPlatforms(url);

  const urlModel = await createUrlIfNotExists(url);

  prisma.url.update({
    where: { url: url },
    data: {
      files: {},
    },
  });
};

export default downloadService;
