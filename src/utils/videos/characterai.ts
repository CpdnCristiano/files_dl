import { FileModel } from '../../models/file.model';
import downloadFile from '../download_files';

const characteraiDonwload = async (url: string): Promise<FileModel[]> => {
  return [await downloadFile(url, 'characterai')];
};
export default characteraiDonwload;
