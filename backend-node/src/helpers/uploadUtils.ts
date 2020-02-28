import { UploadType, UploadFilePromise } from '../types/uploadTypes';
import { s3, AWS_S3_BUCKET, S3UploadResult } from '../constants/constants';

let getUploadFolder = (folder?: UploadType) => {
  switch (folder) {
    case 'TENANT':
      return 'insemble/tenant';
    case 'LANDLORD':
      return 'insemble/landlord';
    case 'MAIN_SPACE':
      return 'insemble/space-main-photos';
    case 'SPACE':
      return 'insemble/space-photos';
    default:
      return 'insemble/default';
  }
};

export async function uploadS3(
  file: UploadFilePromise,
  uploadType?: UploadType,
): Promise<S3UploadResult> {
  let { filename, createReadStream } = await file;
  let fileStream = createReadStream();

  let folder = getUploadFolder(uploadType);

  return s3
    .upload({
      Bucket: AWS_S3_BUCKET,
      Key: `${folder}/${filename}`,
      Body: fileStream,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    })
    .promise();
}
