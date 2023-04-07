export interface RegisterResp {
  ok: boolean
}

export interface LoginResp {
  token: string
}

export interface IAppDetail {
  id: string
  name: string
  description: string
  example: string
}

export interface AppListResp {
  data: IAppDetail[]
}
