import FileModel from '../../models/file.model';
import downloadFile from '../download_files';
import { basename, extname } from 'path';

const characteraiDonwload = async (url: string): Promise<FileModel[]> => {
  return [
    await downloadFile(url, 'characterai', {
      extension: extname(basename(url.split('?')[0])).substring(1),
    }),
  ];
};
export default characteraiDonwload;
