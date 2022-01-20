import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.API_DOMAIN}`,
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "deflate, gzip",
    "X-CMC_PRO_API_KEY": `${process.env.X_CMC_PRO_API_KEY}`,
  },
});
