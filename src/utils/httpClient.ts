import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Stream } from 'stream'
// import assert from 'assert'
import type {
  AppListResp,
  LoginResp,
  RegisterResp,
  AppDetailResp,
  IAppDetail,
  IChat,
  QrCodeResp
} from './httpSchema'
import { HttpException } from './httpError'
import { backendDomain } from './consts'

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

  constructor(opt: TfClientOptions) {
    if (!opt.host) {
      // assert(false, 'host must be filled')
      console.log(false, 'host must be filled')
    }
    this.host = opt.host
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
    // const initHeaders = this.initHeaders()

    TfAppClient.debug = opt.debug

    const config: AxiosRequestConfig = {
      timeout: opt.timeout === undefined ? 10000 : opt.timeout,
      // httpsAgent: globalAgent,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
      // withCredentials: true
    }
    const token = this.token

    // if (opt.keepalive === true) {
    //   config.httpAgent = new http.Agent({ keepAlive: true })
    //   config.httpsAgent = new https.Agent({ keepAlive: true, rejectUnauthorized: false })
    // }
    this.instance = axios.create(config)

    this.instance.interceptors.request.use(function (config: AxiosRequestConfig): any {
      if (config.headers && token) {
        Object.assign(config.headers, {
          Authorization: `Bearer ${token}`
        })
      }

      return config
    })

    this.instance.interceptors.response.use(TfAppClient.SucceedResponse, TfAppClient.ErrResponse)
  }

  private static async SucceedResponse(response: AxiosResponse): Promise<any> {
    console.log('1111111: ', response)
    const resp = response.data
    if (resp?.code !== 0) {
      console.log(
        `【tfReqClient Err】 => url: ${response.request.URL} --- msg: ${resp.msg} --- code: ${resp.code}`
      )
      throw new HttpException(resp.msg, response.status)
    }
    return resp
  }

  private static async ErrResponse(error: any): Promise<any> {
    console.log(`http error: ${JSON.stringify(error)}`)
    if (error?.response?.data) {
      console.log(`resp error: ${JSON.stringify(error.response)}`)
      throw new HttpException(error.response.data.msg, error.response.status)
    }

    // if (error.response) {
    //   // The request was made and the server responded with a status code
    //   // that falls out of the range of 2xx
    //   console.log(
    //     `【tfReqClient Err】 => url: ${error.response.config.url}\ndata: ${JSON.stringify(
    //       error.response.data
    //     )}`
    //   )
    //   if (TfAppClient.debug) {
    //     console.log('【tfReqClient Err】 => ', error.response) // debugMode
    //   }
    //   if (error.response.status === 401) {
    //     const d = error.response.data
    //     // throw new TfRequestError(d.code, d.msg, 401)
    //   }
    // } else if (error.request) {
    //   // The request was made but no response was received
    //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //   // http.ClientRequest in node.js
    //   console.log(`【tfReqClient Err】 => url: ${error.request.res}`)
    //   if (TfAppClient.debug) {
    //     console.log('【tfReqClient Err】 => ', error.request) // debugMode
    //   }
    // } else {
    //   // Something happened in setting up the request that triggered an Error
    //   console.log('【tfReqClient Err】 => ', error.message)
    // }
    return Promise.reject(error)
  }

  private async get(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.get(url, config)
  }

  private async post(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.post(url, data, config)
  }

  private async put(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.put(url, data, config)
  }

  private async delete(path: string, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.delete(path, config)
  }

  private initHeaders(): any {
    let commonHeaders = {}
    if (this.token) {
      commonHeaders = {
        Authorization: `Bearer ${this.token}`
        // 'tf-client-type': 'ciri'
      }
    }
    if (this.headers) {
      Object.assign(this.headers, commonHeaders)
    } else {
      this.headers = commonHeaders
    }
    return this.headers
  }

  private genUrl(path: string, version = 'v1'): string {
    const p = `/api/${version}${path}`
    // const p = `/api/${version}${path}` // 本地debug地址
    const url = new URL(p, this.host)
    return url.toString()
  }

  public async register(username: string, password: string, email: string): Promise<RegisterResp> {
    const url = this.genUrl('/user/register')
    const data = {
      username,
      password,
      email
    }
    const resp = await this.post(url, data)
    return resp.data
  }

  public async login(username: string, password: string): Promise<LoginResp> {
    const url = this.genUrl('/user/login')
    const data = {
      username,
      password
    }
    const resp = await this.post(url, data)
    return resp.data
  }

  public async fakeLogin(authCode: string): Promise<LoginResp> {
    const url = this.genUrl('/user/login_fake')
    const data = {
      auth_code: authCode
    }
    const resp = await this.post(url, data)
    return resp.data
  }

  public async appList(pageNum: number, pageSize: number, query: string): Promise<AppListResp> {
    const url = this.genUrl('/app')
    console.log(`url:    ${url}`)

    const resp = await this.get(url, {
      params: {
        page_num: pageNum,
        page_size: pageSize,
        query: query
      }
    })
    return resp
  }

  public async appCreate(
    name: string,
    desc: string,
    prompt: string,
    example: string
  ): Promise<AppDetailResp> {
    const url = this.genUrl('/app')
    const data = {
      name: name,
      description: desc,
      prompt_text: prompt,
      example: example
    }
    const resp = await this.post(url, data)
    return resp
  }

  public async appDetail(appId: string): Promise<IAppDetail> {
    const url = this.genUrl(`/app/${appId}`)
    console.log(url)

    const resp = await this.get(url)
    return resp.data
  }

  public async chatLogSave(
    sid: string,
    appId: string,
    appName: string,
    msg: string
  ): Promise<IChat> {
    const url = this.genUrl('/chat/history')
    const data = {
      sid: sid,
      app_id: appId,
      app_name: appName,
      msg: msg
    }
    const resp = await this.post(url, data)
    return resp.data
  }

  public async chat(appId: string, msg: string): Promise<IChat> {
    const url = this.genUrl('/chat')
    const data = {
      app_id: appId,
      query: msg
    }
    const resp = await this.post(url, data)
    return resp.data
  }

  public async chatStream(appId: string, msg: string): Promise<Stream> {
    const url = this.genUrl('/chat/stream')
    const data = {
      app_id: appId,
      query: msg
    }
    const resp = await this.post(url, data)
    return resp
  }

  public async pre_order(amount: number): Promise<QrCodeResp> {
    const url = this.genUrl('/order/pre_trade')
    const data = {
      amount: amount
    }
    const resp = await this.post(url, data)
    return resp.data
  }

  public async left(): Promise<number> {
    const url = this.genUrl('/user/left')
    const resp = await this.get(url)
    return resp.data
  }
}

export function newClient(
  token: string,
  keepalive = false,
  debug = false,
  headers?: any
): TfAppClient {
  const options: TfClientOptions = {
    token,
    // host: Config.RPA_HOST as string,
    // host: 'http://192.168.3.128:8000/', // 本地debug地址
    host: `${backendDomain}/`, // 本地debug地址
    // timeout: 200 * 1000,
    timeout: 200 * 1000,
    keepalive,
    debug
  }
  if (headers) {
    options.headers = { ...headers }
  }

  return new TfAppClient(options)
}
