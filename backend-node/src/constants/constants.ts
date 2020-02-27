import dotenv from 'dotenv';
import AWS from 'aws-sdk';
dotenv.config();

let SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
let NODE_ENV = process.env.NODE_ENV || 'development';
let HOST = process.env.HOST || 'http://localhost:4000'; // NOTES: make sure to set HOST on the env for production
let FRONTEND_HOST = process.env.FRONTEND_HOST || 'http://localhost:8000'; // NOTES: make sure to set FRONTEND_HOST on the env for production

const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || '';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: 'us-east-2',
});

type S3UploadResult = AWS.S3.ManagedUpload.SendData;

export {
  HOST,
  NODE_ENV,
  SENDGRID_API_KEY,
  FRONTEND_HOST,
  s3,
  AWS_S3_BUCKET,
  S3UploadResult,
};
