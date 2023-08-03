import { tiktokdl } from '@bochilteam/scraper';
import { TiktokDL } from '@tobyg74/tiktok-api-dl';

import FileModel from '../../models/file.model';
import downloadFile from '../download_files';
import assossiateTikTokIdToUrl from '../../services/assosiate_tiktok_id_to_url';
import getTikTokId from '../../services/get_tiktok_id';
import FileAlreadyDownloadedError from '../../core/file_already_downloaded_error';

const { ttdl } = require('btch-downloader');
export interface TtdlReponse {
  title: string;
  title_audio: string;
  thumbnail: string;
  video: string[];
  audio: string[];
  creator: string;
}

const tikTokVideoDl = async (url: string): Promise<FileModel[]> => {
  const sever1 = await tiktokServer1(url);
  if (sever1.length > 0) return sever1;
  const sever2 = await tiktokServer2(url);
  if (sever2.length > 0) return sever2;
  const sever3 = await tiktokServer3(url);
  if (sever3.length > 0) return sever3;
  return [];
};

export default tikTokVideoDl;

const tiktokServer1 = async (url: string): Promise<FileModel[]> => {
  var files: FileModel[] = [];
  try {
    var data = await TiktokDL(url);
    if (data.status == 'success') {
      const result = data.result;
      if (result) {
        const tiktokId = await getTikTokId(result.id);
        if (tiktokId) {
          throw new FileAlreadyDownloadedError(tiktokId.url);
        }
        const links: string[] = [];
        const extension = result.type == 'image' ? 'webp' : 'mp4';
        links.push(
          ...((result.type == 'image' ? result.images : result.video) ?? [])
        );
        const files = await Promise.all([
          ...links.map((link) =>
            downloadFile(link, 'tiktok/tiktok-api-dl/', {
              extension: extension,
            })
          ),
          ...result.music.map((link) =>
            downloadFile(link, 'tiktok/tiktok-api-dl/', {
              extension: 'mp3',
            })
          ),
        ]);
        await assossiateTikTokIdToUrl(result.id, url);
        return files;
      }
    }
  } catch (error) {
    if (error instanceof FileAlreadyDownloadedError) {
      throw error;
    }
    console.error(error);
  }
  return files;
};

const tiktokServer2 = async (url: string): Promise<FileModel[]> => {
  var files: FileModel[] = [];
  try {
    var result = await tiktokdl(url);
    if (result.video) {
      return Promise.all([
        downloadFile(result.video.no_watermark, 'tiktok/tikmate'),
        downloadFile(result.video.no_watermark_hd, 'tiktok/tikmate'),
      ]);
    }
  } catch (error) {
    console.error(error);
  }
  return files;
};

const tiktokServer3 = async (url: string): Promise<FileModel[]> => {
  var files: FileModel[] = [];
  try {
    var result = (await ttdl(url)) as TtdlReponse;
    if (result.video || result.audio) {
      return Promise.all([
        ...result.video.map((v) =>
          downloadFile(v, 'tiktok/btch', { extension: 'mp4' })
        ),
        ...result.audio.map((v) =>
          downloadFile(v, 'tiktok/btch', { extension: 'mp3' })
        ),
      ]);
    }
  } catch (error) {
    console.error(error);
  }
  return files;
};
