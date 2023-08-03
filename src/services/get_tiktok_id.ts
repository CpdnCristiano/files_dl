import { TiktokId } from '@prisma/client';
import prisma from '../prisma';

const getTikTokId = async (id: string): Promise<TiktokId | null> => {
  const newUrl = await prisma.tiktokId.findUnique({
    where: {
      id: id,
    },
  });
  return newUrl;
};

export default getTikTokId;
