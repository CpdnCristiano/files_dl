import axios, { AxiosResponse } from 'axios';
import { load } from 'cheerio';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface SaveigAppResult {
  status: boolean;
  data?: MediaItem[];
  msg?: string;
}

/* //// https://saveig.app/en */
const saveigApp = (url: string): Promise<SaveigAppResult> => {
  return new Promise(async (resolve) => {
    try {
      const response: AxiosResponse<any> = await axios.post(
        'https://v3.saveig.app/api/ajaxSearch',
        new URLSearchParams({
          q: url,
          t: 'media',
          lang: 'en',
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept-Encoding': 'gzip, deflate, br',
            Origin: 'https://saveig.app/en',
            Referer: 'https://saveig.app/en',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'User-Agent': 'PostmanRuntime/7.31.1',
          },
        }
      );

      const json = response.data;
      const $ = load(json.data);
      const data: MediaItem[] = [];

      $('div[class="download-items__btn"]').each((i, e) => {
        const url = $(e).find('a').attr('href');
        if (url) {
          data.push({
            type: url?.match('.jpg') ? 'image' : 'video',
            url: url,
          });
        }
      });
      if (!data.length) {
        return resolve({
          status: false,
        });
      }

      resolve({
        status: true,
        data,
      });
    } catch (e: any) {
      console.log(e);
      return resolve({
        status: false,
        msg: e.message || `Error downloading ${e}`,
      });
    }
  });
};

export default saveigApp;
