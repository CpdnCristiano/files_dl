interface CreateFileOptions {
  size: number;
  path: string;
  errorMessage?: string;
  type?: string;
  quality?: string;
  hash?: string;
}
class FileModel {
  public size: number;
  public path: string;
  public errorMessage?: string;
  public type?: string;
  public quality?: string;
  public hash?: string;

  constructor({
    size,
    path,
    errorMessage,
    quality,
    type,
    hash,
  }: CreateFileOptions) {
    this.size = size;
    this.path = path;
    this.errorMessage = errorMessage;
    this.type = type;
    this.quality = quality;
    this.hash = hash;
  }
}
export default FileModel;
