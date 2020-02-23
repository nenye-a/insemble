import dotenv from 'dotenv';
dotenv.config();

let SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
let NODE_ENV = process.env.NODE_ENV || 'development';
let HOST = process.env.HOST || 'http://localhost:4000'; // NOTES: make sure to set HOST on the env for production

export { HOST, NODE_ENV, SENDGRID_API_KEY };
