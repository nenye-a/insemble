import dotenv from 'dotenv';
dotenv.config();

let SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
let NODE_ENV = process.env.NODE_ENV || 'development';

export { SENDGRID_API_KEY, NODE_ENV };
