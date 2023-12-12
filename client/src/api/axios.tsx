import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

interface MethodSpecificHeaders {
  [key: string]: { [key: string]: string }
}

const axiosApi: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

const methodSpecificHeaders: MethodSpecificHeaders = {
  get: {
    Accept: 'application/json',
  },
  post: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  put: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}

// Define a type that includes only the HTTP methods you're going to support
type RequestMethod = 'get' | 'post' | 'put'

const sendRequest = (
  method: RequestMethod,
  url: string,
  data: any,
  config: AxiosRequestConfig = {},
): Promise<AxiosResponse<any>> => {
  const headers = {
    ...methodSpecificHeaders[method],
    ...config.headers,
  }

  const finalConfig = {
    ...config,
    headers,
  }

  switch (method) {
    case 'get':
      return axiosApi.get(url, { ...finalConfig, params: data })
    case 'post':
      return axiosApi.post(url, data, finalConfig)
    case 'put':
      return axiosApi.put(url, data, finalConfig)
    default:
      throw new Error(`Method ${method} is not supported by api object.`)
  }
}

type ApiWithMethods = {
  get: (
    url: string,
    params?: any,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<any>>
  post: (
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<any>>
  put: (
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<any>>
}

const api: ApiWithMethods = {
  get(url, params, config = {}) {
    return sendRequest('get', url, params, config)
  },
  post(url, data, config = {}) {
    return sendRequest('post', url, data, config)
  },
  put(url, data, config = {}) {
    return sendRequest('put', url, data, config)
  },
}

export default api
