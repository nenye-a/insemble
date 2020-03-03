import shortid from 'shortid';
import { UploadType, UploadFilePromise } from '../types/uploadTypes';
import { s3, AWS_S3_BUCKET, S3UploadResult } from '../constants/constants';

let getUploadFolder = (folder?: UploadType) => {
  switch (folder) {
    case 'TENANT':
      return 'tenant';
    case 'LANDLORD':
      return 'landlord';
    case 'MAIN_SPACE':
      return 'space-main-photos';
    case 'SPACE':
      return 'space-photos';
    default:
      return 'default';
  }
};

export async function uploadS3(
  file: UploadFilePromise,
  uploadType?: UploadType,
): Promise<S3UploadResult> {
  let { createReadStream, mimetype } = await file;
  let fileStream = createReadStream();

  let folder = getUploadFolder(uploadType);

  return s3
    .upload({
      Bucket: AWS_S3_BUCKET,
      Key: `${folder}/${shortid.generate()}`,
      Body: fileStream,
      ContentEncoding: 'base64',
      ContentType: mimetype,
    })
    .promise();
}
