import downloadFile from '../download_files';
import FileAlreadyDownloadedError from '../../core/file_already_downloaded_error';
import { basename, extname } from 'path';
import { FileModel } from '../../models/file.model';

const { twitter } = require('btch-downloader');

type TwitterReponse = TwitterData[];

interface TwitterData {
  quality: string;
  mimetype: string;
  url: string;
}

const twitterDownload = async (url: string): Promise<FileModel[]> => {
  const sever1 = await twitterServer1(url);
  if (sever1.length > 0) return sever1;

  return [];
};

export default twitterDownload;

const twitterServer1 = async (url: string): Promise<FileModel[]> => {
  var files: FileModel[] = [];
  try {
    const response = (await twitter(url)) as TwitterReponse;
    if (response) {
      return Promise.all(
        response.map((data) =>
          downloadFile(data.url, 'twitter/btch', {
            quality: data.quality != '' ? data.quality : undefined,
          })
        )
      );
    }
  } catch (error) {
    if (error instanceof FileAlreadyDownloadedError) {
      throw error;
    }
    console.error(error);
  }
  return files;
};
