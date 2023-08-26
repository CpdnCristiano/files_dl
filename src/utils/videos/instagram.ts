import { FileModel } from '../../models/file.model';
import saveigApp from '../../scrapers/instagram/saveigapp';
import downloadFile from '../download_files';

interface DataInstagramUrlDlResponse {
  type: string;
  url: string;
}

const snapsave = require('snapsave-downloader');

interface SnapsaveResponse {
  developer: string;
  status: boolean;
  data: DataSnapSave[];
}

interface DataSnapSave {
  thumbnail: string;
  url: string;
}
const { igdl } = require('btch-downloader');

interface IgdlResponse {
  wm: string;
  result_count: number;
  url: string[];
}

const instagramVideoDl = async (url: string): Promise<FileModel[]> => {
  const sever1 = await instagramSever1(url);
  if (sever1.length > 0) return sever1;
  const sever2 = await instagramSever2(url);
  if (sever2.length > 0) return sever2;
  const sever3 = await instagramSever3(url);
  if (sever3.length > 0) return sever3;
  return [];
};

export default instagramVideoDl;

const instagramSever1 = async (url: string): Promise<FileModel[]> => {
  var files: FileModel[] = [];
  try {
    const response = await saveigApp(url);
    if (response?.status) {
      const data = response.data ?? [];
      return Promise.all(
        data.map((file) => downloadFile(file.url, 'instagram/save_ig'))
      );
    }
  } catch (error) {
    console.error(error);
  }
  return files;
};

const instagramSever2 = async (url: string): Promise<FileModel[]> => {
  var files: FileModel[] = [];
  try {
    const response = (await snapsave(url)) as SnapsaveResponse;
    if (response?.status) {
      const data = response.data ?? [];
      const links: string[] = [];
      for (const item of data) {
        if (!links.includes(item.url)) {
          links.push(item.url);
        }
      }
      return Promise.all(
        links.map((link) => downloadFile(link, 'instagram/snapsave'))
      );
    }
  } catch (error) {
    console.error(error);
  }
  return files;
};
const instagramSever3 = async (url: string): Promise<FileModel[]> => {
  var files: FileModel[] = [];
  try {
    const response = (await igdl(url)) as IgdlResponse;
    if (response?.url) {
      const data = response?.url ?? [];

      return Promise.all(
        data.map((link) => downloadFile(link, 'instagram/btch'))
      );
    }
  } catch (error) {
    console.error(error);
  }
  return files;
};
