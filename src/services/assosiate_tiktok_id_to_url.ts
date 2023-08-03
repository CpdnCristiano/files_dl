import { TiktokId } from '@prisma/client';
import prisma from '../prisma';

const assossiateTikTokIdToUrl = async (
  id: string,
  uri: string
): Promise<TiktokId> => {
  const newUrl = await prisma.tiktokId.create({
    data: {
      id: id,
      url: uri,
    },
  });
  return newUrl;
};

export default assossiateTikTokIdToUrl;
