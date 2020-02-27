import { ReadStream } from 'fs';

export type UploadType = 'TENANT' | 'LANDLORD' | 'MAIN_SPACE' | 'SPACE';

export type UploadFile = {
  createReadStream: () => ReadStream;
  filename: string;
  mimetype: string;
  encoding: string;
};

export type UploadFilePromise = Promise<UploadFile>;
