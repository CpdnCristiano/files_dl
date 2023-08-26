import { getProvider, isUrl } from '../utils/url_utils';
import { ApiError } from '../core/api_error';
import downloadVideosFromAllPlatforms from '../utils/videos/all';
import getSavedFiles from './get_files_save';
import { File } from '@prisma/client';

import { Host } from '../models/host.enum';
import tikTokVideoDl from '../utils/videos/tiktok';
import createManyFiles from './create_file_on_url';
import createUrlIfNotExists from './create_url_if_not_exists';
import FileAlreadyDownloadedError from '../core/file_already_downloaded_error';
import instagramVideoDl from '../utils/videos/instagram';
import characteraiDonwload from '../utils/videos/characterai';
import twitterDownload from '../utils/videos/twitter';
import { FileModel } from '../models/file.model';
type CallbackFileDl = (url: string) => Promise<FileModel[]>;

const hostDl: any = {
  [Host.TIKTOK]: tikTokVideoDl,
  [Host.INSTAGRAM]: instagramVideoDl,
  [Host.CHARACTERAI]: characteraiDonwload,
  [Host.TWITTER]: twitterDownload,
};

const downloadService = async (url: string): Promise<File[]> => {
  try {
    if (!isUrl(url)) {
      throw new ApiError(400, 'Invalid URL');
    }
    const host = getProvider(url);
    if (host === Host.YOUTUBE || host === Host.FACEBOOK) {
      throw new ApiError(
        400,
        'Agora, estamos baixando vídeos apenas do TikTok, Instagram e Twitter; em breve, incluiremos outras plataformas.'
      );
    }
    if (host === Host.INSTAGRAM) url = url.split('?')[0];
    const savedFiles = await getSavedFiles(url);
    if (savedFiles.length > 0) {
      return savedFiles!;
    }

    let filesModel: FileModel[] = [];

    if (hostDl[host] !== undefined) {
      filesModel = await (hostDl[host] as CallbackFileDl)(url);
    }
    if (filesModel.length == 0)
      filesModel = await downloadVideosFromAllPlatforms(url);

    if (filesModel.length == 0) return [];

    if (filesModel.findIndex((file) => file.errorMessage == 'unknown') === -1) {
      await createUrlIfNotExists(url);
      return await createManyFiles(filesModel, url);
    } else {
      return filesModel.map<File>((file) => {
        return {
          errorMessage: file.errorMessage || null,
          hash: file.hash || null,
          size: file.size,
          path: file.path,
          quality: file.quality || null,
          type: file.type || null,
          urlId: 0,
          id: 0,
        };
      });
    }
  } catch (error) {
    if (error instanceof FileAlreadyDownloadedError) {
      const savedFiles = await getSavedFiles(error.url);
      if (savedFiles.length > 0) {
        return savedFiles!;
      }
      return [];
    } else {
      throw error;
    }
  }
};

export default downloadService;
