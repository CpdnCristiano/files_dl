export interface FileModel {
  size: number;
  path: string;
  errorMessage?: string;
  type?: string;
  quality?: string;
  mime?: string;
  hash?: string;
}
