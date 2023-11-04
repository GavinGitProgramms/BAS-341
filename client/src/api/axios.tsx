import axios from 'axios'

axios.defaults.withCredentials = true

const api = axios.create({
  baseURL: '/api',
})

export default api
