import { URL } from 'url';
import { Host } from '../models/host.enum';
const isUrl = (url: string): boolean => {
  const regex = /https?:\/\/[^\s]+/gim;
  return regex.test(url);
};
const isInstagramUrl = (url: string): boolean => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com)\/.*/;
  return regex.test(url) || isInstagramProfileUrl(url);
};

const isInstagramProfileUrl = (url: string): boolean => {
  const regexProfile =
    /^(?:https?:\/\/)?(?:www.)?instagram.com\/[^\/\n]+\/?(?:\?igshid=[^\/\n]+)?$/gm;
  return regexProfile.test(url);
};
const getProvider = (url: string): Host => {
  const { hostname } = new URL(url);
  switch (hostname) {
    case 'twitter.com':
      return Host.TWITTER;
    case 'youtu.be':
    case 'youtube.com':
      return Host.YOUTUBE;
    case 'instagram.com':
    case 'www.instagram.com':
      return Host.INSTAGRAM;
    case 'pinterest.com':
      return Host.PINTEREST;
    case 'tiktok.com':
    case 'vm.tiktok.com':
      return Host.TIKTOK;
    case 'facebook.com':
    case 'm.facebook.com':
    case 'fb.watch':
      return Host.FACEBOOK;
    case 'characterai.io':
    case 'beta.character.ai':
    case 'character.ai':
      return Host.CHARACTERAI;
    default:
      return Host.OTHER;
  }
};

export { isUrl, isInstagramProfileUrl, isInstagramUrl, getProvider };
