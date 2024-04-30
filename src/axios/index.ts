import axios from 'axios'
const BASE_URL = process.env.NEXT_APP_BEEGIN_DOMAIN

export default axios.create({
  baseURL: BASE_URL
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})
