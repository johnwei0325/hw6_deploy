import axios from 'axios';

const  API_ROOT=
  process.env.NODE_ENV==="production"
    ? "/"
    : "http://localhost:4000/";

export const instance = axios.create({ baseURL: API_ROOT });
// const instance = axios.create({
//   baseURL: `http://localhost:4000/`,
// });

export default instance;

// instance.get('/hi').then((data) => console.log(data));
