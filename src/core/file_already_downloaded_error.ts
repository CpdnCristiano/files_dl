class FileAlreadyDownloadedError extends Error {
  public readonly url: string;
  constructor(url: string, message?: string) {
    super('File has already been downloaded.');
    this.name = 'FileAlreadyDownloadedError';
    this.url = url;
  }
}
export default FileAlreadyDownloadedError;
