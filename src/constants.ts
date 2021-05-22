import config from './config/config.json';

export const __API_IMAGE_PATH__: string = process.env.API_IMAGE_PATH || '';
export const __API_PORT__: number = parseInt(process.env.pm2_port || '') || config.service.port;
export const __API_ID__: number = parseInt(process.env.pm2_id || '') || config.service.id;
