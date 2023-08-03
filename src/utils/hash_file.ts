import { createHash } from 'crypto';
import { createReadStream } from 'fs';
const getHashOfFile = (filePath: string): Promise<string | undefined> => {
  return new Promise((resolve) => {
    const hash = createHash('sha256');
    const input = createReadStream(filePath);

    input.on('readable', () => {
      const data = input.read();
      if (data) {
        hash.update(data);
      } else {
        const hashString = hash.digest('hex');
        resolve(hashString);
      }
    });
    input.on('error', (error) => {
      resolve(undefined);
    });
  });
};

export default getHashOfFile;
