import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
// import assert from 'assert'
import { AppListResp, LoginResp, RegisterResp } from './httpSchema'
// import { tfAppData, tfAppListResp, tfAppListSimpleResp } from './transfSchema'
// import Config from '../conf'
// import { OrchestratorException } from '../exception/orchestrator'
// import { logger } from '../logger'
// import { TfRequestError } from '../exception/tfApp'

export interface TfClientOptions {
  host: string
  token: string
  timeout?: number // 请求超时时间,默认 10 * 1000 毫秒
  keepalive?: boolean
  headers?: any
  debug: boolean
}

// const globalAgent = new https.Agent({
//   rejectUnauthorized: false
// })

export class TfAppClient {
  host: string | undefined
  token: string
  timeout: number | undefined
  headers: any
  static debug: boolean
  private readonly instance: AxiosInstance

  constructor (opt: TfClientOptions) {
    if (!opt.host) {
      // assert(false, 'host must be filled')
      console.log(false, 'host must be filled')
    }
    // this.host = opt.host
    // if (!opt.token) {
    //   assert(false, 'token must be filled')
    // }
    this.token = opt.token
    if (opt.timeout) {
      this.timeout = opt.timeout
    }
    if (opt.headers) {
      this.headers = opt.headers
    }
    const initHeaders = this.initHeaders()

    TfAppClient.debug = opt.debug

    const config: AxiosRequestConfig = {
      timeout: opt.timeout === undefined ? 10000 : opt.timeout,
      // httpsAgent: globalAgent,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    }

    // if (opt.keepalive === true) {
    //   config.httpAgent = new http.Agent({ keepAlive: true })
    //   config.httpsAgent = new https.Agent({ keepAlive: true, rejectUnauthorized: false })
    // }
    this.instance = axios.create(config)

    this.instance.interceptors.request.use(function (config: AxiosRequestConfig): any {
      if (config.headers && Object.keys(config.headers).length) { // 自定义了headers
        config.headers = Object.assign(initHeaders, config.headers)
      } else {
        config.headers = initHeaders
      }
      return config
    })

    this.instance.interceptors.response.use(
      TfAppClient.SucceedResponse,
      TfAppClient.ErrResponse
    )
  }

  private static async SucceedResponse (response: AxiosResponse): Promise<any> {
    const resp = response.data
    if (resp?.code !== 0) {
      console.log(`【tfReqClient Err】 => url: ${response.request.URL} --- msg: ${resp.message}`)
      // throw new OrchestratorException(resp.msg, response.status, resp.code)
    }
    return resp
  }

  private static async ErrResponse (error: any): Promise<any> {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(`【tfReqClient Err】 => url: ${error.response.config.url}\ndata: ${JSON.stringify(error.response.data)}`)
      if (TfAppClient.debug) {
        console.log('【tfReqClient Err】 => ', error.response) // debugMode
      }
      if (error.response.status === 401) {
        const d = error.response.data
        // throw new TfRequestError(d.code, d.msg, 401)
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(`【tfReqClient Err】 => url: ${error.request.res.responseUrl}`)
      if (TfAppClient.debug) {
        console.log('【tfReqClient Err】 => ', error.request) // debugMode
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('【tfReqClient Err】 => ', error.message)
    }
    return Promise.reject(error)
  }

  private async get (url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.get(url, config)
  }

  private async post (url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.post(url, data, config)
  }

  private async put (url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.put(url, data, config)
  }

  private async delete (path: string, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.delete(path, config)
  }

  private initHeaders (): any {
    const commonHeaders = {
      Authorization: `Bearer ${this.token}`,
      'tf-client-type': 'ciri'
    }
    if (this.headers) {
      Object.assign(this.headers, commonHeaders)
    } else {
      this.headers = commonHeaders
    }
    return this.headers
  }

  private genUrl (path: string, version = 'v1'): string {
    const p = `/api/${version}${path}`
    // const p = `/api/${version}${path}` // 本地debug地址
    const url = new URL(p, this.host)
    return url.toString()
  }

  public async register (username: string, password: string, email: string): Promise<RegisterResp> {
    const url = this.genUrl('/user/register')
    const data = {
      username,
      password,
      email
    }
    const resp = await this.post(url, data)
    return resp
  }

  public async login (username: string, password: string): Promise<LoginResp> {
    const url = this.genUrl('/user/login')
    const data = {
      username,
      password
    }
    const resp = await this.post(url, data)
    return resp
  }

  public async appList (): Promise<AppListResp> {
    const url = this.genUrl('/app')
    const resp = await this.get(url)
    return resp
  }
}

export function newClient (token: string, keepalive = false, debug = false, headers?: any): TfAppClient {
  const options: TfClientOptions = {
    token,
    // host: Config.RPA_HOST as string,
    host: 'http://192.168.3.128:8000/', // 本地debug地址
    timeout: 10000,
    keepalive,
    debug
  }
  if (headers) {
    options.headers = { ...headers }
  }

  return new TfAppClient(options)
}

