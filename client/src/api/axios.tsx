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
  // Add other methods as necessary
}

// Define a type that includes only the HTTP methods you're going to support
type RequestMethod = 'get' | 'post'

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
}

const api: ApiWithMethods = {
  get(url, params, config = {}) {
    return sendRequest('get', url, params, config)
  },
  post(url, data, config = {}) {
    return sendRequest('post', url, data, config)
  },
}

export default api
