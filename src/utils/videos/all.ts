import { savefrom } from '@bochilteam/scraper';
import FileModel from '../../models/file.model';
import downloadFile from '../download_files';
const downloadVideosFromAllPlatforms = async (
  url: string
): Promise<FileModel[]> => {
  try {
    var files: FileModel[] = [];
    var result = await savefrom(url);

    if (result) {
      for (let v of result) {
        if (v.url) {
          for (const u of v.url) {
            var file = await downloadFile(u.url, 'savefrom', {
              extension: u.ext,
              quality: u.quality?.toString(),
            });
            files.push(file);
          }
        }
      }
    }
    return files;
  } catch (error) {
    return [];
  }
};
export default downloadVideosFromAllPlatforms;
