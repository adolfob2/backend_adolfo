const PUERTO=4001;
export const FRONTEND_URL='http://localhost:3000'; // CONECTANDONOS A REACT
//export const FRONTEND_URL_ANGULAR='http://localhost:4200'; // CONECTANDONOS A ANGULAR

export const JWT_SECRET=process.env.JWT_SECRET;
export const JWT_EXPIRES='1m';

export const JWT_REFRESH_SECRET=process.env.JWT_REFRESH_SECRET
export const JWT_REFRESH_EXPIRES='10h';

export default PUERTO;