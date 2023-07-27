interface CreateFileOptions {
  size: number;
  path: string;
  errorMessage?: string;
  type?: string;
  quality?: string;
}
class FileModel {
  public size: number;
  public path: string;
  public errorMessage?: string;
  public type?: string;
  public quality?: string;

  constructor({ size, path, errorMessage, quality, type }: CreateFileOptions) {
    this.size = size;
    this.path = path;
    this.errorMessage = errorMessage;
    this.type = type;
    this.quality = quality;
  }
}
export default FileModel;
