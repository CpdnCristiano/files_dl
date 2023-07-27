import { tiktokdl as tk2 } from '@bochilteam/scraper';
import { TiktokDL as tk1 } from '@tobyg74/tiktok-api-dl';

import FileModel from '../../models/file.model';
import downloadFile from '../download_files';

const tikTokVideoDl = async (url: string): Promise<FileModel[]> => {
  const sever1 = await tiktokServer1(url);
  if (sever1.length > 0) return sever1;
  const sever2 = await tiktokServer2(url);
  if (sever2.length > 0) return sever2;
  return [];
};

export default tikTokVideoDl;

const tiktokServer1 = async (url: string): Promise<FileModel[]> => {
  var files: FileModel[] = [];
  try {
    var data = await tk1(url);
    if (data.status == 'success') {
      const result = data.result;
      if (result) {
        const links: string[] = [];
        const extension = result.type == 'image' ? 'webp' : 'mp4';
        links.push(
          ...((result.type == 'image' ? result.images : result.video) ?? [])
        );
        return await Promise.all([
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
      }
    }
  } catch (error) {
    console.error(error);
  }
  return files;
};

const tiktokServer2 = async (url: string): Promise<FileModel[]> => {
  var files: FileModel[] = [];
  try {
    var result = await tk2(url);
    if (result.video) {
      try {
        var file = await downloadFile(
          result.video.no_watermark,
          'tiktok/tikmate'
        );
        files.push(file);
      } catch (error) {}
      try {
        var file = await downloadFile(
          result.video.no_watermark_hd,
          'tiktok/tikmate'
        );
        files.push(file);
      } catch (error) {}
    }
  } catch (error) {
    console.error(error);
  }
  return files;
};
