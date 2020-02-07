let isProduction = false;

export const DJANGO_API = isProduction
  ? 'https://localhost:8000/api'
  : 'https://localhost:8000/api'; // TODO: change prod api
