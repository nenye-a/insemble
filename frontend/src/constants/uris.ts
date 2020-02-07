let isProduction = false;

// TODO: change prod api
export const DJANGO_API = isProduction ? 'http://localhost:8000/api' : 'http://localhost:8000/api';
