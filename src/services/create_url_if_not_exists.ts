import { Url } from '@prisma/client';
import prisma from '../prisma';

const createUrlIfNotExists = async (uri: string): Promise<Url> => {
  const existingUrl = await prisma.url.findUnique({
    where: {
      url: uri,
    },
  });

  if (existingUrl) {
    return existingUrl;
  }
  const newUrl = await prisma.url.create({
    data: {
      url: uri,
    },
  });
  return newUrl;
};

export default createUrlIfNotExists;
