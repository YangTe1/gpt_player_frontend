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
export interface AppDetailResp {
  data: IAppDetail
}

export interface IChat {
  id: string
  sid: string
  app_id: string
  user_id: string
  user_name: string
  message: string
  chatter: string
}
export interface ChatResp {
  data: IChat
}
