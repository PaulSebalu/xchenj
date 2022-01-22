import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.API_DOMAIN || `https://xchenj.herokuapp.com`}`,
  headers: {
    "Content-Type": "application/json",
  },
});
